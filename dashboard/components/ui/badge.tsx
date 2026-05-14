import type { LeadStatus, LeadPriority, InsightSeverity } from '@/lib/types';

const STATUS_CONFIG: Record<LeadStatus, { label: string; dot: string; bg: string; text: string }> = {
  new:         { label: 'Novo',         dot: 'bg-blue-400',   bg: 'bg-blue-400/10',   text: 'text-blue-300'  },
  contacted:   { label: 'Contatado',    dot: 'bg-purple-400', bg: 'bg-purple-400/10', text: 'text-purple-300' },
  qualified:   { label: 'Qualificado',  dot: 'bg-gold',       bg: 'bg-gold-dim',      text: 'text-gold'      },
  briefing:    { label: 'Briefing',     dot: 'bg-yellow-400', bg: 'bg-yellow-400/10', text: 'text-yellow-300' },
  proposal:    { label: 'Proposta',     dot: 'bg-orange-400', bg: 'bg-orange-400/10', text: 'text-orange-300' },
  negotiation: { label: 'Negociação',   dot: 'bg-pink-400',   bg: 'bg-pink-400/10',   text: 'text-pink-300'  },
  won:         { label: 'Fechado',      dot: 'bg-success',    bg: 'bg-success/10',    text: 'text-success'   },
  lost:        { label: 'Perdido',      dot: 'bg-danger',     bg: 'bg-danger/10',     text: 'text-danger'    },
};

const PRIORITY_CONFIG: Record<LeadPriority, { label: string; color: string }> = {
  high:   { label: 'Alta',   color: 'text-danger'  },
  medium: { label: 'Média',  color: 'text-warning' },
  low:    { label: 'Baixa',  color: 'text-muted'   },
};

const SEVERITY_CONFIG: Record<InsightSeverity, { label: string; bg: string; text: string; border: string }> = {
  high:   { label: 'Urgente', bg: 'bg-danger/10',  text: 'text-danger',  border: 'border-danger/20'  },
  medium: { label: 'Atenção', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  info:   { label: 'Info',    bg: 'bg-info/10',    text: 'text-info',    border: 'border-info/20'    },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const c = PRIORITY_CONFIG[priority];
  return (
    <span className={`text-xs font-semibold tracking-wide ${c.color}`}>
      {priority === 'high' ? '↑' : priority === 'low' ? '↓' : '→'} {c.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: InsightSeverity }) {
  const c = SEVERITY_CONFIG[severity];
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">
      {category}
    </span>
  );
}
