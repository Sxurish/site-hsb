import type { KpiCard } from '@/lib/types';
import { Sparkline } from './sparkline';
import {
  Eye, MonitorSmartphone, MessageCircle, UserPlus,
  BadgeCheck, FileText, TrendingUp, Users,
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  Eye, MonitorSmartphone, MessageCircle, UserPlus,
  BadgeCheck, FileText, TrendingUp, Users,
  Handshake: Users,
};

interface StatCardProps {
  card: KpiCard;
  delay?: number;
}

export function StatCard({ card, delay = 0 }: StatCardProps) {
  const Icon = ICONS[card.icon] ?? TrendingUp;
  const isPositive = card.trend >= 0;
  const trendLabel = `${isPositive ? '+' : ''}${card.trend.toFixed(1)}%`;

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:border-border-strong hover:shadow-card animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor}60, transparent)` }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">{card.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{card.value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${card.accentColor}18` }}
        >
          <Icon className="h-5 w-5" style={{ color: card.accentColor }} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? '↑' : '↓'} {trendLabel}
          <span className="font-normal text-muted">vs mês ant.</span>
        </span>
        <Sparkline data={card.sparkline} color={card.accentColor} width={72} height={24} />
      </div>
    </div>
  );
}
