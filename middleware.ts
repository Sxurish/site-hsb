import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

// Nonce base64 (Edge-compat: Web Crypto + btoa, sem Node Buffer).
function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str);
}

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // 'strict-dynamic' + nonce: confia em scripts carregados pelos scripts com nonce
    // (chunks do Next) e ignora whitelists. Modelo recomendado pelo CSP3.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // Tailwind/styled-jsx injetam estilos inline — risco baixo.
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    // PostHog vai via proxy reverso /ingest (mesmo origin); n8n é server-side apenas.
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

export default function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Propaga nonce + CSP via request headers. O next-intl clona request.headers
  // (new Headers(request.headers)) ao montar a resposta, então o Next.js lê o
  // nonce do header CSP e o injeta automaticamente nos scripts inline.
  request.headers.set('x-nonce', nonce);
  request.headers.set('Content-Security-Policy', csp);

  const response = handleI18nRouting(request);
  // O browser precisa do header na resposta pra enforçar a policy.
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  // Roda em todas as rotas exceto: /api, /_next, /_vercel, /ingest (proxy reverso PostHog),
  // arquivos com extensão (.svg, .png, etc.)
  matcher: ['/((?!api|_next|_vercel|ingest|.*\\..*).*)'],
};
