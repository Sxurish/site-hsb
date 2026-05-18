import { Header } from '@/components/layout/header';
import { SeverityBadge, CategoryBadge } from '@/components/ui/badge';
import { insights } from '@/lib/mock-data';
import { ArrowRight, Lightbulb } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Funil:    '#f87171',
  Produto:  '#d4a566',
  Canal:    '#4ade80',
  Site:     '#60a5fa',
  Aria:     '#a78bfa',
};

export default function InsightsPage() {
  const highCount   = insights.filter((i) => i.severity === 'high').length;
  const mediumCount = insights.filter((i) => i.severity === 'medium').length;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Insights" subtitle="Recomendações baseadas em dados — Maio 2025" />

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Urgentes',   value: highCount,              color: '#f87171', bg: 'bg-danger/5   border-danger/15'  },
            { label: 'Atenção',    value: mediumCount,            color: '#fbbf24', bg: 'bg-warning/5  border-warning/15' },
            { label: 'Total',      value: insights.length,        color: '#f5f2ee', bg: 'bg-surface    border-border'     },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-3 sm:p-4 ${s.bg}`}>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{s.label}</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Cards de insights */}
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div
              key={insight.id}
              className="group animate-slide-up rounded-2xl border border-border bg-surface p-5 transition-all hover:border-border-strong hover:shadow-card"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start gap-4">
                {/* Ícone colorido */}
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${CATEGORY_COLORS[insight.category] ?? '#d4a566'}15` }}
                >
                  <Lightbulb
                    className="h-5 w-5"
                    style={{ color: CATEGORY_COLORS[insight.category] ?? '#d4a566' }}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="mb-2 flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={insight.severity} />
                    <CategoryBadge category={insight.category} />
                  </div>

                  <h3 className="text-sm font-bold text-ink">{insight.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{insight.description}</p>

                  {insight.action && (
                    <button className="group/btn mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold transition hover:text-gold/80">
                      {insight.action}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted/40 pb-2">
          Insights gerados a partir dos dados de Mai 2025 · Atualizados diariamente
        </p>
      </div>
    </div>
  );
}
