// Service server-only — usa POSTHOG_API_KEY (chave pessoal). Não importar em client.
import { previousRange, type DateRange } from '@/lib/date-range';

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
    console.error(`[posthog] HogQL ${res.status}: ${detail.slice(0, 500)}`);
    throw new Error(`PostHog Query API ${res.status}`);
  }
  const data = await res.json();
  return { columns: data.columns ?? [], results: data.results ?? [] };
}

// Format Date como 'YYYY-MM-DD HH:MM:SS' UTC — formato fechado e seguro pra interpolar.
// HogQL aceita literal date em UTC. Range já vem com offset SP aplicado em date-range.ts.
function toHogTs(d: Date): string {
  // Defensivo: nunca interpolar Date inválida no SQL.
  const t = d.getTime();
  if (!Number.isFinite(t)) throw new Error('Invalid Date passed to HogQL');
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export interface DailyPoint {
  date: string;       // 'dd/mm'
  visitors: number;
  sessions: number;
}

export async function fetchDailySeries(range: DateRange): Promise<DailyPoint[]> {
  const from = toHogTs(range.from);
  const to = toHogTs(range.to);
  const { results } = await hogql(`
    SELECT toDate(timestamp) AS day,
           uniq(person_id) AS visitors,
           uniq($session_id) AS sessions
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= toDateTime('${from}')
      AND timestamp <= toDateTime('${to}')
    GROUP BY day ORDER BY day
  `);
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

// Totais do período atual vs período anterior (mesmo nº de dias) — usado pra trend %.
export async function fetchPeriodTotals(range: DateRange): Promise<PeriodTotals> {
  const prev = previousRange(range);
  const curFrom = toHogTs(range.from);
  const curTo = toHogTs(range.to);
  const prevFrom = toHogTs(prev.from);
  const prevTo = toHogTs(prev.to);
  const { results } = await hogql(`
    SELECT
      uniq(if(timestamp >= toDateTime('${curFrom}') AND timestamp <= toDateTime('${curTo}'), person_id, NULL)) AS visitors_cur,
      uniq(if(timestamp >= toDateTime('${prevFrom}') AND timestamp <= toDateTime('${prevTo}'), person_id, NULL)) AS visitors_prev,
      uniq(if(timestamp >= toDateTime('${curFrom}') AND timestamp <= toDateTime('${curTo}'), $session_id, NULL)) AS sessions_cur,
      uniq(if(timestamp >= toDateTime('${prevFrom}') AND timestamp <= toDateTime('${prevTo}'), $session_id, NULL)) AS sessions_prev,
      countIf(event = 'chatbot_opened' AND timestamp >= toDateTime('${curFrom}') AND timestamp <= toDateTime('${curTo}')) AS chats_cur,
      countIf(event = 'chatbot_opened' AND timestamp >= toDateTime('${prevFrom}') AND timestamp <= toDateTime('${prevTo}')) AS chats_prev
    FROM events
    WHERE event IN ('$pageview', 'chatbot_opened')
      AND timestamp >= toDateTime('${prevFrom}') AND timestamp <= toDateTime('${curTo}')
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

export async function fetchFunnelCounts(range: DateRange): Promise<FunnelCounts> {
  const from = toHogTs(range.from);
  const to = toHogTs(range.to);
  const { results } = await hogql(`
    SELECT
      uniqIf(person_id, event = '$pageview') AS visitors,
      uniqIf(person_id, event = 'chatbot_opened') AS chat_opened,
      uniqIf(person_id, event = 'chatbot_message_sent') AS msg_sent,
      uniqIf(person_id, event = 'chatbot_step_reached' AND properties.step = 'service_identified') AS service_id,
      uniqIf(person_id, event = 'chatbot_step_reached' AND properties.step = 'contact_data_complete') AS contact_done,
      uniqIf(person_id, event = 'chatbot_completed') AS completed
    FROM events
    WHERE timestamp >= toDateTime('${from}') AND timestamp <= toDateTime('${to}')
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
