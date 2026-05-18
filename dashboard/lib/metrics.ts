// Composição server-only: junta PostHog + Supabase nas formas que o dashboard consome.
import { fetchDailySeries, fetchPeriodTotals, fetchFunnelCounts } from './services/posthog';
import {
  fetchLeads, computeLeadCounts, computeTopServices, computeLeadsPerDay,
} from './services/supabase';
import { GOALS_CONFIG } from './goals-config';
import type { KpiCard, FunnelStage, Goal, TimePoint, MetricsPayload } from './types';

const DAYS = 30;

function trend(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function buildTimeSeries(
  daily: { date: string; visitors: number; sessions: number }[],
  leadsPerDay: Map<string, number>,
): TimePoint[] {
  return daily.map((d) => ({
    date: d.date,
    visitors: d.visitors,
    sessions: d.sessions,
    leads: leadsPerDay.get(d.date) ?? 0,
  }));
}

export async function buildMetricsPayload(): Promise<MetricsPayload> {
  // 1 round-trip de leads (era 3) + 3 round-trips PostHog em paralelo.
  const [daily, totals, leads, funnel] = await Promise.all([
    fetchDailySeries(DAYS),
    fetchPeriodTotals(DAYS),
    fetchLeads(),
    fetchFunnelCounts(DAYS),
  ]);

  const leadCounts = computeLeadCounts(leads, DAYS);
  const topServices = computeTopServices(leads, DAYS);
  const leadsPerDay = computeLeadsPerDay(leads, DAYS);

  const timeSeries = buildTimeSeries(daily, leadsPerDay);
  const visitorSpark = timeSeries.slice(-12).map((p) => p.visitors);
  const sessionSpark = timeSeries.slice(-12).map((p) => p.sessions);
  const leadSpark = timeSeries.slice(-12).map((p) => p.leads);

  const { current: cur, previous: prev } = leadCounts;
  const convCur = totals.visitors.current > 0 ? (cur.total / totals.visitors.current) * 100 : 0;
  const convPrev = totals.visitors.previous > 0 ? (prev.total / totals.visitors.previous) * 100 : 0;

  const kpis: KpiCard[] = [
    {
      key: 'visitors', label: 'Visitantes únicos', value: totals.visitors.current,
      trend: trend(totals.visitors.current, totals.visitors.previous),
      sparkline: visitorSpark, icon: 'Eye', accentColor: '#60a5fa',
    },
    {
      key: 'sessions', label: 'Sessões', value: totals.sessions.current,
      trend: trend(totals.sessions.current, totals.sessions.previous),
      sparkline: sessionSpark, icon: 'MonitorSmartphone', accentColor: '#a78bfa',
    },
    {
      key: 'chatsStarted', label: 'Conversas iniciadas', value: totals.chatsStarted.current,
      trend: trend(totals.chatsStarted.current, totals.chatsStarted.previous),
      sparkline: [], icon: 'MessageCircle', accentColor: '#34d399',
    },
    {
      key: 'leadsCreated', label: 'Leads criados', value: cur.total,
      trend: trend(cur.total, prev.total),
      sparkline: leadSpark, icon: 'UserPlus', accentColor: '#d4a566',
    },
    {
      key: 'leadsQualified', label: 'Leads qualificados', value: cur.qualificados,
      trend: trend(cur.qualificados, prev.qualificados),
      sparkline: [], icon: 'BadgeCheck', accentColor: '#d4a566',
    },
    {
      key: 'enviadosEquipe', label: 'Enviados p/ equipe', value: cur.enviadosEquipe,
      trend: trend(cur.enviadosEquipe, prev.enviadosEquipe),
      sparkline: [], icon: 'Users', accentColor: '#4ade80',
    },
    {
      key: 'briefingsCompletos', label: 'Briefings completos', value: cur.briefingsCompletos,
      trend: trend(cur.briefingsCompletos, prev.briefingsCompletos),
      sparkline: [], icon: 'FileText', accentColor: '#fbbf24',
    },
    {
      key: 'conversionRate', label: 'Taxa de conversão', value: `${convCur.toFixed(2)}%`,
      trend: Math.round((convCur - convPrev) * 10) / 10,
      sparkline: [], icon: 'TrendingUp', accentColor: '#4ade80',
    },
  ];

  // Funil resumido (4 transições principais) a partir das contagens do PostHog.
  const safe = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : 0);
  const funnelSummary = [
    { label: 'Visitantes → Chat', pct: safe(funnel.chatOpened, funnel.visitors) },
    { label: 'Chat → Mensagem', pct: safe(funnel.messageSent, funnel.chatOpened) },
    { label: 'Mensagem → Briefing', pct: safe(funnel.completed, funnel.messageSent) },
    {
      label: 'Briefing → Equipe',
      pct: safe(cur.enviadosEquipe, funnel.completed),
      warn: safe(cur.enviadosEquipe, funnel.completed) < 40,
    },
  ];

  const leadValues = Array.from(leadsPerDay.values());
  const leadStats = {
    total: cur.total,
    avgPerDay: Math.round((cur.total / DAYS) * 10) / 10,
    best: leadValues.length ? Math.max(...leadValues) : 0,
  };

  return { kpis, timeSeries, topServices, funnelSummary, leadStats };
}

export async function buildFunnelStages(): Promise<FunnelStage[]> {
  const [funnel, leads] = await Promise.all([
    fetchFunnelCounts(DAYS),
    fetchLeads(),
  ]);
  const leadCounts = computeLeadCounts(leads, DAYS);

  const raw: { label: string; count: number }[] = [
    { label: 'Visitante', count: funnel.visitors },
    { label: 'Chat aberto', count: funnel.chatOpened },
    { label: 'Mensagem enviada', count: funnel.messageSent },
    { label: 'Serviço identificado', count: funnel.serviceIdentified },
    { label: 'Dados de contato completos', count: funnel.contactComplete },
    { label: 'Briefing completo', count: funnel.completed },
    { label: 'Enviado p/ equipe', count: leadCounts.current.enviadosEquipe },
  ];

  const top = raw[0]?.count || 1;
  return raw.map((stage, i) => {
    const prevCount = i === 0 ? null : raw[i - 1]!.count;
    return {
      label: stage.label,
      count: stage.count,
      convRate: prevCount === null ? null : prevCount > 0 ? Math.round((stage.count / prevCount) * 1000) / 10 : 0,
      totalRate: Math.round((stage.count / top) * 1000) / 10,
    };
  });
}

export async function buildGoals(): Promise<Goal[]> {
  const [totals, leads] = await Promise.all([
    fetchPeriodTotals(DAYS),
    fetchLeads(),
  ]);
  const leadCounts = computeLeadCounts(leads, DAYS);

  const currentByKey: Record<string, { current: number; previous: number }> = {
    visitors: totals.visitors,
    chatsStarted: totals.chatsStarted,
    leadsCreated: { current: leadCounts.current.total, previous: leadCounts.previous.total },
    leadsQualified: { current: leadCounts.current.qualificados, previous: leadCounts.previous.qualificados },
    enviadosEquipe: { current: leadCounts.current.enviadosEquipe, previous: leadCounts.previous.enviadosEquipe },
  };

  return GOALS_CONFIG.map((g) => {
    const v = currentByKey[g.key] ?? { current: 0, previous: 0 };
    return {
      id: g.id,
      label: g.label,
      current: v.current,
      target: g.target,
      unit: g.unit,
      trend: trend(v.current, v.previous),
    };
  });
}
