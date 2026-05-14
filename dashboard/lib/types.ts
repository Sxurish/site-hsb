export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'briefing'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export type LeadPriority = 'high' | 'medium' | 'low';

export type ServiceType =
  | 'Landing Page'
  | 'SEO'
  | 'Tráfego Pago'
  | 'Branding'
  | 'Vídeo'
  | 'Automação & IA'
  | 'Social Media'
  | 'Full Service';

export type LeadSource =
  | 'Chatbot'
  | 'Formulário'
  | 'WhatsApp'
  | 'Instagram'
  | 'LinkedIn'
  | 'Indicação'
  | 'Google'
  | 'Direto';

export interface Lead {
  id: string;
  name: string;
  company: string;
  service: ServiceType;
  priority: LeadPriority;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  assignee: string;
  email: string;
  phone: string;
}

export interface FunnelStage {
  label: string;
  count: number;
  convRate: number | null; // conversão da etapa anterior (null para a primeira)
  totalRate: number;       // em relação ao topo do funil
}

export interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  trend: number; // % vs mês anterior
}

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

export interface TimePoint {
  date: string;
  visitors: number;
  sessions: number;
  leads: number;
}

export interface Report {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  type: 'weekly' | 'monthly' | 'funnel' | 'leads';
  status: 'ready' | 'generating' | 'scheduled';
}

export interface KpiCard {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  trend: number; // % positivo = alta, negativo = queda
  sparkline: number[];
  icon: string;
  accentColor: string;
}
