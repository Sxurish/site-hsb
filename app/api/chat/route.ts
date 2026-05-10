import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Rate limit em memória — suficiente pra single-instance.
// Para produção multi-region, troque por Upstash/Redis.
const RATE_WINDOW_MS = 60_000;        // 1 min
const RATE_MAX       = 10;            // 10 msgs/min/ip
const buckets        = new Map<string, { count: number; resetAt: number }>();

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

    const webhookUrl = process.env.N8N_WEBHOOK_URL ?? 'https://kaykywbraz.app.n8n.cloud/webhook/hsb-chatbot-site';

    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 12_000);
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleaned }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json().catch(() => null) as
          | { reply?: string; message?: string; output?: string }
          | null;
        const reply = data?.reply || data?.message || data?.output;
        if (reply) return NextResponse.json({ reply });
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
