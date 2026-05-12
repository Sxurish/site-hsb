import { NextRequest, NextResponse } from 'next/server';
import { PostHog } from 'posthog-node';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Rate limit em memória — suficiente pra single-instance.
// Para produção multi-region, troque por Upstash/Redis.
const RATE_WINDOW_MS = 60_000;        // 1 min
const RATE_MAX       = 10;            // 10 msgs/min/ip
const buckets        = new Map<string, { count: number; resetAt: number }>();

type Step = 'service_identified' | 'contact_data_collecting' | 'contact_data_complete';

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

function pseudonymousId(ip: string): string {
  const salt = process.env.POSTHOG_ID_SALT || 'hsb-default-salt';
  return 'anon_' + crypto.createHash('sha256').update(ip + '|' + salt).digest('hex').slice(0, 24);
}

function getIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') || 'unknown';
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

const FALLBACKS: Record<string, string> = {
  ia:      'Nossa área de Automação & IA usa n8n, GPT e integrações customizadas para escalar operações. Quer agendar uma conversa com um especialista?',
  landing: 'Criamos landing pages de alta conversão com copy estratégico e design premium. Me conta mais sobre o seu projeto!',
  tráfego: 'Gerenciamos Google Ads e Meta Ads com foco em ROAS. Qual é o seu orçamento mensal e segmento?',
  trafego: 'Gerenciamos Google Ads e Meta Ads com foco em ROAS. Qual é o seu orçamento mensal e segmento?',
  humano:  'Certo! Vou te conectar com um especialista HSB. Qual o melhor horário para uma conversa rápida?',
  seo:     'Trabalhamos SEO técnico, conteúdo e SEO local em SP. Você já tem site e o que mais te incomoda hoje no orgânico?',
  preço:   'O investimento varia por escopo. Me conta o objetivo principal e te trago uma faixa em segundos.',
  preco:   'O investimento varia por escopo. Me conta o objetivo principal e te trago uma faixa em segundos.',
  vídeo:   'Produzimos vídeos cinematográficos e pacotes de criativos pra mídia. Qual o uso principal — campanha, branding ou social?',
  video:   'Produzimos vídeos cinematográficos e pacotes de criativos pra mídia. Qual o uso principal — campanha, branding ou social?',
};

function fallbackReply(message: string): string {
  const lower = message.toLowerCase();
  const match = Object.keys(FALLBACKS).find((k) => lower.includes(k));
  return match
    ? FALLBACKS[match]!
    : 'Obrigado pela mensagem! Um especialista da HSB vai entrar em contato em breve. Enquanto isso, explore nossos serviços na página.';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { reply: 'Calma aí 🙂 muitas mensagens em sequência. Aguarde um instante e tente de novo.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 30) } }
      );
    }

    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ reply: 'Mensagem inválida.' }, { status: 400 });
    }

    const message = (body as { message?: unknown })?.message;
    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ reply: 'Envie um texto válido.' }, { status: 400 });
    }
    const cleaned = message.trim().slice(0, 500);

    const rawSession = (body as { sessionId?: unknown })?.sessionId;
    const sessionId = typeof rawSession === 'string' && rawSession.length <= 128
      ? rawSession.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 64) || undefined
      : undefined;

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ reply: fallbackReply(cleaned) });
    }

    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 12_000);
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleaned, ...(sessionId ? { sessionId } : {}) }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json().catch(() => null) as
          | { reply?: string; message?: string; output?: string; step?: Step }
          | null;
        const reply = data?.reply || data?.message || data?.output;
        const step = data?.step;

        if (reply) {
          const client = ph();
          if (client) {
            const distinctId = pseudonymousId(ip);
            try {
              if (step) {
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
              }
              await client.flush();
            } catch { /* ignore */ }
          }
          return NextResponse.json({ reply, ...(step ? { step } : {}) });
        }
      }
    } catch {
      // fallthrough → fallback
    }

    return NextResponse.json({ reply: fallbackReply(cleaned) });
  } catch {
    return NextResponse.json(
      { reply: 'Ops, tivemos uma instabilidade. Tente novamente ou fale conosco pelo WhatsApp.' },
      { status: 500 }
    );
  }
}
