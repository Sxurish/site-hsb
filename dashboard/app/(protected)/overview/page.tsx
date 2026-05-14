'use client';

import { Header } from '@/components/layout/header';
import { StatCard } from '@/components/ui/stat-card';
import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { useMetrics } from '@/hooks/use-metrics';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface-2 ${className}`} />;
}

export default function OverviewPage() {
  const { kpis, timeSeries, loading } = useMetrics();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Dashboard"
        subtitle="Visão geral de performance — Maio 2025"
      />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* KPI Grid */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Métricas do mês</h2>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-36" />)
              : kpis.map((card, i) => <StatCard key={card.key} card={card} delay={i * 50} />)
            }
          </div>
        </section>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Área principal: visitantes/sessões */}
          <section className="lg:col-span-3 rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-ink">Tráfego — 30 dias</h2>
                <p className="text-xs text-muted">Visitantes únicos e sessões</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold inline-block" /> Visitantes</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#a78bfa] inline-block" /> Sessões</span>
              </div>
            </div>
            {loading ? <Skeleton className="h-[220px]" /> : <AreaChart data={timeSeries} />}
          </section>

          {/* Bar chart: leads por dia */}
          <section className="lg:col-span-2 rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-ink">Leads — 14 dias</h2>
              <p className="text-xs text-muted">Novos leads por dia</p>
            </div>
            {loading ? <Skeleton className="h-[160px]" /> : <BarChart data={timeSeries} />}

            {/* Mini stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
              {[
                { label: 'Total',  value: '87' },
                { label: 'Média',  value: '2.9/d' },
                { label: 'Melhor', value: '7' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-ink">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom row: funil rápido + top serviços */}
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-bold text-ink">Funil resumido</h2>
            <div className="space-y-3">
              {[
                { label: 'Visitantes → Chat',     pct: 12.7, color: '#d4a566' },
                { label: 'Chat → Briefing',        pct: 37.9, color: '#a78bfa' },
                { label: 'Briefing → Lead',        pct: 74.7, color: '#4ade80' },
                { label: 'Lead → Fechamento',      pct: 12.3, color: '#f87171', warn: true },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{row.label}</span>
                    <span className="font-mono font-bold" style={{ color: row.color }}>{row.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${row.pct}%`, background: row.color, opacity: row.warn ? 1 : 0.7 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-bold text-ink">Serviços mais procurados</h2>
            <div className="space-y-3">
              {[
                { service: 'Landing Page',   pct: 28, leads: 24 },
                { service: 'Tráfego Pago',   pct: 22, leads: 19 },
                { service: 'Automação & IA', pct: 18, leads: 16 },
                { service: 'Full Service',   pct: 16, leads: 14 },
                { service: 'SEO',            pct: 16, leads: 14 },
              ].map((row, i) => (
                <div key={row.service} className="flex items-center gap-3">
                  <span className="w-4 text-right text-xs font-mono text-muted">{i + 1}</span>
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-ink">{row.service}</span>
                      <span className="text-muted">{row.leads} leads</span>
                    </div>
                    <div className="h-1 rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-gold/60" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
