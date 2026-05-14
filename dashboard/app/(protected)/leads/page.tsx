'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { useLeads, type LeadFilters } from '@/hooks/use-leads';
import type { Lead, LeadStatus, LeadPriority } from '@/lib/types';
import { Search, SlidersHorizontal, MessageCircle, Mail } from 'lucide-react';

const SERVICES = ['', 'Landing Page', 'SEO', 'Tráfego Pago', 'Branding', 'Vídeo', 'Automação & IA', 'Social Media', 'Full Service'];
const STATUSES: Array<{ value: LeadStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'new', label: 'Novo' },
  { value: 'contacted', label: 'Contatado' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'briefing', label: 'Briefing' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'won', label: 'Fechado' },
  { value: 'lost', label: 'Perdido' },
];
const PRIORITIES: Array<{ value: LeadPriority | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function LeadRow({ lead }: { lead: Lead }) {
  return (
    <tr className="group border-b border-border/50 transition-colors hover:bg-surface-2/60">
      <td className="py-3.5 pl-4 pr-2">
        <div>
          <p className="text-sm font-semibold text-ink">{lead.name}</p>
          <p className="text-xs text-muted">{lead.company}</p>
        </div>
      </td>
      <td className="px-2 py-3.5">
        <span className="text-xs text-muted">{lead.service}</span>
      </td>
      <td className="px-2 py-3.5">
        <PriorityBadge priority={lead.priority} />
      </td>
      <td className="px-2 py-3.5">
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-2 py-3.5">
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">{lead.source}</span>
      </td>
      <td className="px-2 py-3.5">
        <span className="font-mono text-xs text-muted">{formatDate(lead.createdAt)}</span>
      </td>
      <td className="px-2 py-3.5">
        <span className="text-xs text-muted">{lead.assignee || '—'}</span>
      </td>
      <td className="py-3.5 pl-2 pr-4">
        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <a
            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4ade80]/10 text-[#4ade80] transition hover:bg-[#4ade80]/20"
            title="WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/10 text-info transition hover:bg-info/20"
            title="E-mail"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>
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
    service: '',
  });

  const { leads, loading, total } = useLeads(filters);

  const set = <K extends keyof LeadFilters>(key: K, val: LeadFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const selectClass = 'rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-ink outline-none focus:border-gold/40 transition';

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Leads" subtitle={`${total} leads cadastrados`} />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Filtros */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por nome ou empresa..."
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2 py-2 pl-9 pr-4 text-sm text-ink placeholder:text-muted/50 outline-none focus:border-gold/40 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted" />
            <select value={filters.status} onChange={(e) => set('status', e.target.value as LeadStatus | 'all')} className={selectClass}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={filters.priority} onChange={(e) => set('priority', e.target.value as LeadPriority | 'all')} className={selectClass}>
              {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select value={filters.service} onChange={(e) => set('service', e.target.value)} className={selectClass}>
              <option value="">Serviço</option>
              {SERVICES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <span className="ml-auto text-xs text-muted">{leads.length} resultado{leads.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Nome / Empresa', 'Serviço', 'Prioridade', 'Status', 'Origem', 'Criado em', 'Responsável', 'Ação'].map((h) => (
                    <th key={h} className={`px-2 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-muted ${h === 'Nome / Empresa' ? 'pl-4' : ''} ${h === 'Ação' ? 'pr-4' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {Array.from({ length: 8 }).map((__, j) => (
                          <td key={j} className="px-2 py-3.5">
                            <div className="h-4 animate-pulse rounded-lg bg-surface-2" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : leads.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-sm text-muted">
                          Nenhum lead encontrado para os filtros selecionados.
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
