import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getUserMock, eqMock, updateMock, fromMock, createClientMock } = vi.hoisted(() => {
  const eqMock = vi.fn();
  const updateMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ update: updateMock }));
  return {
    getUserMock: vi.fn(),
    eqMock,
    updateMock,
    fromMock,
    createClientMock: vi.fn(() => ({ from: fromMock })),
  };
});

vi.mock('@/lib/auth', () => ({ getUser: getUserMock }));
vi.mock('@/lib/supabase/server', () => ({ createClient: createClientMock }));

import { PATCH } from '@/app/api/team/[id]/route';

const admin = { id: 'a1', email: 'a@x.com', role: 'admin', full_name: null };
const viewer = { id: 'v1', email: 'v@x.com', role: 'viewer', full_name: null };

function req(body: unknown) {
  return new Request('http://localhost/api/team/t1', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
const ctx = (id: string) => ({ params: { id } });

beforeEach(() => {
  vi.clearAllMocks();
  eqMock.mockResolvedValue({ error: null });
});

describe('PATCH /api/team/[id]', () => {
  it('401 sem usuário', async () => {
    getUserMock.mockResolvedValue(null);
    expect((await PATCH(req({ role: 'admin' }), ctx('t1'))).status).toBe(401);
  });

  it('403 para viewer', async () => {
    getUserMock.mockResolvedValue(viewer);
    expect((await PATCH(req({ role: 'admin' }), ctx('t1'))).status).toBe(403);
  });

  it('400 ao tentar alterar o próprio role', async () => {
    getUserMock.mockResolvedValue(admin);
    const res = await PATCH(req({ role: 'viewer' }), ctx(admin.id));
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('400 com role inválido', async () => {
    getUserMock.mockResolvedValue(admin);
    const res = await PATCH(req({ role: 'superadmin' }), ctx('t1'));
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('200 admin altera role de outro usuário', async () => {
    getUserMock.mockResolvedValue(admin);
    const res = await PATCH(req({ role: 'admin' }), ctx('t1'));
    expect(res.status).toBe(200);
    expect(updateMock).toHaveBeenCalledWith({ role: 'admin' });
    expect(eqMock).toHaveBeenCalledWith('id', 't1');
  });
});
