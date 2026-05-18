import type { FunnelStage } from '@/lib/types';

interface FunnelChartProps {
  stages: FunnelStage[];
}

export function FunnelChart({ stages }: FunnelChartProps) {
  const max = stages[0]?.count ?? 1;
  // Encontra o maior gargalo (maior queda percentual entre etapas consecutivas)
  const bottleneckIdx = stages.reduce((worst, stage, i) => {
    if (i === 0 || stage.convRate === null) return worst;
    const worstRate = stages[worst]?.convRate ?? 100;
    return (stage.convRate ?? 100) < worstRate ? i : worst;
  }, 1);

  return (
    <div className="space-y-2">
      {stages.map((stage, i) => {
        const barWidth = (stage.count / max) * 100;
        const isBottleneck = i === bottleneckIdx;
        const isFirst = i === 0;

        return (
          <div key={stage.label} className="group">
            {/* Seta de conversão entre etapas */}
            {!isFirst && (
              <div className={`mb-2 flex items-center gap-2 pl-2 text-xs ${isBottleneck ? 'text-danger' : 'text-muted'}`}>
                <span className="text-[10px]">↳</span>
                <span className={`font-semibold ${isBottleneck ? 'text-danger' : 'text-muted'}`}>
                  {stage.convRate?.toFixed(1)}% conversão
                </span>
                {isBottleneck && (
                  <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-danger">
                    Gargalo
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Número do passo */}
              <span className="w-5 text-right text-xs font-mono text-muted">{i + 1}</span>

              {/* Barra */}
              <div className="flex-1">
                <div className="relative h-10 overflow-hidden rounded-lg bg-surface-2">
                  <div
                    className="absolute inset-y-0 left-0 flex items-center rounded-lg transition-all duration-700 ease-out"
                    style={{
                      width: `${barWidth}%`,
                      background: isBottleneck
                        ? 'linear-gradient(90deg, rgba(248,113,113,0.3), rgba(248,113,113,0.15))'
                        : isFirst
                          ? 'linear-gradient(90deg, rgba(212,165,102,0.35), rgba(212,165,102,0.15))'
                          : 'linear-gradient(90deg, rgba(212,165,102,0.2), rgba(212,165,102,0.08))',
                      borderLeft: `2px solid ${isBottleneck ? '#f87171' : '#d4a566'}`,
                    }}
                  />
                  <div className="relative flex h-full items-center justify-between px-3">
                    <span className={`text-sm font-medium ${isFirst ? 'text-ink' : 'text-ink/80'}`}>
                      {stage.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">
                        {stage.totalRate.toFixed(1)}% do topo
                      </span>
                      <span className="font-bold text-ink tabular-nums">
                        {stage.count.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
