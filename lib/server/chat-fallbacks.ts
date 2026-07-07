// Fallbacks localizados do chatbot — usados quando o n8n está indisponível
// ou não configurado. Mantém o concierge útil nos 6 idiomas do site.

export const CHAT_LOCALES = ['pt-BR', 'en', 'es', 'fr', 'de', 'zh-CN'] as const;
export type ChatLocale = (typeof CHAT_LOCALES)[number];
export const DEFAULT_CHAT_LOCALE: ChatLocale = 'pt-BR';

// Aceita qualquer BCP-47 vindo do cliente e resolve pro locale mais próximo.
export function normalizeChatLocale(raw: unknown): ChatLocale {
  if (typeof raw !== 'string') return DEFAULT_CHAT_LOCALE;
  const v = raw.trim().slice(0, 16);
  if ((CHAT_LOCALES as readonly string[]).includes(v)) return v as ChatLocale;
  const byPrefix: Record<string, ChatLocale> = {
    pt: 'pt-BR', en: 'en', es: 'es', fr: 'fr', de: 'de', zh: 'zh-CN',
  };
  return byPrefix[v.toLowerCase().split('-')[0] ?? ''] ?? DEFAULT_CHAT_LOCALE;
}

type Topic = 'ai' | 'landing' | 'ads' | 'human' | 'seo' | 'price' | 'video';

// Primeira correspondência vence — mesma ordem do mapa PT original.
const TOPIC_ORDER: Topic[] = ['ai', 'landing', 'ads', 'human', 'seo', 'price', 'video'];

const KEYWORDS: Record<ChatLocale, Record<Topic, string[]>> = {
  'pt-BR': {
    ai:      ['ia', 'automação', 'automacao', 'inteligência artificial', 'inteligencia artificial', 'chatbot'],
    landing: ['landing', 'site'],
    ads:     ['tráfego', 'trafego', 'anúncio', 'anuncio', 'ads'],
    human:   ['humano', 'atendente', 'pessoa'],
    seo:     ['seo', 'orgânico', 'organico'],
    price:   ['preço', 'preco', 'valor', 'orçamento', 'orcamento', 'quanto custa', 'investimento'],
    video:   ['vídeo', 'video', 'audiovisual'],
  },
  en: {
    ai:      ['ai', 'automation', 'artificial intelligence', 'chatbot'],
    landing: ['landing', 'website', 'site'],
    ads:     ['traffic', 'ads', 'advertising', 'paid media'],
    human:   ['human', 'person', 'someone', 'agent'],
    seo:     ['seo', 'organic', 'ranking'],
    price:   ['price', 'pricing', 'cost', 'budget', 'how much', 'quote'],
    video:   ['video', 'film', 'audiovisual'],
  },
  es: {
    ai:      ['ia', 'automatización', 'automatizacion', 'inteligencia artificial', 'chatbot'],
    landing: ['landing', 'sitio', 'web'],
    ads:     ['tráfico', 'trafico', 'anuncios', 'ads', 'publicidad'],
    human:   ['humano', 'persona', 'asesor'],
    seo:     ['seo', 'orgánico', 'organico', 'posicionamiento'],
    price:   ['precio', 'coste', 'costo', 'presupuesto', 'cuánto', 'cuanto', 'inversión', 'inversion'],
    video:   ['vídeo', 'video', 'audiovisual'],
  },
  fr: {
    ai:      ['ia', 'automatisation', 'intelligence artificielle', 'chatbot'],
    landing: ['landing', 'site'],
    ads:     ['trafic', 'publicité', 'publicite', 'ads'],
    human:   ['humain', 'conseiller'],
    seo:     ['seo', 'référencement', 'referencement', 'organique'],
    price:   ['prix', 'tarif', 'budget', 'combien', 'coût', 'cout', 'devis'],
    video:   ['vidéo', 'video', 'audiovisuel'],
  },
  de: {
    ai:      ['ki', 'automatisierung', 'künstliche intelligenz', 'kunstliche intelligenz', 'chatbot'],
    landing: ['landing', 'landingpage', 'website', 'webseite'],
    ads:     ['traffic', 'anzeigen', 'werbung', 'ads'],
    human:   ['mensch', 'mitarbeiter', 'berater', 'jemand'],
    seo:     ['seo', 'organisch', 'ranking'],
    price:   ['preis', 'kosten', 'budget', 'wie viel', 'wieviel', 'angebot'],
    video:   ['video', 'film', 'audiovisuell'],
  },
  'zh-CN': {
    ai:      ['ai', '人工智能', '自动化', '智能'],
    landing: ['落地页', '着陆页', '网站', '页面'],
    ads:     ['投放', '广告', '流量'],
    human:   ['人工', '真人', '专员'],
    seo:     ['seo', '搜索引擎', '排名'],
    price:   ['价格', '费用', '预算', '多少钱', '报价'],
    video:   ['视频', '影片', '影音'],
  },
};

