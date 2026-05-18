// Service server-only — usa POSTHOG_API_KEY (chave pessoal). Não importar em client.
const API_HOST = process.env.POSTHOG_API_HOST || 'https://eu.posthog.com';

export const POSTHOG_CACHE_TAG = 'posthog-metrics';
// 5 min — dashboard tolera latência; queries HogQL são caras (paga + lenta).
const REVALIDATE_SECONDS = 300;

function getConfig() {
  const apiKey = process.env.POSTHOG_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  if (!apiKey || !projectId) {
    throw new Error('PostHog não configurado: defina POSTHOG_API_KEY e POSTHOG_PROJECT_ID.');
  }
  return { apiKey, projectId };
}

async function hogql(query: string): Promise<{ columns: string[]; results: unknown[][] }> {
  const { apiKey, projectId } = getConfig();
  const res = await fetch(`${API_HOST}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    next: { revalidate: REVALIDATE_SECONDS, tags: [POSTHOG_CACHE_TAG] },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    // Loga server-side; expõe só status pra não vazar project id/hints.
    console.error(`[posthog] HogQL ${res.status}: ${detail.slice(0, 500)}`);
    throw new Error(`PostHog Query API ${res.status}`);
  }
  const data = await res.json();
  return { columns: data.columns ?? [], results: data.results ?? [] };
}

// Clamp + floor de `days` antes de interpolar no HogQL — defesa contra
// NaN/string injection se algum caller passar input não-validado no futuro.
function safeDays(days: number, fallback = 30): number {
  const n = Math.floor(Number(days));
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, 365);
}

export interface DailyPoint {
  date: string;       // 'dd/mm'
  visitors: number;
  sessions: number;
}

// Série diária dos últimos `days` dias.
export async function fetchDailySeries(days = 30): Promise<DailyPoint[]> {
  const d = safeDays(days);
  const { results } = await hogql(`
    SELECT toDate(timestamp) AS day,
           uniq(person_id) AS visitors,
           uniq($session_id) AS sessions
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${d} DAY
    GROUP BY day ORDER BY day
  `);
  // Fuso fixo America/Sao_Paulo pra bucket bater com computeLeadsPerDay
  // (UTC vs local divergia em eventos próximos à meia-noite).
  const fmt = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo',
  });
  return results.map((r) => {
    const date = new Date(String(r[0]));
    return {
      date: fmt.format(date),
      visitors: Number(r[1]) || 0,
      sessions: Number(r[2]) || 0,
    };
  });
}

export interface PeriodTotals {
  visitors: { current: number; previous: number };
  sessions: { current: number; previous: number };
  chatsStarted: { current: number; previous: number };
}

// Totais do período atual vs período anterior (para tendência %).
export async function fetchPeriodTotals(days = 30): Promise<PeriodTotals> {
  const d = safeDays(days);
  const d2 = d * 2;
  const { results } = await hogql(`
    SELECT
      uniq(if(timestamp >= now() - INTERVAL ${d} DAY, person_id, NULL)) AS visitors_cur,
      uniq(if(timestamp >= now() - INTERVAL ${d2} DAY AND timestamp < now() - INTERVAL ${d} DAY, person_id, NULL)) AS visitors_prev,
      uniq(if(timestamp >= now() - INTERVAL ${d} DAY, $session_id, NULL)) AS sessions_cur,
      uniq(if(timestamp >= now() - INTERVAL ${d2} DAY AND timestamp < now() - INTERVAL ${d} DAY, $session_id, NULL)) AS sessions_prev,
      countIf(event = 'chatbot_opened' AND timestamp >= now() - INTERVAL ${d} DAY) AS chats_cur,
      countIf(event = 'chatbot_opened' AND timestamp >= now() - INTERVAL ${d2} DAY AND timestamp < now() - INTERVAL ${d} DAY) AS chats_prev
    FROM events
    WHERE event IN ('$pageview', 'chatbot_opened') AND timestamp >= now() - INTERVAL ${d2} DAY
  `);
  const r = results[0] ?? [];
  const n = (i: number) => Number(r[i]) || 0;
  return {
    visitors: { current: n(0), previous: n(1) },
    sessions: { current: n(2), previous: n(3) },
    chatsStarted: { current: n(4), previous: n(5) },
  };
}

export interface FunnelCounts {
  visitors: number;
  chatOpened: number;
  messageSent: number;
  serviceIdentified: number;
  contactComplete: number;
  completed: number;
}

// Contagem de pessoas distintas em cada etapa do funil (últimos `days` dias).
export async function fetchFunnelCounts(days = 30): Promise<FunnelCounts> {
  const d = safeDays(days);
  const { results } = await hogql(`
    SELECT
      uniqIf(person_id, event = '$pageview') AS visitors,
      uniqIf(person_id, event = 'chatbot_opened') AS chat_opened,
      uniqIf(person_id, event = 'chatbot_message_sent') AS msg_sent,
      uniqIf(person_id, event = 'chatbot_step_reached' AND properties.step = 'service_identified') AS service_id,
      uniqIf(person_id, event = 'chatbot_step_reached' AND properties.step = 'contact_data_complete') AS contact_done,
      uniqIf(person_id, event = 'chatbot_completed') AS completed
    FROM events
    WHERE timestamp >= now() - INTERVAL ${d} DAY
  `);
  const r = results[0] ?? [];
  const n = (i: number) => Number(r[i]) || 0;
  return {
    visitors: n(0),
    chatOpened: n(1),
    messageSent: n(2),
    serviceIdentified: n(3),
    contactComplete: n(4),
    completed: n(5),
  };
}
