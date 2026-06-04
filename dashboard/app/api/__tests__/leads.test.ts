import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getUserMock, fetchLeadsMock, updateLeadStatusMock, revalidateTagMock } = vi.hoisted(() => ({
  getUserMock: vi.fn(),
  fetchLeadsMock: vi.fn(),
  updateLeadStatusMock: vi.fn(),
  revalidateTagMock: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getUser: getUserMock }));
vi.mock('@/lib/services/supabase', () => ({
  fetchLeads: fetchLeadsMock,
  updateLeadStatus: updateLeadStatusMock,
  LEADS_CACHE_TAG: 'leads',
}));
vi.mock('next/cache', () => ({ revalidateTag: revalidateTagMock }));

import { GET, PATCH } from '@/app/api/leads/route';

const admin = { id: 'a1', email: 'a@x.com', role: 'admin', full_name: null };
const viewer = { id: 'v1', email: 'v@x.com', role: 'viewer', full_name: null };

function patchReq(body: unknown) {
  return new Request('http://localhost/api/leads', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  fetchLeadsMock.mockResolvedValue([{ id: '1', nome: 'x' }]);
  updateLeadStatusMock.mockResolvedValue(undefined);
});

describe('GET /api/leads', () => {
  it('401 sem usuário', async () => {
    getUserMock.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('403 para viewer (PII restrita a admin)', async () => {
    getUserMock.mockResolvedValue(viewer);
    const res = await GET();
    expect(res.status).toBe(403);
    expect(fetchLeadsMock).not.toHaveBeenCalled();
  });

  it('200 + leads para admin', async () => {
    getUserMock.mockResolvedValue(admin);
    const res = await GET();
    expect(res.status).toBe(200);
    expect((await res.json()).leads).toHaveLength(1);
  });
});

describe('PATCH /api/leads', () => {
  it('401 sem usuário', async () => {
    getUserMock.mockResolvedValue(null);
    expect((await PATCH(patchReq({ id: 'k', status: 'novo' }))).status).toBe(401);
  });

  it('403 para viewer', async () => {
    getUserMock.mockResolvedValue(viewer);
    expect((await PATCH(patchReq({ id: 'k', status: 'novo' }))).status).toBe(403);
  });

  it('400 com status inválido', async () => {
    getUserMock.mockResolvedValue(admin);
    const res = await PATCH(patchReq({ id: 'k', status: 'hackeado' }));
    expect(res.status).toBe(400);
    expect(updateLeadStatusMock).not.toHaveBeenCalled();
  });

  it('400 sem id', async () => {
    getUserMock.mockResolvedValue(admin);
    expect((await PATCH(patchReq({ status: 'novo' }))).status).toBe(400);
  });

  it('200 + atualiza e invalida cache para admin', async () => {
    getUserMock.mockResolvedValue(admin);
    const res = await PATCH(patchReq({ id: 'k', status: 'qualificado' }));
    expect(res.status).toBe(200);
    expect(updateLeadStatusMock).toHaveBeenCalledWith('k', 'qualificado');
    expect(revalidateTagMock).toHaveBeenCalledWith('leads');
  });
});