const REPLIES: Record<ChatLocale, Record<Topic, string>> = {
  'pt-BR': {
    ai:      'Nossa área de Automação & IA usa n8n, GPT e integrações customizadas para escalar operações. Quer agendar uma conversa com um especialista?',
    landing: 'Criamos landing pages de alta conversão com copy estratégico e design premium. Me conta mais sobre o seu projeto!',
    ads:     'Gerenciamos Google Ads e Meta Ads com foco em ROAS. Qual é o seu orçamento mensal e segmento?',
    human:   'Certo! Vou te conectar com um especialista HSB. Qual o melhor horário para uma conversa rápida?',
    seo:     'Trabalhamos SEO técnico, conteúdo e SEO local em SP. Você já tem site e o que mais te incomoda hoje no orgânico?',
    price:   'O investimento varia por escopo. Me conta o objetivo principal e te trago uma faixa em segundos.',
    video:   'Produzimos vídeos cinematográficos e pacotes de criativos pra mídia. Qual o uso principal — campanha, branding ou social?',
  },
  en: {
    ai:      'Our Automation & AI team uses n8n, GPT and custom integrations to scale operations. Want to schedule a chat with a specialist?',
    landing: 'We build high-converting landing pages with strategic copy and premium design. Tell me more about your project!',
    ads:     'We manage Google Ads and Meta Ads with a focus on ROAS. What is your monthly budget and industry?',
    human:   'Sure! I will connect you with an HSB specialist. What is the best time for a quick call?',
    seo:     'We do technical SEO, content and local SEO. Do you already have a website, and what bothers you most about your organic traffic today?',
    price:   'Investment depends on scope. Tell me your main goal and I will give you a range in seconds.',
    video:   'We produce cinematic videos and creative packs for media. What is the main use — campaign, branding or social?',
  },
  es: {
    ai:      'Nuestra área de Automatización e IA usa n8n, GPT e integraciones personalizadas para escalar operaciones. ¿Quieres agendar una conversación con un especialista?',
    landing: 'Creamos landing pages de alta conversión con copy estratégico y diseño premium. ¡Cuéntame más sobre tu proyecto!',
    ads:     'Gestionamos Google Ads y Meta Ads con foco en ROAS. ¿Cuál es tu presupuesto mensual y tu sector?',
    human:   '¡Claro! Te conecto con un especialista de HSB. ¿Cuál es el mejor horario para una conversación rápida?',
    seo:     'Trabajamos SEO técnico, contenido y SEO local. ¿Ya tienes sitio web y qué es lo que más te molesta hoy del tráfico orgánico?',
    price:   'La inversión varía según el alcance. Cuéntame tu objetivo principal y te doy un rango en segundos.',
    video:   'Producimos vídeos cinematográficos y paquetes de creativos para medios. ¿Cuál es el uso principal: campaña, branding o social?',
  },
  fr: {
    ai:      "Notre pôle Automatisation & IA utilise n8n, GPT et des intégrations sur mesure pour faire passer vos opérations à l'échelle. Voulez-vous planifier un échange avec un spécialiste ?",
    landing: 'Nous créons des landing pages à forte conversion avec un copywriting stratégique et un design premium. Parlez-moi de votre projet !',
    ads:     'Nous gérons Google Ads et Meta Ads avec un focus sur le ROAS. Quel est votre budget mensuel et votre secteur ?',
    human:   'Très bien ! Je vous mets en relation avec un spécialiste HSB. Quel est le meilleur créneau pour un échange rapide ?',
    seo:     "Nous travaillons le SEO technique, le contenu et le SEO local. Avez-vous déjà un site, et qu'est-ce qui vous gêne le plus aujourd'hui dans votre trafic organique ?",
    price:   "L'investissement varie selon le périmètre. Dites-moi votre objectif principal et je vous donne une fourchette en quelques secondes.",
    video:   'Nous produisons des vidéos cinématographiques et des packs de créas pour les médias. Quel est l\'usage principal — campagne, branding ou social ?',
  },
  de: {
    ai:      'Unser Bereich Automatisierung & KI nutzt n8n, GPT und individuelle Integrationen, um Abläufe zu skalieren. Möchten Sie ein Gespräch mit einem Spezialisten vereinbaren?',
    landing: 'Wir bauen conversion-starke Landing Pages mit strategischem Copywriting und Premium-Design. Erzählen Sie mir mehr über Ihr Projekt!',
    ads:     'Wir betreuen Google Ads und Meta Ads mit Fokus auf ROAS. Wie hoch ist Ihr Monatsbudget und in welcher Branche sind Sie tätig?',
    human:   'Gern! Ich verbinde Sie mit einem HSB-Spezialisten. Wann passt Ihnen ein kurzes Gespräch am besten?',
    seo:     'Wir machen technisches SEO, Content und Local SEO. Haben Sie bereits eine Website, und was stört Sie aktuell am meisten an Ihrem organischen Traffic?',
    price:   'Die Investition hängt vom Umfang ab. Nennen Sie mir Ihr Hauptziel und ich gebe Ihnen in Sekunden eine Spanne.',
    video:   'Wir produzieren cinematische Videos und Creative-Pakete für Media. Wofür hauptsächlich — Kampagne, Branding oder Social?',
  },
  'zh-CN': {
    ai:      '我们的自动化与 AI 团队使用 n8n、GPT 和定制集成来帮助业务规模化。想和专家预约一次沟通吗？',
    landing: '我们打造高转化率的落地页，配以策略性文案和高端设计。跟我多聊聊你的项目吧！',
    ads:     '我们管理 Google Ads 和 Meta Ads，以 ROAS 为核心。你的月度预算和所在行业是什么？',
    human:   '好的！我来为你对接一位 HSB 专家。什么时间方便快速沟通一下？',
    seo:     '我们提供技术 SEO、内容和本地 SEO 服务。你已经有网站了吗？目前自然流量最让你困扰的是什么？',
    price:   '投入取决于项目范围。告诉我你的主要目标，我马上给你一个区间。',
    video:   '我们制作电影级视频和媒体投放创意包。主要用途是什么——广告投放、品牌还是社交媒体？',
  },
};

