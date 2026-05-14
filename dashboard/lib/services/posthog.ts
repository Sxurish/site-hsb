// Stub para futura integração com PostHog API (server-side)
// Setup:
//   npm install posthog-node
//   POSTHOG_API_KEY=... e POSTHOG_PROJECT_ID=... em .env.local
//
// Documentação: https://posthog.com/docs/api/query

export interface PostHogMetrics {
  uniqueVisitors: number;
  sessions: number;
  chatbotOpened: number;
  chatbotCompleted: number;
  leadFormSubmitted: number;
}

export async function fetchSiteMetrics(_from: string, _to: string): Promise<PostHogMetrics> {
  // TODO: implementar queries via PostHog Query API
  // const res = await fetch(`https://eu.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/query/`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${process.env.POSTHOG_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     query: {
  //       kind: 'TrendsQuery',
  //       series: [{ kind: 'EventsNode', event: '$pageview', math: 'dau' }],
  //       dateRange: { date_from: _from, date_to: _to },
  //     },
  //   }),
  // });
  // const data = await res.json();
  // return data;
  throw new Error('PostHog não configurado. Usando dados mockados.');
}

export async function fetchFunnelData(): Promise<number[]> {
  // TODO: buscar dados de funil do PostHog
  throw new Error('PostHog não configurado.');
}
