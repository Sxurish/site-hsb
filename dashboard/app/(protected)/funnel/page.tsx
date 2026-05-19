import { Header } from '@/components/layout/header';
import { FunnelChart } from '@/components/charts/funnel-chart';
import { buildFunnelStages } from '@/lib/metrics';
import { paramsToRange, rangeLabel } from '@/lib/date-range';
import type { FunnelStage } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { from?: string; to?: string; preset?: string };
}

export default async function FunnelPage({ searchParams }: PageProps) {
  const range = paramsToRange(searchParams);
  let stages: FunnelStage[] = [];
  let error: string | null = null;
  try {
    stages = await buildFunnelStages(range);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Erro ao carregar o funil';
  }

  const top = stages[0]?.count ?? 1;
  const bottom = stages[stages.length - 1]?.count ?? 0;
  const overallRate = top > 0 ? ((bottom / top) * 100).toFixed(2) : '0.00';

  const bottleneck = stages.reduce((worst, stage) => {
    if (stage.convRate === null) return worst;
    if (worst.convRate === null || (stage.convRate ?? 100) < (worst.convRate ?? 100)) return stage;
    return worst;
  }, stages[1] ?? stages[0] ?? { label: '—', count: 0, convRate: null, totalRate: 0 });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Funil de conversão" subtitle={`Jornada do visitante ao cliente — ${rangeLabel(range).toLowerCase()}`} />

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
        {error && (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            Erro ao carregar o funil: {error}
          </div>
        )}

        {!error && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[
                { label: 'Total de visitantes', value: top.toLocaleString('pt-BR'),    color: '#d4a566' },
                { label: 'Enviados p/ equipe',  value: bottom.toLocaleString('pt-BR'), color: '#4ade80' },
                { label: 'Conversão geral',     value: `${overallRate}%`,              color: '#60a5fa' },
                { label: 'Gargalo principal',   value: bottleneck.label,               color: '#f87171', small: true },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-surface p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">{s.label}</p>
                  <p
                    className={`font-bold text-ink ${s.small ? 'text-base leading-tight' : 'text-2xl'}`}
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Funil principal */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-ink">Jornada do lead</h2>
                  <p className="text-xs text-muted">Percentual de conversão entre cada etapa</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-gold inline-block opacity-60" /> Normal
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-danger inline-block" /> Gargalo
                  </span>
                </div>
              </div>
              <FunnelChart stages={stages} />
            </section>

            {/* Análise de etapas */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 text-sm font-bold text-ink">Análise de etapas</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stages.slice(1).map((stage) => {
                  const isWeak = (stage.convRate ?? 100) < 45;
                  return (
                    <div
                      key={stage.label}
                      className={`rounded-xl border p-3 ${isWeak ? 'border-danger/20 bg-danger/5' : 'border-border bg-surface-2'}`}
                    >
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted truncate">{stage.label}</p>
                      <p className={`text-xl font-bold ${isWeak ? 'text-danger' : 'text-gold'}`}>
                        {stage.convRate?.toFixed(1)}%
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{stage.count.toLocaleString('pt-BR')} pessoas</p>
                      {isWeak && (
                        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-danger/80">⚠ Atenção</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
