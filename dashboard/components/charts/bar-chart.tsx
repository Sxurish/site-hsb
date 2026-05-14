'use client';

import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import type { TimePoint } from '@/lib/types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-strong bg-surface-2 px-3 py-2 shadow-card">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm font-bold text-gold">{payload[0]?.value} leads</p>
    </div>
  );
}

export function BarChart({ data }: { data: TimePoint[] }) {
  const recent = data.slice(-14);
  const maxVal = Math.max(...recent.map((d) => d.leads));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <RechartsBar data={recent} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'rgba(245,242,238,0.35)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fill: 'rgba(245,242,238,0.35)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
          {recent.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.leads === maxVal ? '#d4a566' : 'rgba(212,165,102,0.3)'}
            />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
}
