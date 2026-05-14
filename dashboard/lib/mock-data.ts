import type { KpiCard, Lead, FunnelStage, Goal, Insight, TimePoint, Report } from './types';

// ─── Time series (30 dias) ─────────────────────────────────────────────────
export const timeSeries: TimePoint[] = (() => {
  const result: TimePoint[] = [];
  const base = new Date('2025-04-15');
  const seeds = [112, 98, 145, 132, 89, 76, 88, 155, 167, 143, 121, 103, 91, 84, 97,
                 178, 189, 162, 144, 128, 116, 109, 99, 93, 201, 214, 197, 183, 168, 152];
  for (let i = 0; i < 30; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const v = seeds[i] ?? 120;
    result.push({
      date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      visitors: v,
      sessions: Math.round(v * 1.42),
      leads: Math.round(v * 0.027),
    });
  }
  return result;
})();

// ─── KPI Cards ────────────────────────────────────────────────────────────
export const kpiCards: KpiCard[] = [
  {
    key: 'visitors',
    label: 'Visitantes únicos',
    value: 3247,
    trend: +12.4,
    sparkline: [89, 112, 98, 134, 121, 145, 167, 143, 178, 201, 214, 183],
    icon: 'Eye',
    accentColor: '#60a5fa',
  },
  {
    key: 'sessions',
    label: 'Sessões',
    value: 4612,
    trend: +8.7,
    sparkline: [130, 159, 141, 190, 172, 206, 237, 203, 253, 285, 304, 260],
    icon: 'MonitorSmartphone',
    accentColor: '#a78bfa',
  },
  {
    key: 'chatsStarted',
    label: 'Conversas iniciadas',
    value: 412,
    trend: +23.1,
    sparkline: [18, 22, 19, 31, 27, 38, 44, 36, 41, 52, 57, 47],
    icon: 'MessageCircle',
    accentColor: '#34d399',
  },
  {
    key: 'leadsCreated',
    label: 'Leads criados',
    value: 87,
    trend: +15.2,
    sparkline: [4, 6, 5, 8, 7, 10, 11, 9, 10, 13, 14, 12],
    icon: 'UserPlus',
    accentColor: '#d4a566',
  },
  {
    key: 'leadsQualified',
    label: 'Leads qualificados',
    value: 34,
    trend: +5.8,
    sparkline: [2, 3, 2, 4, 3, 5, 5, 4, 4, 6, 6, 5],
    icon: 'BadgeCheck',
    accentColor: '#d4a566',
  },
  {
    key: 'quotationsSent',
    label: 'Orçamentos enviados',
    value: 21,
    trend: -2.3,
    sparkline: [1, 2, 2, 3, 2, 3, 3, 2, 2, 3, 3, 2],
    icon: 'FileText',
    accentColor: '#fbbf24',
  },
  {
    key: 'clientsClosed',
    label: 'Clientes fechados',
    value: 8,
    trend: +33.3,
    sparkline: [0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    icon: 'Handshake',
    accentColor: '#4ade80',
  },
  {
    key: 'conversionRate',
    label: 'Taxa de conversão',
    value: '2.46%',
    trend: +0.3,
    sparkline: [1.8, 2.0, 1.9, 2.1, 2.0, 2.2, 2.3, 2.2, 2.2, 2.4, 2.5, 2.4],
    icon: 'TrendingUp',
    accentColor: '#4ade80',
  },
];

// ─── Leads ────────────────────────────────────────────────────────────────
export const leads: Lead[] = [
  { id: '1',  name: 'Pedro Alves',      company: 'Construtora Alves',     service: 'Landing Page',    priority: 'high',   status: 'qualified',    source: 'Chatbot',   createdAt: '2025-05-12', assignee: 'Ana Lima',    email: 'pedro@alves.com.br',      phone: '+55 11 97777-0001' },
  { id: '2',  name: 'Camila Torres',    company: 'Torres Moda',           service: 'Tráfego Pago',    priority: 'high',   status: 'proposal',     source: 'Instagram', createdAt: '2025-05-11', assignee: 'Lucas Rocha', email: 'camila@torresmoda.com',   phone: '+55 11 96666-0002' },
  { id: '3',  name: 'Rafael Mendes',    company: 'RM Consultoria',        service: 'SEO',             priority: 'medium', status: 'briefing',     source: 'Google',    createdAt: '2025-05-10', assignee: 'Ana Lima',    email: 'rafael@rmconsultoria.com', phone: '+55 11 95555-0003' },
  { id: '4',  name: 'Fernanda Costa',   company: 'FC Estética',           service: 'Branding',        priority: 'medium', status: 'contacted',    source: 'Chatbot',   createdAt: '2025-05-09', assignee: 'Lucas Rocha', email: 'fernanda@fcest.com.br',   phone: '+55 11 94444-0004' },
  { id: '5',  name: 'Bruno Lima',       company: 'TechLab SP',            service: 'Automação & IA',  priority: 'high',   status: 'negotiation',  source: 'LinkedIn',  createdAt: '2025-05-08', assignee: 'Carlos Neto', email: 'bruno@techlab.io',        phone: '+55 11 93333-0005' },
  { id: '6',  name: 'Mariana Souza',    company: 'Souza & Associados',    service: 'Full Service',    priority: 'high',   status: 'won',          source: 'Indicação', createdAt: '2025-05-07', assignee: 'Ana Lima',    email: 'mariana@souzaassoc.com',  phone: '+55 11 92222-0006' },
  { id: '7',  name: 'Diego Ferreira',   company: 'Ferreira Imóveis',      service: 'Tráfego Pago',    priority: 'low',    status: 'new',          source: 'Formulário',createdAt: '2025-05-07', assignee: '',            email: 'diego@ferreiraimoveis.com', phone: '+55 11 91111-0007' },
  { id: '8',  name: 'Juliana Ribeiro',  company: 'JR Clínica',            service: 'Social Media',    priority: 'medium', status: 'qualified',    source: 'Chatbot',   createdAt: '2025-05-06', assignee: 'Carlos Neto', email: 'juliana@jrclinica.com.br',  phone: '+55 11 90000-0008' },
  { id: '9',  name: 'Thiago Cardoso',   company: 'Cardoso Tech',          service: 'Landing Page',    priority: 'high',   status: 'briefing',     source: 'Google',    createdAt: '2025-05-05', assignee: 'Lucas Rocha', email: 'thiago@cardosotech.com',   phone: '+55 11 98888-0009' },
  { id: '10', name: 'Priscila Gomes',   company: 'Gomes Buffet',          service: 'Vídeo',           priority: 'low',    status: 'contacted',    source: 'Instagram', createdAt: '2025-05-04', assignee: 'Ana Lima',    email: 'priscila@gomesbuffet.com', phone: '+55 11 97777-0010' },
  { id: '11', name: 'Eduardo Nunes',    company: 'Nunes Advogados',       service: 'SEO',             priority: 'medium', status: 'lost',         source: 'Direto',    createdAt: '2025-05-03', assignee: 'Carlos Neto', email: 'edu@nunesadv.com.br',      phone: '+55 11 96666-0011' },
  { id: '12', name: 'Aline Barros',     company: 'AB Design Studio',      service: 'Branding',        priority: 'high',   status: 'proposal',     source: 'LinkedIn',  createdAt: '2025-05-02', assignee: 'Lucas Rocha', email: 'aline@abdesign.com.br',    phone: '+55 11 95555-0012' },
  { id: '13', name: 'Gustavo Pinto',    company: 'Pinto Supermercados',   service: 'Full Service',    priority: 'high',   status: 'won',          source: 'Indicação', createdAt: '2025-05-01', assignee: 'Ana Lima',    email: 'gus@pintosupermercados.com', phone: '+55 11 94444-0013' },
  { id: '14', name: 'Beatriz Moura',    company: 'BM Fotografia',         service: 'Social Media',    priority: 'low',    status: 'new',          source: 'Chatbot',   createdAt: '2025-04-30', assignee: '',            email: 'beatriz@bmfoto.com.br',    phone: '+55 11 93333-0014' },
  { id: '15', name: 'Alexandre Vieira', company: 'Vieira Engenharia',     service: 'Automação & IA',  priority: 'medium', status: 'briefing',     source: 'Formulário',createdAt: '2025-04-29', assignee: 'Carlos Neto', email: 'alex@vieiraeng.com.br',    phone: '+55 11 92222-0015' },
];

// ─── Funil ────────────────────────────────────────────────────────────────
export const funnelStages: FunnelStage[] = [
  { label: 'Visitante',                  count: 3247, convRate: null,  totalRate: 100.0 },
  { label: 'Chat aberto',                count: 412,  convRate: 12.7,  totalRate: 12.7  },
  { label: 'Mensagem enviada',           count: 287,  convRate: 69.7,  totalRate: 8.8   },
  { label: 'Briefing iniciado',          count: 156,  convRate: 54.4,  totalRate: 4.8   },
  { label: 'Briefing completo',          count: 87,   convRate: 55.8,  totalRate: 2.7   },
  { label: 'Lead enviado p/ equipe',     count: 65,   convRate: 74.7,  totalRate: 2.0   },
  { label: 'Orçamento enviado',          count: 21,   convRate: 32.3,  totalRate: 0.6   },
  { label: 'Fechado',                    count: 8,    convRate: 38.1,  totalRate: 0.2   },
];

// ─── Metas ────────────────────────────────────────────────────────────────
export const goals: Goal[] = [
  { id: 'g1', label: 'Visitantes',          current: 3247, target: 5000, unit: '',  trend: +12.4 },
  { id: 'g2', label: 'Conversas iniciadas', current: 412,  target: 600,  unit: '',  trend: +23.1 },
  { id: 'g3', label: 'Leads qualificados',  current: 34,   target: 50,   unit: '',  trend: +5.8  },
  { id: 'g4', label: 'Orçamentos enviados', current: 21,   target: 30,   unit: '',  trend: -2.3  },
  { id: 'g5', label: 'Fechamentos',         current: 8,    target: 12,   unit: '',  trend: +33.3 },
];

// ─── Insights ─────────────────────────────────────────────────────────────
export const insights: Insight[] = [
  {
    id: 'i1',
    category: 'Funil',
    severity: 'high',
    title: 'Gargalo: Orçamento → Fechamento',
    description: 'Apenas 38% dos orçamentos enviados convertem. A média do setor é 50-60%. Revisar a estrutura de proposta e follow-up pode recuperar ~3 clientes/mês.',
    action: 'Revisar template de proposta comercial',
  },
  {
    id: 'i2',
    category: 'Produto',
    severity: 'info',
    title: 'Serviço mais procurado: Landing Page',
    description: '"Landing Page" representa 28% de todos os leads iniciados no chatbot. Considere criar pacotes temáticos (e-commerce, serviços, eventos) para aumentar ticket médio.',
    action: 'Criar pacotes de Landing Page',
  },
  {
    id: 'i3',
    category: 'Canal',
    severity: 'info',
    title: 'Canal com melhor conversão: Indicação',
    description: 'Leads por indicação convertem 3× mais rápido que Google Ads (5 dias vs 18 dias). Estruturar um programa formal de indicação pode escalar esse canal.',
    action: 'Montar programa de indicação',
  },
  {
    id: 'i4',
    category: 'Site',
    severity: 'medium',
    title: 'CTA de tráfego pago com baixo engajamento',
    description: 'A seção de serviços de Tráfego Pago tem taxa de clique 40% abaixo da média das outras seções. Testar headline e CTA focado em ROAS pode melhorar a captação.',
    action: 'A/B test na seção de Tráfego Pago',
  },
  {
    id: 'i5',
    category: 'Aria',
    severity: 'medium',
    title: 'Aria perde usuários no briefing',
    description: 'Após iniciar o briefing, 44% dos usuários abandonam antes de completar. Quebrar o briefing em 2-3 etapas menores e adicionar indicador de progresso pode reduzir o abandono.',
    action: 'Reestruturar fluxo de briefing da Aria',
  },
];

// ─── Relatórios ───────────────────────────────────────────────────────────
export const reports: Report[] = [
  { id: 'r1', title: 'Relatório Semanal',            period: '05–11 Mai 2025',    generatedAt: '2025-05-12 09:00', type: 'weekly',  status: 'ready'      },
  { id: 'r2', title: 'Relatório Mensal — Abril',     period: 'Abril 2025',        generatedAt: '2025-05-01 08:30', type: 'monthly', status: 'ready'      },
  { id: 'r3', title: 'Análise de Funil',             period: '01–14 Mai 2025',    generatedAt: '2025-05-14 10:15', type: 'funnel',  status: 'ready'      },
  { id: 'r4', title: 'Pipeline de Leads',            period: 'Mai 2025',          generatedAt: '2025-05-14 10:15', type: 'leads',   status: 'ready'      },
  { id: 'r5', title: 'Relatório Semanal',            period: '28 Abr – 04 Mai',   generatedAt: '2025-05-05 09:00', type: 'weekly',  status: 'ready'      },
  { id: 'r6', title: 'Relatório Mensal — Maio',      period: 'Maio 2025',         generatedAt: '2025-06-01 08:00', type: 'monthly', status: 'scheduled'  },
];
