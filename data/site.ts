import {
  Camera,
  Clapperboard,
  Globe,
  Megaphone,
  Palette,
  Search,
  Video,
  WandSparkles
} from 'lucide-react';

export const navLinks = [
  { href: '#sobre',     label: 'Sobre' },
  { href: '#servicos',  label: 'Serviços' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#processo',  label: 'Processo' },
  { href: '#clientes',  label: 'Clientes' },
  { href: '#contato',   label: 'Contato' },
];

export const digitalServices = [
  {
    title: 'Desenvolvimento de Sites',
    description: 'Sites empresariais de alta performance, projetados para converter tráfego em leads qualificados.',
    icon: Globe
  },
  {
    title: 'Landing Pages',
    description: 'Páginas de campanha focadas em conversão, com UX otimizada e estrutura orientada a resultados.',
    icon: WandSparkles
  },
  {
    title: 'SEO',
    description: 'Estratégias técnicas e locais para posicionar sua marca nas buscas de alta intenção em São Paulo.',
    icon: Search
  },
  {
    title: 'Tráfego Pago',
    description: 'Operações de Google Ads e Meta Ads focadas em ROI mensurável e escala sustentável.',
    icon: Megaphone
  },
  {
    title: 'Branding & Identidade',
    description: 'Posicionamento, sistemas visuais e mensagem criados para diferenciação de mercado.',
    icon: Palette
  }
];

export const productionServices = [
  {
    title: 'Produção de Vídeo',
    description: 'Vídeos de marca cinematográficos e conteúdo para campanhas de alta performance digital.',
    icon: Video
  },
  {
    title: 'Fotografia Comercial',
    description: 'Fotografia premium para campanhas, vitrines de produto e narrativa de marca.',
    icon: Camera
  },
  {
    title: 'Produção Audiovisual',
    description: 'Produção criativa completa: do conceito e roteiro à execução em set.',
    icon: Clapperboard
  },
  {
    title: 'Edição & Pós-produção',
    description: 'Pós-produção ágil, color grading, design de som e versionamento para cada canal.',
    icon: WandSparkles
  }
];

export const processSteps = [
  { step: '01', title: 'Descoberta',   description: 'Mapeamos seus objetivos, mercado e os principais gargalos de crescimento.' },
  { step: '02', title: 'Estratégia',   description: 'Um plano de crescimento personalizado conectando criativo e performance.' },
  { step: '03', title: 'Produção',     description: 'Design, conteúdo, código e mídia executados com velocidade e qualidade.' },
  { step: '04', title: 'Entrega',      description: 'Lançamos, integramos e validamos cada ponto de contato com o cliente.' },
  { step: '05', title: 'Crescimento',  description: 'Otimização contínua guiada por dados analíticos e resultados de campanha.' },
];

export const clients = [
  {
    brand: 'Clínica Vitalidade',
    initials: 'CV',
    services: ['Website', 'SEO'],
    quote: 'Saímos do zero e em 3 meses estávamos recebendo leads qualificados todo dia. A HSB entendeu exatamente o que precisávamos.',
    name: 'Dra. Ana Beatriz',
    role: 'Diretora Clínica'
  },
  {
    brand: 'Construtora Horizonte',
    initials: 'CH',
    services: ['Identidade Visual', 'Landing Page'],
    quote: 'A HSB redesenhou nossa presença digital do zero. Resultado direto: dobramos o número de orçamentos em 60 dias.',
    name: 'Ricardo Mendes',
    role: 'CEO & Fundador'
  },
  {
    brand: 'Drivex Auto Group',
    initials: 'DA',
    services: ['Vídeo', 'Tráfego Pago'],
    quote: 'As redes explodiram com as produções deles. Melhor investimento que fizemos no ano — ROI acima de tudo que esperávamos.',
    name: 'Felipe Andrade',
    role: 'Diretor de Marketing'
  },
  {
    brand: 'NovaHub Fintech',
    initials: 'NH',
    services: ['Landing Page', 'Google Ads'],
    quote: '+420% em leads qualificados em 90 dias. A combinação de criativo e performance que a HSB entrega é impressionante.',
    name: 'Mariana Costa',
    role: 'CMO'
  },
  {
    brand: 'Fashion Studio SP',
    initials: 'FS',
    services: ['Fotografia', 'Reels'],
    quote: 'Conteúdo de alto nível que finalmente refletiu a qualidade real da nossa marca. Nosso engajamento triplicou.',
    name: 'Juliana Ferraz',
    role: 'Diretora Criativa'
  },
  {
    brand: 'Rede Alimentar',
    initials: 'RA',
    services: ['SEO Local', 'Website'],
    quote: 'Número 1 no Google para nossas palavras-chave em menos de 4 meses. Atendimento consultivo e resultado real.',
    name: 'Carlos Oliveira',
    role: 'Sócio-fundador'
  },
];

export const caseStudies = [
  {
    brand: 'Fintech SP',
    result: '+420% Leads em 90 dias',
    details: 'Estratégia full-funnel combinando landing pages, Google Ads e remarketing no Meta para uma startup fintech.'
  },
  {
    brand: 'Fashion Franchise',
    result: '6.8x ROAS no Meta Ads',
    details: 'Produção criativa + operação de tráfego pago escalando uma marca de moda em São Paulo.'
  },
  {
    brand: 'Clinica Vitta',
    result: '#1 ranking SEO Local',
    details: 'SEO técnico e estratégia de conteúdo que capturou buscas locais de alta intenção para uma clínica médica.'
  }
];

export const trustItems = [
  '150+ sites entregues',
  'Certificado Google Partner',
  '1.200+ ativos de vídeo',
  'Sediados em São Paulo'
];

export const faqs = [
  {
    question: 'Quanto tempo leva um projeto típico?',
    answer: 'Sites normalmente são lançados em 3 a 4 semanas. Estratégias de campanha e mídia paga entram no ar em 7 a 10 dias úteis após o onboarding.'
  },
  {
    question: 'Vocês atendem empresas fora de São Paulo?',
    answer: 'Sim. Embora nossa sede seja em São Paulo, atendemos clientes em todo o Brasil e internacionalmente para serviços digitais e de produção.'
  },
  {
    question: 'O que diferencia a HSB das outras agências?',
    answer: 'Combinamos marketing de performance e produção audiovisual premium sob o mesmo teto — sem terceirizações, sem ruído de comunicação, só um time executando do início ao fim.'
  },
  {
    question: 'Como vocês medem o sucesso das campanhas?',
    answer: 'Rastreamos métricas de pipeline: leads qualificados, custo por aquisição, ROAS e receita atribuída — não métricas de vaidade.'
  }
];
