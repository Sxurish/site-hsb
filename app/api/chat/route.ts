import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/server/rate-limit';
import { getIp, ph, pseudonymousId } from '@/lib/server/telemetry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateLimit = createRateLimiter(10, 60_000); // 10 msgs/min/ip

type Step = 'service_identified' | 'contact_data_collecting' | 'contact_data_complete';

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

    const fb = fallbackReply(cleaned);
    return NextResponse.json({ replies: [fb], reply: fb });
  } catch {
    return NextResponse.json(
      { reply: 'Ops, tivemos uma instabilidade. Tente novamente ou fale conosco pelo WhatsApp.' },
      { status: 500 }
    );
  }
}
