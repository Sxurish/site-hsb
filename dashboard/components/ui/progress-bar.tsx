interface ProgressBarProps {
  current: number;
  target: number;
  label: string;
  unit?: string;
  trend?: number;
  delay?: number;
}

export function ProgressBar({ current, target, label, unit = '', trend, delay = 0 }: ProgressBarProps) {
  const pct = Math.min((current / target) * 100, 100);
  const isAhead = pct >= 70;
  const isBehind = pct < 40;
  const barColor = isBehind ? '#f87171' : isAhead ? '#4ade80' : '#d4a566';

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <div className="flex items-center gap-3">
          {trend !== undefined && (
            <span className={`text-xs font-semibold ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          <span className="font-mono text-xs text-muted">
            <span className="text-sm font-bold text-ink">
              {current.toLocaleString('pt-BR')}{unit}
            </span>
            {' / '}
            {target.toLocaleString('pt-BR')}{unit}
          </span>
          <span
            className="w-9 text-right text-xs font-bold"
            style={{ color: barColor }}
          >
            {pct.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}60` }}
        />
      </div>
    </div>
  );
}
