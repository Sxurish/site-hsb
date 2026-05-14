import { NextRequest, NextResponse } from 'next/server';

// Rotas que exigem autenticação
const PROTECTED = ['/overview', '/leads', '/funnel', '/insights', '/goals', '/reports'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // TODO: substituir por verificação real de sessão (NextAuth / Supabase Auth)
  // Exemplo com NextAuth:
  //   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //   if (!session) return NextResponse.redirect(new URL('/login', req.url));
  //
  // Exemplo com Supabase Auth:
  //   const { data: { session } } = await supabase.auth.getSession();
  //   if (!session) return NextResponse.redirect(new URL('/login', req.url));

  // Por enquanto, passa direto (auth stub)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
