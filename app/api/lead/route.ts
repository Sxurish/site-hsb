import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/server/rate-limit';
import { getIp, captureServerEvent } from '@/lib/server/telemetry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateLimit = createRateLimiter(5, 60_000); // 5 envios/min/ip

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(s: unknown, max: number): string {
  return String(s ?? '').trim().slice(0, max);
}

type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale?: string;
};

function validate(body: unknown): LeadPayload | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'invalid_body' };
  const b = body as Record<string, unknown>;

  const name    = sanitize(b.name, 120);
  const email   = sanitize(b.email, 160);
  const phone   = sanitize(b.phone, 40);
  const message = sanitize(b.message, 2000);
  const locale  = sanitize(b.locale, 16) || undefined;

  if (!name)           return { error: 'name_required' };
  if (!EMAIL_RE.test(email)) return { error: 'email_invalid' };
  if (!phone)          return { error: 'phone_required' };
  if (!message)        return { error: 'message_required' };

  return { name, email, phone, message, locale };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: 'rate_limited' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 30) } }
      );
    }

    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }

    // Honeypot: campo `website` fica invisível pra humanos; bot que preenche
    // recebe um "ok" silencioso e o lead nunca é encaminhado pro n8n.
    const honeypot = sanitize((body as Record<string, unknown>)?.website, 200);
    if (honeypot) {
      await captureServerEvent(ip, 'lead_honeypot_triggered');
      return NextResponse.json({ ok: true });
    }

    const result = validate(body);
    if ('error' in result) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
      // Sem webhook configurado, ainda assim aceita o lead pra UX não quebrar.
      // O lead será perdido — logamos no PostHog pra alertar config faltando.
      await captureServerEvent(ip, 'lead_webhook_missing');
      return NextResponse.json({ ok: true, warning: 'no_webhook_configured' });
    }

    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 12_000);
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'form',
          ...result,
          timestamp: new Date().toISOString(),
        }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);

      if (!res.ok) {
        return NextResponse.json({ ok: false, error: 'webhook_failed' }, { status: 502 });
      }

      await captureServerEvent(ip, 'lead_form_submitted', { locale: result.locale });

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ ok: false, error: 'webhook_timeout' }, { status: 504 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
