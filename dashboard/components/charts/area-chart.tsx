'use client';

import {
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { TimePoint } from '@/lib/types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-strong bg-surface-2 px-3 py-2.5 shadow-card">
      <p className="mb-1.5 text-xs font-medium text-muted">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.value.toLocaleString('pt-BR')} <span className="text-xs font-normal text-muted">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

interface AreaChartProps {
  data: TimePoint[];
  showSessions?: boolean;
}

export function AreaChart({ data, showSessions = true }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsArea data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a566" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#d4a566" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'rgba(245,242,238,0.35)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fill: 'rgba(245,242,238,0.35)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        {showSessions && (
          <Area
            type="monotone"
            dataKey="sessions"
            name="sessões"
            stroke="#a78bfa"
            strokeWidth={1.5}
            fill="url(#gradSessions)"
            dot={false}
            activeDot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }}
          />
        )}
        <Area
          type="monotone"
          dataKey="visitors"
          name="visitantes"
          stroke="#d4a566"
          strokeWidth={2}
          fill="url(#gradVisitors)"
          dot={false}
          activeDot={{ r: 4, fill: '#d4a566', strokeWidth: 0 }}
        />
      </RechartsArea>
    </ResponsiveContainer>
  );
}
