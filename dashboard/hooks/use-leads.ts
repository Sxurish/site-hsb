'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Lead, LeadFilters } from '@/lib/types';
import type { DateRange } from '@/lib/date-range';

export type { LeadFilters };

interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  total: number;
  inRange: number;
}

export function useLeads(filters: LeadFilters, range: DateRange): LeadsState {
  const [raw, setRaw] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/leads')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Falha ao carregar leads');
        return json.leads as Lead[];
      })
      .then((leads) => {
        if (!active) return;
        setRaw(leads);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(String(err.message || err));
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const fromMs = range.from.getTime();
  const toMs = range.to.getTime();

  const inRangeLeads = useMemo(() => {
    return raw.filter((l) => {
      const t = new Date(l.createdAt).getTime();
      return t >= fromMs && t <= toMs;
    });
  }, [raw, fromMs, toMs]);

  const leads = useMemo(() => {
    return inRangeLeads.filter((l) => {
      if (filters.status !== 'all' && l.status !== filters.status) return false;
      if (filters.priority !== 'all' && l.prioridade !== filters.priority) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          l.nome.toLowerCase().includes(q) ||
          l.empresa.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inRangeLeads, filters]);

  return { leads, loading, error, total: raw.length, inRange: inRangeLeads.length };
}
