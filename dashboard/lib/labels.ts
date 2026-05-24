import type { LeadStatus, LeadPriority } from './types';

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  qualificado: 'Qualificado',
  enviado_para_equipe: 'Enviado p/ equipe',
};

export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export const STATUS_OPTIONS: Array<{ value: LeadStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'novo', label: 'Novo' },
  { value: 'em_atendimento', label: 'Em atendimento' },
  { value: 'qualificado', label: 'Qualificado' },
  { value: 'enviado_para_equipe', label: 'Enviado p/ equipe' },
];

export const PRIORITY_OPTIONS: Array<{ value: LeadPriority | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];
