import type { MetadataRoute } from 'next';

const SITE = 'https://hsb.company';

// Rotas privadas ficam fora do índice; todo o resto liberado — inclusive
// crawlers de IA (AEO): o site aparecer nas respostas de ChatGPT/Claude/
// Perplexity é canal de aquisição.
const PRIVATE = ['/api/', '/ingest/'];

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      { userAgent: ['Googlebot', 'Bingbot'], allow: '/', disallow: PRIVATE },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: '/', disallow: PRIVATE })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
