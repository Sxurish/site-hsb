import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from './lib/session';

const PROTECTED = ['/overview', '/leads', '/funnel', '/insights', '/goals', '/reports', '/settings'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return redirectToLogin(req, pathname);
  }

  const userId = await verifySessionToken(token);
  if (!userId) {
    // Token inválido ou expirado — redireciona e limpa o cookie
    const res = redirectToLogin(req, pathname);
    res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return res;
  }

  // Passa a identidade para os headers (útil para server components)
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-dashboard-user', userId);
  return NextResponse.next({ request: { headers: reqHeaders } });
}

function redirectToLogin(req: NextRequest, from: string) {
  const url = new URL('/login', req.url);
  if (from && from !== '/') url.searchParams.set('from', from);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
