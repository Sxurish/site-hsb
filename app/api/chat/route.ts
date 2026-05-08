import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ reply: data.reply || data.message || data.output });
      }
    }

    // Fallback concierge response
    const fallbacks: Record<string, string> = {
      'ia':      'Nossa área de Automação & IA usa n8n, GPT e integrações customizadas para escalar operações. Quer agendar uma conversa com um especialista?',
      'landing': 'Criamos landing pages de alta conversão com copy estratégico e design premium. Me conta mais sobre o seu projeto!',
      'tráfego': 'Gerenciamos Google Ads e Meta Ads com foco em ROAS. Qual é o seu orçamento mensal e segmento?',
      'humano':  'Certo! Vou te conectar com um especialista HSB. Qual o melhor horário para uma conversa rápida?',
    };

    const lower = (message as string).toLowerCase();
    const match = Object.keys(fallbacks).find(k => lower.includes(k));
    const reply = match
      ? fallbacks[match]
      : 'Obrigado pela mensagem! Um especialista da HSB vai entrar em contato em breve. Enquanto isso, explore nossos serviços na página.';

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Ops, tivemos uma instabilidade. Tente novamente ou fale conosco pelo WhatsApp.' }, { status: 500 });
  }
}
