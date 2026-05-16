import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const PUBLIC = ['/login', '/reset-password', '/auth'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { supabaseResponse, user } = await updateSession(req);

  const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!user && !isPublic) {
    const url = new URL('/login', req.url);
    if (pathname && pathname !== '/') url.searchParams.set('from', pathname);
    const redirect = NextResponse.redirect(url);
    // CRITICAL: preserva cookies de refresh setados pelo Supabase
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    return redirect;
  }

  if (user && pathname === '/login') {
    const redirect = NextResponse.redirect(new URL('/overview', req.url));
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    return redirect;
  }

  if (user) {
    supabaseResponse.headers.set('x-dashboard-user', user.id);
    supabaseResponse.headers.set('x-dashboard-email', user.email ?? '');
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next|api/webhooks|favicon.ico|robots.txt|.*\\..*).*)'],
};