// Mensagens de sistema da rota (rate limit / validação / erro interno / genérica).
export const CHAT_MESSAGES: Record<ChatLocale, {
  rateLimited: string;
  invalid: string;
  internal: string;
  generic: string;
}> = {
  'pt-BR': {
    rateLimited: 'Calma aí 🙂 muitas mensagens em sequência. Aguarde um instante e tente de novo.',
    invalid:     'Envie um texto válido.',
    internal:    'Ops, tivemos uma instabilidade. Tente novamente ou fale conosco pelo WhatsApp.',
    generic:     'Obrigado pela mensagem! Um especialista da HSB vai entrar em contato em breve. Enquanto isso, explore nossos serviços na página.',
  },
  en: {
    rateLimited: 'Easy there 🙂 too many messages in a row. Wait a moment and try again.',
    invalid:     'Please send a valid text message.',
    internal:    'Oops, we hit a hiccup. Please try again or reach us on WhatsApp.',
    generic:     'Thanks for your message! An HSB specialist will get in touch shortly. Meanwhile, feel free to explore our services on the page.',
  },
  es: {
    rateLimited: 'Con calma 🙂 demasiados mensajes seguidos. Espera un momento e inténtalo de nuevo.',
    invalid:     'Envía un texto válido.',
    internal:    'Ups, tuvimos una inestabilidad. Inténtalo de nuevo o contáctanos por WhatsApp.',
    generic:     '¡Gracias por tu mensaje! Un especialista de HSB se pondrá en contacto pronto. Mientras tanto, explora nuestros servicios en la página.',
  },
  fr: {
    rateLimited: "Doucement 🙂 trop de messages d'affilée. Patientez un instant et réessayez.",
    invalid:     'Envoyez un texte valide.',
    internal:    'Oups, nous avons eu une instabilité. Réessayez ou contactez-nous via WhatsApp.',
    generic:     'Merci pour votre message ! Un spécialiste HSB vous contactera très vite. En attendant, découvrez nos services sur la page.',
  },
  de: {
    rateLimited: 'Immer mit der Ruhe 🙂 zu viele Nachrichten hintereinander. Warten Sie kurz und versuchen Sie es erneut.',
    invalid:     'Bitte senden Sie einen gültigen Text.',
    internal:    'Ups, es gab eine Störung. Versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.',
    generic:     'Danke für Ihre Nachricht! Ein HSB-Spezialist meldet sich in Kürze. Schauen Sie sich in der Zwischenzeit gern unsere Leistungen auf der Seite an.',
  },
  'zh-CN': {
    rateLimited: '别急 🙂 消息发得太快了。请稍等片刻再试。',
    invalid:     '请发送有效的文字内容。',
    internal:    '抱歉，系统出现了一点不稳定。请重试，或通过 WhatsApp 联系我们。',
    generic:     '感谢你的留言！HSB 专家会尽快与你联系。与此同时，欢迎浏览页面上的服务介绍。',
  },
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Keywords só com [a-z0-9 ] casam por palavra inteira (\b) — evita falso
// positivo tipo "ai" dentro de "email". Keywords com acento/CJK usam includes.
function keywordMatches(lowerMsg: string, keyword: string): boolean {
  const kw = keyword.toLowerCase();
  if (/^[a-z0-9 ]+$/.test(kw)) {
    return new RegExp(`\\b${escapeRegExp(kw).replace(/ +/g, '\\s+')}\\b`).test(lowerMsg);
  }
  return lowerMsg.includes(kw);
}

export function fallbackReply(message: string, locale: ChatLocale): string {
  const lower = message.toLowerCase();
  const keywords = KEYWORDS[locale];
  const topic = TOPIC_ORDER.find((t) => keywords[t].some((k) => keywordMatches(lower, k)));
  return topic ? REPLIES[locale][topic] : CHAT_MESSAGES[locale].generic;
}
