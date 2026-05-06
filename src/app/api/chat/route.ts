import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // --------------------------------------------------------------------------------
    // INTEGRAÇÃO N8N:
    // Aqui você deve colocar a URL do seu Webhook do n8n que vai receber as mensagens.
    // Exemplo: https://n8n.sua-agencia.com/webhook/chat-hsb
    // --------------------------------------------------------------------------------
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

    if (!N8N_WEBHOOK_URL) {
      // Fake response for development/demo purposes when n8n is not configured
      return NextResponse.json({ 
        reply: `[Demo Mode] Você disse: "${message}". Configure a variável N8N_WEBHOOK_URL para habilitar a inteligência do bot.` 
      });
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, source: 'website_widget' }),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Supondo que o n8n responda com { reply: "texto" }
    return NextResponse.json({ reply: data.reply || 'Mensagem recebida.' });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
