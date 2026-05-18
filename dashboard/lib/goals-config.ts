// Metas mensais — definidas pelo negócio (ajuste aqui conforme o objetivo do mês).
// `key` liga a meta a uma métrica real calculada em lib/metrics.ts.
export interface GoalConfig {
  id: string;
  key: 'visitors' | 'chatsStarted' | 'leadsQualified' | 'enviadosEquipe' | 'leadsCreated';
  label: string;
  target: number;
  unit: string;
}

export const GOALS_CONFIG: GoalConfig[] = [
  { id: 'g1', key: 'visitors', label: 'Visitantes', target: 5000, unit: '' },
  { id: 'g2', key: 'chatsStarted', label: 'Conversas iniciadas', target: 600, unit: '' },
  { id: 'g3', key: 'leadsCreated', label: 'Leads criados', target: 120, unit: '' },
  { id: 'g4', key: 'leadsQualified', label: 'Leads qualificados', target: 50, unit: '' },
  { id: 'g5', key: 'enviadosEquipe', label: 'Enviados p/ equipe', target: 30, unit: '' },
];
