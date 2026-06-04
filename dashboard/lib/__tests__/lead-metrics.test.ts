import { describe, it, expect, vi } from 'vitest';

// supabase.ts envolve fetchLeads em unstable_cache no load do módulo.
// Mockamos next/cache pra importar só as funções puras de cálculo sem puxar
// o runtime de cache do Next (que exige escopo de request).
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}));

import {
  computeLeadCounts,
  computeTopServices,
  computeLeadsPerDay,
} from '../services/supabase';
import type { Lead } from '../types';
import type { DateRange } from '../date-range';

function lead(over: Partial<Lead>): Lead {
  return {
    id: over.leadKey ?? 'k',
    leadKey: 'k',
    nome: 'Fulano',
    email: 'f@x.com',
    phone: '11999999999',
    empresa: 'ACME',
    servico: 'IA',
    objetivo: '',
    status: 'novo',
    prioridade: 'baixa',
    source: 'site',
    stepFunil: null,
    briefingCompleto: false,
    createdAt: '2026-06-10T12:00:00Z',
    updatedAt: '2026-06-10T12:00:00Z',
    ...over,
  };
}

// Range amplo que contém junho/2026.
const range: DateRange = {
  preset: 'custom',
  from: new Date('2026-06-01T00:00:00Z'),
  to: new Date('2026-06-30T23:59:59Z'),
};

describe('computeLeadCounts', () => {
  it('conta total e qualificados (qualificado + enviado_para_equipe)', () => {
    const leads = [
      lead({ leadKey: 'a', status: 'novo' }),
      lead({ leadKey: 'b', status: 'qualificado' }),
      lead({ leadKey: 'c', status: 'enviado_para_equipe' }),
      lead({ leadKey: 'd', status: 'em_atendimento', briefingCompleto: true }),
    ];
    const { current } = computeLeadCounts(leads, range);
    expect(current.total).toBe(4);
    expect(current.qualificados).toBe(2);
    expect(current.enviadosEquipe).toBe(1);
    expect(current.briefingsCompletos).toBe(1);
  });

  it('exclui leads fora do range', () => {
    const leads = [
      lead({ leadKey: 'in', createdAt: '2026-06-15T10:00:00Z' }),
      lead({ leadKey: 'out', createdAt: '2026-01-01T10:00:00Z' }),
    ];
    expect(computeLeadCounts(leads, range).current.total).toBe(1);
  });

  it('calcula a janela anterior separadamente', () => {
    const leads = [lead({ leadKey: 'x', createdAt: '2026-06-15T10:00:00Z' })];
    const { current, previous } = computeLeadCounts(leads, range);
    expect(current.total).toBe(1);
    expect(previous.total).toBe(0);
  });
});

describe('computeTopServices', () => {
  it('agrupa por serviço, ordena desc e calcula pct', () => {
    const leads = [
      lead({ leadKey: '1', servico: 'IA' }),
      lead({ leadKey: '2', servico: 'IA' }),
      lead({ leadKey: '3', servico: 'SEO' }),
      lead({ leadKey: '4', servico: 'Tráfego' }),
    ];
    const top = computeTopServices(leads, range);
    expect(top[0]).toMatchObject({ service: 'IA', leads: 2, pct: 50 });
    expect(top.map((t) => t.service)).toContain('SEO');
  });

  it('respeita o limite', () => {
    const leads = ['a', 'b', 'c', 'd', 'e', 'f'].map((s) =>
      lead({ leadKey: s, servico: `S-${s}` }),
    );
    expect(computeTopServices(leads, range, 3)).toHaveLength(3);
  });

  it('retorna vazio sem leads no range', () => {
    expect(computeTopServices([], range)).toEqual([]);
  });
});

describe('computeLeadsPerDay', () => {
  it('agrupa por dia (dd/mm fuso SP)', () => {
    const leads = [
      lead({ leadKey: '1', createdAt: '2026-06-10T12:00:00Z' }),
      lead({ leadKey: '2', createdAt: '2026-06-10T18:00:00Z' }),
      lead({ leadKey: '3', createdAt: '2026-06-11T12:00:00Z' }),
    ];
    const map = computeLeadsPerDay(leads, range);
    expect(map.get('10/06')).toBe(2);
    expect(map.get('11/06')).toBe(1);
  });
});
