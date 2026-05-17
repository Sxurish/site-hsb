// Service server-only — NUNCA importar em client component (usa service role key).
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import type { Lead, LeadStatus, TopService } from '../types';

export const LEADS_CACHE_TAG = 'leads';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

interface LeadRow {
  id?: string | number;
  lead_key: string;
  nome: string | null;
  email: string | null;
  phone: string | null;
  empresa: string | null;
  servico: string | null;
  objetivo: string | null;
  status: string | null;
  prioridade: string | null;
  source: string | null;
  step_funil: string | null;
  briefing_completo: boolean | null;
  created_at: string;
  updated_at: string;
}

const VALID_STATUS: LeadStatus[] = ['novo', 'em_atendimento', 'qualificado', 'enviado_para_equipe'];

function mapLead(row: LeadRow): Lead {
  const status = (VALID_STATUS as string[]).includes(row.status ?? '')
    ? (row.status as LeadStatus)
    : 'novo';
  const prioridade = ['baixa', 'media', 'alta'].includes(row.prioridade ?? '')
    ? (row.prioridade as Lead['prioridade'])
    : 'baixa';
  return {
    id: String(row.id ?? row.lead_key),
    leadKey: row.lead_key,
    nome: row.nome?.trim() || 'Sem nome',
    email: row.email ?? '',
    phone: row.phone ?? '',
    empresa: row.empresa?.trim() || '—',
    servico: row.servico?.trim() || 'Não definido',
    objetivo: row.objetivo?.trim() || '',
    status,
    prioridade,
    source: row.source ?? 'site',
    stepFunil: row.step_funil,
    briefingCompleto: Boolean(row.briefing_completo),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Network call wrapped em unstable_cache: 60s TTL + tag pra revalidação manual
// no PATCH /api/leads. Dedup automático dentro do mesmo request também.
export const fetchLeads = unstable_cache(
  async (): Promise<Lead[]> => {
    const { data, error } = await getClient()
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw new Error(`Supabase fetchLeads: ${error.message}`);
    return (data as LeadRow[]).map(mapLead);
  },
  ['leads-all'],
  { revalidate: 60, tags: [LEADS_CACHE_TAG] },
);

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await getClient().from('leads').update({ status }).eq('lead_key', id);
  if (error) throw new Error(`Supabase updateLeadStatus: ${error.message}`);
}

export interface LeadCounts {
  total: number;
  qualificados: number;
  enviadosEquipe: number;
  briefingsCompletos: number;
}

// ─── Compute functions puras (sem I/O) ─────────────────────────────────────
// Recebem leads já carregados pra evitar N+1 do fetchLeads no buildMetricsPayload.

export function computeLeadCounts(leads: Lead[], days = 30): { current: LeadCounts; previous: LeadCounts } {
  const now = Date.now();
  const dayMs = 86_400_000;
  const curFrom = now - days * dayMs;
  const prevFrom = now - 2 * days * dayMs;

  const count = (from: number, to: number): LeadCounts => {
    const slice = leads.filter((l) => {
      const t = new Date(l.createdAt).getTime();
      return t >= from && t < to;
    });
    return {
      total: slice.length,
      qualificados: slice.filter((l) => l.status === 'qualificado' || l.status === 'enviado_para_equipe').length,
      enviadosEquipe: slice.filter((l) => l.status === 'enviado_para_equipe').length,
      briefingsCompletos: slice.filter((l) => l.briefingCompleto).length,
    };
  };

  return { current: count(curFrom, now), previous: count(prevFrom, curFrom) };
}

export function computeTopServices(leads: Lead[], days = 30, limit = 5): TopService[] {
  const from = Date.now() - days * 86_400_000;
  const recent = leads.filter((l) => new Date(l.createdAt).getTime() >= from);
  if (recent.length === 0) return [];
  const byService = new Map<string, number>();
  for (const l of recent) {
    byService.set(l.servico, (byService.get(l.servico) ?? 0) + 1);
  }
  return Array.from(byService.entries())
    .map(([service, n]) => ({ service, leads: n, pct: Math.round((n / recent.length) * 100) }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, limit);
}

// Map<'dd/mm', n> — fuso fixo America/Sao_Paulo pra bater com o bucket do PostHog.
export function computeLeadsPerDay(leads: Lead[], days = 30): Map<string, number> {
  const from = Date.now() - days * 86_400_000;
  const fmt = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo',
  });
  const map = new Map<string, number>();
  for (const l of leads) {
    const t = new Date(l.createdAt).getTime();
    if (t < from) continue;
    const key = fmt.format(new Date(l.createdAt));
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

// Wrappers retrocompat — usam fetchLeads cached. Preferir os compute* em código novo.
export async function fetchLeadCounts(days = 30) {
  return computeLeadCounts(await fetchLeads(), days);
}
export async function fetchTopServices(days = 30, limit = 5) {
  return computeTopServices(await fetchLeads(), days, limit);
}
export async function fetchLeadsPerDay(days = 30) {
  return computeLeadsPerDay(await fetchLeads(), days);
}
