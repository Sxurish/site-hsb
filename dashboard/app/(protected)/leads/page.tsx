'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { useLeads } from '@/hooks/use-leads';
import type { Lead, LeadStatus, LeadPriority, LeadFilters } from '@/lib/types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/labels';
import { Search, SlidersHorizontal, MessageCircle, Mail } from 'lucide-react';

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function LeadRow({ lead }: { lead: Lead }) {
  const waNumber = lead.phone.replace(/\D/g, '');
  return (
    <tr className="group border-b border-border/50 transition-colors hover:bg-surface-2/60">
      <td className="py-3.5 pl-4 pr-2">
        <div>
          <p className="text-sm font-semibold text-ink">{lead.nome}</p>
          <p className="text-xs text-muted">{lead.empresa}</p>
        </div>
      </td>
      <td className="hidden md:table-cell px-2 py-3.5">
        <span className="text-xs text-muted">{lead.servico}</span>
      </td>
      <td className="hidden sm:table-cell px-2 py-3.5">
        <PriorityBadge priority={lead.prioridade} />
      </td>
      <td className="px-2 py-3.5">
        <StatusBadge status={lead.status} />
      </td>
      <td className="hidden md:table-cell px-2 py-3.5">
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">{lead.source}</span>
      </td>
      <td className="hidden sm:table-cell px-2 py-3.5">
        <span className="font-mono text-xs text-muted">{formatDate(lead.createdAt)}</span>
      </td>
      <td className="py-3.5 pl-2 pr-4">
        <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {waNumber && (
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4ade80]/10 text-[#4ade80] transition hover:bg-[#4ade80]/20"
              title="WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/10 text-info transition hover:bg-info/20"
              title="E-mail"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function LeadsPage() {
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  });

  const { leads, loading, error, total } = useLeads(filters);

  const set = <K extends keyof LeadFilters>(key: K, val: LeadFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const selectClass = 'rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-ink outline-none focus:border-gold/40 transition';

  // colSpan & visibility mirrors LeadRow hidden classes
  const COLS = [
    { label: 'Nome / Empresa', cls: ''                        },
    { label: 'Serviço',        cls: 'hidden md:table-cell'    },
    { label: 'Prioridade',     cls: 'hidden sm:table-cell'    },
    { label: 'Status',         cls: ''                        },
    { label: 'Origem',         cls: 'hidden md:table-cell'    },
    { label: 'Criado em',      cls: 'hidden sm:table-cell'    },
    { label: 'Ação',           cls: ''                        },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Leads" subtitle={`${total} leads cadastrados`} />

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        {/* Filtros */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou e-mail..."
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2 py-2 pl-9 pr-4 text-sm text-ink placeholder:text-muted/50 outline-none focus:border-gold/40 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted" />
            <select value={filters.status} onChange={(e) => set('status', e.target.value as LeadStatus | 'all')} className={selectClass}>
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={filters.priority} onChange={(e) => set('priority', e.target.value as LeadPriority | 'all')} className={selectClass}>
              {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <span className="ml-auto text-xs text-muted">{leads.length} resultado{leads.length !== 1 ? 's' : ''}</span>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            Erro ao carregar leads: {error}
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {COLS.map(({ label, cls }) => (
                    <th
                      key={label}
                      className={`px-2 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-muted ${label === 'Nome / Empresa' ? 'pl-4' : ''} ${label === 'Ação' ? 'pr-4' : ''} ${cls}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {COLS.map(({ label, cls }) => (
                          <td key={label} className={`px-2 py-3.5 ${cls}`}>
                            <div className="h-4 animate-pulse rounded-lg bg-surface-2" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : leads.length === 0
                    ? (
                      <tr>
                        <td colSpan={COLS.length} className="py-16 text-center text-sm text-muted">
                          {error ? 'Não foi possível carregar os leads.' : 'Nenhum lead encontrado para os filtros selecionados.'}
                        </td>
                      </tr>
                    )
                    : leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
