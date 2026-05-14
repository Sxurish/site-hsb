'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Lead, LeadStatus, LeadPriority } from '@/lib/types';
import { leads as mockLeads } from '@/lib/mock-data';

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
  priority: LeadPriority | 'all';
  service: string;
}

interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

export function useLeads(filters: LeadFilters): LeadsState & { total: number } {
  const [raw, setRaw] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // TODO: substituir por fetchLeads() do Supabase
        await new Promise((r) => setTimeout(r, 300));
        setRaw(mockLeads);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    };
    load();
  }, []);

  const leads = useMemo(() => {
    return raw.filter((l) => {
      if (filters.status !== 'all' && l.status !== filters.status) return false;
      if (filters.priority !== 'all' && l.priority !== filters.priority) return false;
      if (filters.service && l.service !== filters.service) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q);
      }
      return true;
    });
  }, [raw, filters]);

  return { leads, loading, error, total: raw.length };
}
