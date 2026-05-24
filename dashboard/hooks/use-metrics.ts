'use client';

import { useEffect, useState } from 'react';
import type { MetricsPayload } from '@/lib/types';
import { rangeToParams, type DateRange } from '@/lib/date-range';

const EMPTY: MetricsPayload = {
  kpis: [],
  timeSeries: [],
  topServices: [],
  funnelSummary: [],
  leadStats: { total: 0, avgPerDay: 0, best: 0 },
};

export function useMetrics(range: DateRange): MetricsPayload & { loading: boolean; error: string | null } {
  const [data, setData] = useState<MetricsPayload>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reage aos timestamps — o objeto range é recriado a cada render do useDateRange.
  const fromMs = range.from.getTime();
  const toMs = range.to.getTime();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const { from, to, preset } = rangeToParams(range);
    const qs = preset !== 'custom' ? `preset=${preset}` : `from=${from}&to=${to}`;

    fetch(`/api/metrics?${qs}`)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromMs, toMs]);

  return { ...data, loading, error };
}
