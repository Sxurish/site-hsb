'use client';

import { useState, useEffect } from 'react';
import type { KpiCard, TimePoint } from '@/lib/types';
import { kpiCards as mockKpi, timeSeries as mockSeries } from '@/lib/mock-data';

interface MetricsState {
  kpis: KpiCard[];
  timeSeries: TimePoint[];
  loading: boolean;
  error: string | null;
}

export function useMetrics(): MetricsState {
  const [state, setState] = useState<MetricsState>({
    kpis: [],
    timeSeries: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        // TODO: substituir por fetch real quando Supabase/PostHog estiverem configurados
        // const [kpis, timeSeries] = await Promise.all([
        //   fetchSiteMetrics(from, to),
        //   fetchTimeSeries(from, to),
        // ]);
        await new Promise((r) => setTimeout(r, 400)); // simula latência
        setState({ kpis: mockKpi, timeSeries: mockSeries, loading: false, error: null });
      } catch (err) {
        setState((s) => ({ ...s, loading: false, error: String(err) }));
      }
    };
    load();
  }, []);

  return state;
}
