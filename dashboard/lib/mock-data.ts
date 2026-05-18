// Dados mock — apenas para Insights e Reports, que ainda não têm fonte de dados crua.
// Overview, Leads, Funnel e Goals já consomem dados reais (PostHog + Supabase).
import type { Insight, Report } from './types';

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

export const reports: Report[] = [
  { id: 'r1', title: 'Relatório Semanal',        period: '05–11 Mai 2025',  generatedAt: '2025-05-12 09:00', type: 'weekly',  status: 'ready'     },
  { id: 'r2', title: 'Relatório Mensal — Abril', period: 'Abril 2025',      generatedAt: '2025-05-01 08:30', type: 'monthly', status: 'ready'     },
  { id: 'r3', title: 'Análise de Funil',         period: '01–14 Mai 2025',  generatedAt: '2025-05-14 10:15', type: 'funnel',  status: 'ready'     },
  { id: 'r4', title: 'Pipeline de Leads',        period: 'Mai 2025',        generatedAt: '2025-05-14 10:15', type: 'leads',   status: 'ready'     },
  { id: 'r5', title: 'Relatório Semanal',        period: '28 Abr – 04 Mai', generatedAt: '2025-05-05 09:00', type: 'weekly',  status: 'ready'     },
  { id: 'r6', title: 'Relatório Mensal — Maio',  period: 'Maio 2025',       generatedAt: '2025-06-01 08:00', type: 'monthly', status: 'scheduled' },
];
