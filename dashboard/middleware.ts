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
    return NextResponse.redirect(url);
  }

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/overview', req.url));
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
