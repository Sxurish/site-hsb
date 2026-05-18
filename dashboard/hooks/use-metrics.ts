'use client';

import { useState, useEffect } from 'react';
import type { MetricsPayload } from '@/lib/types';

const EMPTY: MetricsPayload = {
  kpis: [],
  timeSeries: [],
  topServices: [],
  funnelSummary: [],
  leadStats: { total: 0, avgPerDay: 0, best: 0 },
};

export function useMetrics(): MetricsPayload & { loading: boolean; error: string | null } {
  const [data, setData] = useState<MetricsPayload>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/metrics')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Falha ao carregar métricas');
        return json as MetricsPayload;
      })
      .then((json) => {
        if (!active) return;
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(String(err.message || err));
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { ...data, loading, error };
}
