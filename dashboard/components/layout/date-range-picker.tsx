'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar, Check, ChevronDown } from 'lucide-react';
import { useDateRange } from '@/hooks/use-date-range';
import {
  PRESETS, dateToSPISO, rangeLabel,
  type PresetKey,
} from '@/lib/date-range';

export function DateRangePicker() {
  const { range, setPreset, setCustom } = useDateRange();
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pre-popula inputs custom com o range atual.
  useEffect(() => {
    setCustomFrom(dateToSPISO(range.from));
    setCustomTo(dateToSPISO(range.to));
  }, [range.from, range.to]);

  // Click outside fecha o dropdown.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  function handlePreset(p: PresetKey) {
    setPreset(p);
    setOpen(false);
  }

  function handleApplyCustom() {
    const re = /^(\d{4})-(\d{2})-(\d{2})$/;
    const mf = re.exec(customFrom);
    const mt = re.exec(customTo);
    if (!mf || !mt) return;
    // Reusa start/end of day SP via paramsToRange — passa pelo mesmo caminho da URL.
    const from = new Date(`${customFrom}T00:00:00-03:00`);
    const to = new Date(`${customTo}T23:59:59.999-03:00`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return;
    setCustom(from, to);
    setOpen(false);
  }

  const customValid =
    /^\d{4}-\d{2}-\d{2}$/.test(customFrom) &&
    /^\d{4}-\d{2}-\d{2}$/.test(customTo) &&
    customFrom <= customTo;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-8 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-xs font-medium text-ink transition hover:border-gold/40"
      >
        <Calendar className="h-3.5 w-3.5 text-muted" />
        <span className="hidden sm:inline">{rangeLabel(range)}</span>
        <span className="sm:hidden">{range.preset === 'custom' ? 'Custom' : 'Período'}</span>
        <ChevronDown className={`h-3 w-3 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Selecionar período"
          className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-xl shadow-black/40"
        >
          <ul className="space-y-0.5">
            {PRESETS.map((p) => {
              const active = range.preset === p.key;
              return (
                <li key={p.key}>
                  <button
                    type="button"
                    onClick={() => handlePreset(p.key)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
                      active
                        ? 'bg-gold-dim text-gold font-semibold'
                        : 'text-ink hover:bg-surface-2'
                    }`}
                  >
                    <span>{p.label}</span>
                    {active && <Check className="h-3 w-3" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="my-2 border-t border-border" />

          <div className="space-y-2 px-2 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">Personalizado</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted">
                De
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  max={customTo || undefined}
                  className="mt-0.5 w-full rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-xs text-ink outline-none focus:border-gold/40"
                />
              </label>
              <label className="text-[10px] text-muted">
                Até
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  min={customFrom || undefined}
                  className="mt-0.5 w-full rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-xs text-ink outline-none focus:border-gold/40"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={handleApplyCustom}
              disabled={!customValid}
              className="w-full rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-bg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-40"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
