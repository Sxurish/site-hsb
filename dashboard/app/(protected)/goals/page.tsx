import { Header } from '@/components/layout/header';
import { ProgressBar } from '@/components/ui/progress-bar';
import { buildGoals } from '@/lib/metrics';
import type { Goal } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
  let goals: Goal[] = [];
  let error: string | null = null;
  try {
    goals = await buildGoals();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Erro ao carregar metas';
  }

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  const elapsed = (today / daysInMonth) * 100;
  const month = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const avgProgress = goals.length
    ? goals.reduce((sum, g) => sum + (g.target > 0 ? (g.current / g.target) * 100 : 0), 0) / goals.length
    : 0;
  const onTrack = goals.filter((g) => g.target > 0 && (g.current / g.target) * 100 >= elapsed).length;
  const projection = today > 0 ? (avgProgress * daysInMonth) / today : 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Metas" subtitle={`Acompanhamento — últimos 30 dias`} />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {error && (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            Erro ao carregar metas: {error}
          </div>
        )}

        {!error && (
          <>
            {/* Status do mês */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: 'Dia do mês',      value: `${today}/${daysInMonth}`,        sub: `${elapsed.toFixed(0)}% do período`,  color: '#60a5fa' },
                { label: 'Progresso médio', value: `${avgProgress.toFixed(0)}%`,     sub: 'média das metas',                    color: avgProgress >= elapsed ? '#4ade80' : '#fbbf24' },
                { label: 'Metas no ritmo',  value: `${onTrack}/${goals.length}`,     sub: 'dentro do esperado',                 color: onTrack === goals.length && goals.length > 0 ? '#4ade80' : '#fbbf24' },
                { label: 'Projeção mensal', value: `${projection.toFixed(0)}%`,      sub: 'se ritmo mantido',                   color: '#d4a566' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-surface p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Linha do tempo do mês */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-2 flex items-center justify-between text-xs text-muted">
                <span>Início</span>
                <span className="font-semibold text-ink">Hoje: {today}</span>
                <span>{daysInMonth}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-gold/60" style={{ width: `${elapsed}%` }} />
              </div>
              <p className="mt-1.5 text-center text-xs text-muted">{elapsed.toFixed(0)}% do mês decorrido</p>
            </div>

            {/* Metas individuais */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-6 text-sm font-bold text-ink capitalize">Targets de {month}</h2>
              <div className="space-y-6 divide-y divide-border">
                {goals.map((goal, i) => {
                  const pct = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                  const isOnTrack = pct >= elapsed;
                  return (
                    <div key={goal.id} className={i > 0 ? 'pt-6' : ''}>
                      <ProgressBar
                        label={goal.label}
                        current={goal.current}
                        target={goal.target}
                        unit={goal.unit}
                        trend={goal.trend}
                        delay={i * 80}
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isOnTrack ? 'text-success' : 'text-warning'}`}>
                          {isOnTrack ? '✓ No ritmo' : '⚡ Atenção'}
                        </span>
                        <span className="text-[10px] text-muted">
                          · Faltam {Math.max(goal.target - goal.current, 0)} para a meta
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <p className="text-center text-xs text-muted/40 pb-2">
              Dados atualizados em tempo real via PostHog + Supabase · Metas configuradas em lib/goals-config.ts
            </p>
          </>
        )}
      </div>
    </div>
  );
}
