import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const VALID_ROLES = ['admin', 'viewer'] as const;

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const targetId = params.id;
  if (targetId === user.id) {
    return NextResponse.json({ error: 'Não é possível alterar o próprio role.' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  if (!VALID_ROLES.includes(body.role)) {
    return NextResponse.json({ error: 'Role inválido.' }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('dashboard_users')
    .update({ role: body.role })
    .eq('id', targetId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
