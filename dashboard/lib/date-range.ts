// Tipos + presets + helpers de range de datas.
// Range é sempre inclusive: [from, to]. Convenção: from = start-of-day, to = end-of-day,
// no fuso America/Sao_Paulo. Armazenado em Date (timestamp UTC absoluto).

export type PresetKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
  preset: PresetKey;
}

export const PRESETS: { key: Exclude<PresetKey, 'custom'>; label: string }[] = [
  { key: 'today',      label: 'Hoje' },
  { key: 'yesterday',  label: 'Ontem' },
  { key: 'last7',      label: 'Últimos 7 dias' },
  { key: 'last30',     label: 'Últimos 30 dias' },
  { key: 'thisMonth',  label: 'Este mês' },
  { key: 'lastMonth',  label: 'Mês passado' },
];

// Constrói uma Date que representa "início do dia em SP" no instante UTC certo.
// SP é UTC-3 sem DST. Pra start-of-day SP do dia D: D 00:00 SP = D 03:00 UTC.
const SP_OFFSET_HOURS = 3;

function startOfDaySP(y: number, m: number, d: number): Date {
  // m é 1-based aqui pra clareza
  return new Date(Date.UTC(y, m - 1, d, SP_OFFSET_HOURS, 0, 0, 0));
}

function endOfDaySP(y: number, m: number, d: number): Date {
  // 23:59:59.999 SP = 02:59:59.999 UTC do dia D+1
  return new Date(Date.UTC(y, m - 1, d, SP_OFFSET_HOURS + 23, 59, 59, 999));
}

function todaySP(): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const parts = fmt.format(new Date()).split('-');
  return { y: Number(parts[0]), m: Number(parts[1]), d: Number(parts[2]) };
}

function addDaysSP(base: { y: number; m: number; d: number }, delta: number) {
  // Constrói em UTC e reextrai (SP sem DST → seguro)
  const utc = Date.UTC(base.y, base.m - 1, base.d + delta);
  const dt = new Date(utc);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

export function presetToRange(p: PresetKey): DateRange {
  const t = todaySP();
  switch (p) {
    case 'today': {
      return { preset: 'today', from: startOfDaySP(t.y, t.m, t.d), to: endOfDaySP(t.y, t.m, t.d) };
    }
    case 'yesterday': {
      const y = addDaysSP(t, -1);
      return { preset: 'yesterday', from: startOfDaySP(y.y, y.m, y.d), to: endOfDaySP(y.y, y.m, y.d) };
    }
    case 'last7': {
      const from = addDaysSP(t, -6);
      return { preset: 'last7', from: startOfDaySP(from.y, from.m, from.d), to: endOfDaySP(t.y, t.m, t.d) };
    }
    case 'last30': {
      const from = addDaysSP(t, -29);
      return { preset: 'last30', from: startOfDaySP(from.y, from.m, from.d), to: endOfDaySP(t.y, t.m, t.d) };
    }
    case 'thisMonth': {
      return {
        preset: 'thisMonth',
        from: startOfDaySP(t.y, t.m, 1),
        to: endOfDaySP(t.y, t.m, t.d),
      };
    }
    case 'lastMonth': {
      const prev = addDaysSP({ y: t.y, m: t.m, d: 1 }, -1);
      const lastDayOfPrev = new Date(Date.UTC(prev.y, prev.m, 0)).getUTCDate();
      return {
        preset: 'lastMonth',
        from: startOfDaySP(prev.y, prev.m, 1),
        to: endOfDaySP(prev.y, prev.m, lastDayOfPrev),
      };
    }
    case 'custom':
    default:
      return presetToRange('last30');
  }
}

export const DEFAULT_RANGE: DateRange = presetToRange('last30');

// 'YYYY-MM-DD' em SP — formato compacto pra URL.
export function dateToSPISO(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
}

export function rangeToParams(r: DateRange): { from: string; to: string; preset: PresetKey } {
  return { from: dateToSPISO(r.from), to: dateToSPISO(r.to), preset: r.preset };
}

// 'YYYY-MM-DD' → DateRange (SP). Aceita preset reconhecido pra evitar drift quando a URL é antiga.
export function paramsToRange(params: {
  from?: string | null;
  to?: string | null;
  preset?: string | null;
}): DateRange {
  // Se tem preset válido e não tem from/to custom, usa o preset (recalcula com data atual).
  const presetVal = params.preset as PresetKey | undefined | null;
  const knownPresets: PresetKey[] = ['today', 'yesterday', 'last7', 'last30', 'thisMonth', 'lastMonth', 'custom'];
  if (presetVal && knownPresets.includes(presetVal) && presetVal !== 'custom') {
    return presetToRange(presetVal);
  }

  const re = /^(\d{4})-(\d{2})-(\d{2})$/;
  const mf = params.from ? re.exec(params.from) : null;
  const mt = params.to ? re.exec(params.to) : null;
  if (!mf || !mt) return DEFAULT_RANGE;

  const from = startOfDaySP(Number(mf[1]), Number(mf[2]), Number(mf[3]));
  const to = endOfDaySP(Number(mt[1]), Number(mt[2]), Number(mt[3]));
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from.getTime() > to.getTime()) {
    return DEFAULT_RANGE;
  }
  return { from, to, preset: 'custom' };
}

// Número de dias do range (inclusive). Clamp em 1..365.
export function rangeDays(r: DateRange): number {
  // `to` é fim-do-dia (23:59:59.999), então o span é ~N dias inteiros menos 1ms.
  // ceil recupera o número de dias inclusive (N), sem contar um dia a mais.
  const ms = r.to.getTime() - r.from.getTime();
  const days = Math.ceil(ms / 86_400_000);
  return Math.min(Math.max(days, 1), 365);
}

// Range anterior de mesma duração — usado pra calcular trend %.
export function previousRange(r: DateRange): DateRange {
  const days = rangeDays(r);
  const ms = days * 86_400_000;
  return {
    preset: 'custom',
    from: new Date(r.from.getTime() - ms),
    to: new Date(r.from.getTime() - 1),
  };
}

// Label curto pra exibir no botão do picker.
export function rangeLabel(r: DateRange): string {
  if (r.preset !== 'custom') {
    return PRESETS.find((p) => p.key === r.preset)?.label ?? 'Personalizado';
  }
  const fmt = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'America/Sao_Paulo',
  });
  return `${fmt.format(r.from)} – ${fmt.format(r.to)}`;
}
