// ─── Lead (schema real da tabela `leads` no Supabase) ─────────────────────
export type LeadStatus = 'novo' | 'em_atendimento' | 'qualificado' | 'enviado_para_equipe';
export type LeadPriority = 'baixa' | 'media' | 'alta';

export interface Lead {
  id: string;
  leadKey: string;
  nome: string;
  email: string;
  phone: string;
  empresa: string;
  servico: string;            // texto livre coletado pela IA
  objetivo: string;
  status: LeadStatus;
  prioridade: LeadPriority;
  source: string;
  stepFunil: string | null;
  briefingCompleto: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
  priority: LeadPriority | 'all';
}

// ─── Métricas ─────────────────────────────────────────────────────────────
export interface TimePoint {
  date: string;
  visitors: number;
  sessions: number;
  leads: number;
}

export interface KpiCard {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  trend: number;              // % vs período anterior
  sparkline: number[];
  icon: string;
  accentColor: string;
}

export interface FunnelStage {
  label: string;
  count: number;
  convRate: number | null;    // conversão da etapa anterior (null na primeira)
  totalRate: number;          // em relação ao topo do funil
}

export interface TopService {
  service: string;
  leads: number;
  pct: number;
}

export interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  trend: number;
}

export interface MetricsPayload {
  kpis: KpiCard[];
  timeSeries: TimePoint[];
  topServices: TopService[];
  funnelSummary: { label: string; pct: number; warn?: boolean }[];
  leadStats: { total: number; avgPerDay: number; best: number };
}

// ─── Insights / Reports (mock por enquanto — sem fonte de dados crua) ──────
export type InsightCategory = 'Funil' | 'Produto' | 'Canal' | 'Site' | 'Aria';
export type InsightSeverity = 'high' | 'medium' | 'info';

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  severity: InsightSeverity;
  action: string;
}

export interface Report {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  type: 'weekly' | 'monthly' | 'funnel' | 'leads';
  status: 'ready' | 'generating' | 'scheduled';
}
