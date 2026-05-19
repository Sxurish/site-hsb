'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import {
  paramsToRange, rangeToParams, presetToRange,
  type DateRange, type PresetKey,
} from '@/lib/date-range';

// Lê range dos search params da URL e expõe setRange que dá replace na URL.
// `router.replace` (não push) — evita poluir history em cada troca de preset.
// scroll: false — não pula pro topo da página.
export function useDateRange() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const range = useMemo(
    () => paramsToRange({
      from: sp.get('from'),
      to: sp.get('to'),
      preset: sp.get('preset'),
    }),
    [sp],
  );

  const writeUrl = useCallback((next: DateRange) => {
    const params = new URLSearchParams(sp.toString());
    const { from, to, preset } = rangeToParams(next);
    if (preset !== 'custom') {
      params.set('preset', preset);
      params.delete('from');
      params.delete('to');
    } else {
      params.delete('preset');
      params.set('from', from);
      params.set('to', to);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [sp, router, pathname]);

  const setPreset = useCallback((p: PresetKey) => writeUrl(presetToRange(p)), [writeUrl]);
  const setCustom = useCallback((from: Date, to: Date) => writeUrl({
    preset: 'custom', from, to,
  }), [writeUrl]);

  return { range, setPreset, setCustom };
}
