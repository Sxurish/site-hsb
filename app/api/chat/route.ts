import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/server/rate-limit';
import { getIp, ph, pseudonymousId } from '@/lib/server/telemetry';
import {
  CHAT_MESSAGES, DEFAULT_CHAT_LOCALE, fallbackReply, normalizeChatLocale,
} from '@/lib/server/chat-fallbacks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateLimit = createRateLimiter(10, 60_000); // 10 msgs/min/ip

type Step = 'service_identified' | 'contact_data_collecting' | 'contact_data_complete';

// Remove markdown que a IA às vezes manda apesar do prompt proibir.
function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|\s)\*(\S(?:.*?\S)?)\*(?=\s|[.,!?:;]|$)/g, '$1$2')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(^|\s)_(\S(?:.*?\S)?)_(?=\s|[.,!?:;]|$)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .trim();
}

export async function POST(req: NextRequest) {
  // Locale resolvido cedo pra TODAS as respostas (inclusive 429/400/500)
  // saírem no idioma do visitante. Default: pt-BR.
  let locale = DEFAULT_CHAT_LOCALE;
  try {
    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ reply: CHAT_MESSAGES[locale].invalid }, { status: 400 });
    }
    locale = normalizeChatLocale((body as { locale?: unknown })?.locale);
    const t = CHAT_MESSAGES[locale];

    const ip = getIp(req);
    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { reply: t.rateLimited },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 30) } }
      );
    }

    const message = (body as { message?: unknown })?.message;
    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ reply: t.invalid }, { status: 400 });
    }
    const cleaned = message.trim().slice(0, 500);

    const rawSession = (body as { sessionId?: unknown })?.sessionId;
    const sessionId = typeof rawSession === 'string' && rawSession.length <= 128
      ? rawSession.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 64) || undefined
      : undefined;

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ reply: fallbackReply(cleaned, locale) });
    }

    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 12_000);
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // locale segue pro n8n — o workflow pode instruir a IA a responder
        // no idioma do visitante.
        body: JSON.stringify({ message: cleaned, locale, ...(sessionId ? { sessionId } : {}) }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json().catch(() => null) as
          | { replies?: unknown; reply?: string; message?: string; output?: string; step?: Step }
          | null;

        // Novo contrato: array de bolhas. Fallback: string única vinda dos campos legados.
        const repliesArr = Array.isArray(data?.replies)
          ? (data!.replies as unknown[]).map((s) => stripMarkdown(String(s ?? ''))).filter(Boolean).slice(0, 5)
          : [];
        const singleReply = stripMarkdown(data?.reply || data?.message || data?.output || '');
        const replies = repliesArr.length ? repliesArr : (singleReply ? [singleReply] : []);
        const step = data?.step;

        if (replies.length) {
          const client = ph();
          const distinctId = pseudonymousId(ip);
          if (client && distinctId && step) {
            try {
              client.capture({
                distinctId,
                event: 'chatbot_step_reached',
                properties: { step, source: 'server' },
              });
              if (step === 'contact_data_complete') {
                client.capture({
                  distinctId,
                  event: 'chatbot_completed',
                  properties: { source: 'server' },
                });
              }
              await client.flush();
            } catch { /* ignore */ }
          }
          return NextResponse.json({
            replies,
            reply: replies.join('\n\n'),
            ...(step ? { step } : {}),
          });
        }
      }
    } catch {
      // fallthrough → fallback
    }

    const fb = fallbackReply(cleaned, locale);
    return NextResponse.json({ replies: [fb], reply: fb });
  } catch {
    return NextResponse.json(
      { reply: CHAT_MESSAGES[locale].internal },
      { status: 500 }
    );
  }
}
