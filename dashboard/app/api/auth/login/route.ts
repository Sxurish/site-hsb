import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createSessionToken, COOKIE_NAME, MAX_AGE_SEC } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Rate limit de login — 5 tentativas/min por IP
const RATE_WINDOW = 60_000;
const RATE_MAX = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  return req.headers.get('x-real-ip')?.trim()
    ?? req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    ?? 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const b = attempts.get(ip);
  if (!b || now > b.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (b.count >= RATE_MAX) return false;
  b.count++;
  return true;
}

// Compara strings em tempo constante para prevenir timing attacks
function safeEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    // Buffers de tamanhos diferentes → false, mas ainda em tempo constante
    if (aBuf.length !== bBuf.length) {
      crypto.timingSafeEqual(aBuf, aBuf); // mantém tempo constante
      return false;
    }
    return crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde 1 minuto.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const { username, password } = (body ?? {}) as { username?: string; password?: string };
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return NextResponse.json({ error: 'Usuário e senha obrigatórios.' }, { status: 400 });
  }

  const validUser = process.env.DASHBOARD_USERNAME;
  const validPass = process.env.DASHBOARD_PASSWORD;
  if (!validUser || !validPass) {
    return NextResponse.json({ error: 'Autenticação não configurada.' }, { status: 503 });
  }

  const userOk = safeEqual(username.trim(), validUser);
  const passOk = safeEqual(password, validPass);

  if (!userOk || !passOk) {
    // Delay fixo antes de responder para dificultar enumeração por timing
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 });
  }

  // Credenciais válidas — emite cookie de sessão
  const token = await createSessionToken(username.trim());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SEC,
    path: '/',
  });
  return res;
}
