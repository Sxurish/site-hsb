import { Header } from '@/components/layout/header';
import { reports } from '@/lib/mock-data';
import type { Report } from '@/lib/types';
import { FileDown, Calendar, BarChart2, Users, Filter, Clock } from 'lucide-react';

const TYPE_CONFIG: Record<Report['type'], { label: string; icon: React.ElementType; color: string }> = {
  weekly:  { label: 'Semanal',  icon: Calendar,  color: '#60a5fa' },
  monthly: { label: 'Mensal',   icon: BarChart2,  color: '#d4a566' },
  funnel:  { label: 'Funil',    icon: Filter,     color: '#a78bfa' },
  leads:   { label: 'Leads',    icon: Users,      color: '#4ade80' },
};

const STATUS_CONFIG: Record<Report['status'], { label: string; dot: string; text: string }> = {
  ready:      { label: 'Pronto',       dot: 'bg-success', text: 'text-success'  },
  generating: { label: 'Gerando...',   dot: 'bg-warning', text: 'text-warning'  },
  scheduled:  { label: 'Agendado',     dot: 'bg-muted',   text: 'text-muted'    },
};

// Tipos de relatórios disponíveis para gerar
const REPORT_TYPES = [
  { type: 'weekly',  label: 'Relatório Semanal',    desc: 'Métricas de tráfego, leads e conversão da última semana.',  icon: Calendar,  color: '#60a5fa' },
  { type: 'monthly', label: 'Relatório Mensal',     desc: 'Visão consolidada do mês com comparativo e projeções.',      icon: BarChart2,  color: '#d4a566' },
  { type: 'funnel',  label: 'Análise de Funil',     desc: 'Taxa de conversão detalhada por etapa com gargalos.',        icon: Filter,     color: '#a78bfa' },
  { type: 'leads',   label: 'Pipeline de Leads',    desc: 'Lista completa com status, prioridade e responsável.',       icon: Users,      color: '#4ade80' },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Relatórios" subtitle="Gere e exporte relatórios de performance" />

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
        {/* Gerar novo relatório */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Gerar novo</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {REPORT_TYPES.map(({ type, label, desc, icon: Icon, color }) => (
              <button
                key={type}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition-all hover:border-border-strong hover:shadow-card active:scale-[0.98]"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{desc}</p>
                </div>
                <span
                  className="mt-auto text-xs font-semibold"
                  style={{ color }}
                >
                  Gerar → {/* TODO: conectar com n8n */}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Histórico */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Histórico</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-border">
                  {['Relatório', 'Tipo', 'Período', 'Gerado em', 'Status', 'Download'].map((h) => (
                    <th key={h} className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-muted ${h === 'Download' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const t = TYPE_CONFIG[report.type];
                  const s = STATUS_CONFIG[report.status];
                  const Icon = t.icon;
                  return (
                    <tr key={report.id} className="group border-b border-border/50 transition-colors last:border-0 hover:bg-surface-2/60">
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-ink">{report.title}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: t.color }}>
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                          {t.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-muted">{report.period}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Clock className="h-3 w-3" strokeWidth={1.5} />
                          {report.generatedAt}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {report.status === 'ready' ? (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink opacity-0 transition hover:bg-border-strong group-hover:opacity-100"
                            title="Exportar PDF" // TODO: conectar com n8n
                          >
                            <FileDown className="h-3.5 w-3.5" />
                            Exportar
                          </button>
                        ) : (
                          <span className="text-xs text-muted/40">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-muted/40 pb-2">
          Relatórios gerados via n8n · PDFs exportados para o Google Drive da equipe
        </p>
      </div>
    </div>
  );
}
