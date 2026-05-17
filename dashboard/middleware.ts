import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const PUBLIC = ['/login', '/reset-password', '/auth'];

// Garante que `from=...` no redirect pro login sempre seja um path interno.
function safePath(pathname: string): string | null {
  if (!pathname || pathname === '/') return null;
  if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.startsWith('/\\')) return null;
  return pathname;
}

// Nonce base64 (Edge-compat: usa Web Crypto + btoa, sem Node Buffer).
function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str);
}

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // 'strict-dynamic' confia em scripts carregados via scripts com nonce;
    // ignora 'self' e whitelists — modelo recomendado pelo CSP3 / Next.js.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // styled-jsx / Tailwind precisam de inline styles — risco baixo.
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

function applyCsp(res: NextResponse, csp: string) {
  res.headers.set('Content-Security-Policy', csp);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Gera nonce e propaga via request header pra server components lerem.
  const nonce = generateNonce();
  const csp = buildCsp(nonce);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  // 2. Resolve sessão Supabase + monta resposta base com headers propagados.
  const { supabaseResponse, user } = await updateSession(req, requestHeaders);

  const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!user && !isPublic) {
    const url = new URL('/login', req.url);
    const from = safePath(pathname);
    if (from) url.searchParams.set('from', from);
    const redirect = NextResponse.redirect(url);
    // CRITICAL: preserva cookies de refresh setados pelo Supabase
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    applyCsp(redirect, csp);
    return redirect;
  }

  if (user && pathname === '/login') {
    const redirect = NextResponse.redirect(new URL('/overview', req.url));
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    applyCsp(redirect, csp);
    return redirect;
  }

  if (user) {
    supabaseResponse.headers.set('x-dashboard-user', user.id);
    supabaseResponse.headers.set('x-dashboard-email', user.email ?? '');
  }

  applyCsp(supabaseResponse, csp);
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next|api/webhooks|favicon.ico|robots.txt|.*\\..*).*)'],
};
