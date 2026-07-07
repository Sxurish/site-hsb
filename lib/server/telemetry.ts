// Helpers server-only compartilhados pelas rotas /api/chat e /api/lead.
import { PostHog } from 'posthog-node';
import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

let _ph: PostHog | null = null;

export function ph(): PostHog | null {
  if (_ph) return _ph;
  const key = process.env.POSTHOG_API_KEY;
  if (!key) return null;
  _ph = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  });
  return _ph;
}

export function pseudonymousId(ip: string): string | null {
  const salt = process.env.POSTHOG_ID_SALT;
  // Sem salt configurado não gera ID derivado de IP — evita pseudonimização previsível.
  if (!salt) return null;
  return 'anon_' + crypto.createHash('sha256').update(ip + '|' + salt).digest('hex').slice(0, 24);
}

export function getIp(req: NextRequest): string {
  // x-real-ip é definido pelo proxy/CDN (Vercel/nginx) e não pode ser forjado pelo cliente.
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  // Fallback: último valor do XFF — adicionado pelo proxy mais próximo, não pelo cliente.
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',').at(-1)!.trim();
  return 'unknown';
}

// Captura evento server-side com distinct_id pseudonimizado. No-op se PostHog
// ou salt não configurados; nunca lança (analytics não pode quebrar a rota).
export async function captureServerEvent(
  ip: string,
  event: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  const client = ph();
  const distinctId = pseudonymousId(ip);
  if (!client || !distinctId) return;
  try {
    client.capture({ distinctId, event, properties: { source: 'server', ...properties } });
    await client.flush();
  } catch { /* ignore */ }
}
