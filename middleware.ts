import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Roda em todas as rotas exceto: /api, /_next, /_vercel, /ingest (proxy reverso PostHog),
  // arquivos com extensão (.svg, .png, etc.)
  matcher: ['/((?!api|_next|_vercel|ingest|.*\\..*).*)'],
};
