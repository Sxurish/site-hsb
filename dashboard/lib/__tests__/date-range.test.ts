import { describe, it, expect } from 'vitest';
import {
  paramsToRange,
  previousRange,
  rangeDays,
  rangeToParams,
  presetToRange,
  DEFAULT_RANGE,
} from '../date-range';

describe('rangeDays', () => {
  it('conta dias inclusive (from e to no mesmo dia = 1)', () => {
    const r = presetToRange('today');
    expect(rangeDays(r)).toBe(1);
  });

  it('last7 = 7 dias', () => {
    expect(rangeDays(presetToRange('last7'))).toBe(7);
  });

  it('last30 = 30 dias', () => {
    expect(rangeDays(presetToRange('last30'))).toBe(30);
  });

  it('faz clamp em no máximo 365 dias', () => {
    const huge = {
      preset: 'custom' as const,
      from: new Date('2000-01-01T00:00:00Z'),
      to: new Date('2010-01-01T00:00:00Z'),
    };
    expect(rangeDays(huge)).toBe(365);
  });
});

describe('previousRange', () => {
  it('retorna janela anterior de mesma duração, terminando 1ms antes do from', () => {
    const r = presetToRange('last7');
    const prev = previousRange(r);
    expect(rangeDays(prev)).toBe(7);
    expect(prev.to.getTime()).toBe(r.from.getTime() - 1);
  });

  it('janelas atual e anterior não se sobrepõem', () => {
    const r = presetToRange('last30');
    const prev = previousRange(r);
    expect(prev.to.getTime()).toBeLessThan(r.from.getTime());
  });
});

describe('paramsToRange', () => {
  it('preset conhecido tem prioridade e recalcula a partir de hoje', () => {
    const r = paramsToRange({ preset: 'last7', from: '2020-01-01', to: '2020-01-02' });
    expect(r.preset).toBe('last7');
    expect(rangeDays(r)).toBe(7);
  });

  it('from/to válidos sem preset → range custom', () => {
    const r = paramsToRange({ from: '2026-01-01', to: '2026-01-31', preset: null });
    expect(r.preset).toBe('custom');
    expect(rangeDays(r)).toBe(31);
  });

  it('datas inválidas caem no DEFAULT_RANGE', () => {
    const r = paramsToRange({ from: 'lixo', to: 'também-lixo', preset: null });
    expect(r.preset).toBe(DEFAULT_RANGE.preset);
  });

  it('from depois de to é rejeitado → DEFAULT_RANGE', () => {
    const r = paramsToRange({ from: '2026-12-31', to: '2026-01-01', preset: null });
    expect(r.preset).toBe(DEFAULT_RANGE.preset);
  });

  it('params ausentes → DEFAULT_RANGE', () => {
    const r = paramsToRange({});
    expect(r.preset).toBe(DEFAULT_RANGE.preset);
  });
});

describe('round-trip params', () => {
  it('rangeToParams → paramsToRange preserva um range custom', () => {
    const original = paramsToRange({ from: '2026-03-10', to: '2026-03-20', preset: null });
    const params = rangeToParams(original);
    const back = paramsToRange(params);
    expect(back.from.getTime()).toBe(original.from.getTime());
    expect(back.to.getTime()).toBe(original.to.getTime());
  });
});
