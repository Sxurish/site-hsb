import { Header } from '@/components/layout/header';
import { ProgressBar } from '@/components/ui/progress-bar';
import { goals } from '@/lib/mock-data';

export default function GoalsPage() {
  const month = 'Maio 2025';
  const daysInMonth = 31;
  const today = 14;
  const elapsed = (today / daysInMonth) * 100;

  // Progresso médio ponderado
  const avgProgress = goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / goals.length;
  const onTrack = goals.filter((g) => (g.current / g.target) * 100 >= elapsed).length;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Metas" subtitle={`Acompanhamento mensal — ${month}`} />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Status do mês */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Dia do mês',         value: `${today}/${daysInMonth}`,     sub: `${elapsed.toFixed(0)}% do período`,  color: '#60a5fa' },
            { label: 'Progresso médio',    value: `${avgProgress.toFixed(0)}%`,  sub: 'média das metas',                    color: avgProgress >= elapsed ? '#4ade80' : '#fbbf24' },
            { label: 'Metas no ritmo',     value: `${onTrack}/${goals.length}`,  sub: 'dentro do esperado',                 color: onTrack === goals.length ? '#4ade80' : '#fbbf24' },
            { label: 'Projeção mensal',    value: `${Math.round(avgProgress * daysInMonth / today).toFixed(0)}%`,  sub: 'se ritmo mantido', color: '#d4a566' },
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
            <span>01/05</span>
            <span className="font-semibold text-ink">Hoje: {today}/05</span>
            <span>31/05</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gold/60"
              style={{ width: `${elapsed}%` }}
            />
          </div>
          <p className="mt-1.5 text-center text-xs text-muted">{elapsed.toFixed(0)}% do mês decorrido</p>
        </div>

        {/* Metas individuais */}
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-6 text-sm font-bold text-ink">Targets de {month}</h2>
          <div className="space-y-6 divide-y divide-border">
            {goals.map((goal, i) => {
              const pct = (goal.current / goal.target) * 100;
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
                      · Faltam {goal.target - goal.current} para a meta
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Nota */}
        <p className="text-center text-xs text-muted/40 pb-2">
          Dados atualizados automaticamente via PostHog + Supabase · Próxima sync: amanhã 08:00
        </p>
      </div>
    </div>
  );
}
