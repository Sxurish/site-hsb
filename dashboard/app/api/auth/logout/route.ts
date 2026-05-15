import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Apaga o cookie expirando-o imediatamente
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return res;
}
