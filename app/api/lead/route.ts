import { NextRequest, NextResponse } from 'next/server';
import { PostHog } from 'posthog-node';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX       = 5;
const buckets        = new Map<string, { count: number; resetAt: number }>();

let _ph: PostHog | null = null;
function ph(): PostHog | null {
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

function pseudonymousId(ip: string): string | null {
  const salt = process.env.POSTHOG_ID_SALT;
  if (!salt) return null;
  return 'anon_' + crypto.createHash('sha256').update(ip + '|' + salt).digest('hex').slice(0, 24);
}

function getIp(req: NextRequest): string {
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',').at(-1)!.trim();
  return 'unknown';
}

function rateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (b.count >= RATE_MAX) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

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

    const result = validate(body);
    if ('error' in result) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
      // Sem webhook configurado, ainda assim aceita o lead pra UX não quebrar.
      // O lead será perdido — logamos no PostHog pra alertar config faltando.
      const client = ph();
      const distinctId = pseudonymousId(ip);
      if (client && distinctId) {
        try {
          client.capture({
            distinctId,
            event: 'lead_webhook_missing',
            properties: { source: 'server' },
          });
          await client.flush();
        } catch { /* ignore */ }
      }
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

      const client = ph();
      const distinctId = pseudonymousId(ip);
      if (client && distinctId) {
        try {
          client.capture({
            distinctId,
            event: 'lead_form_submitted',
            properties: { source: 'server', locale: result.locale },
          });
          await client.flush();
        } catch { /* ignore */ }
      }

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ ok: false, error: 'webhook_timeout' }, { status: 504 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
