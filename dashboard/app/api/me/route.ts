import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const full_name = typeof body.full_name === 'string'
    ? body.full_name.trim().slice(0, 80) || null
    : null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('dashboard_users')
    .update({ full_name })
    .eq('id', user.id)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // RLS pode "aceitar" o UPDATE sem afetar linha nenhuma (0 rows, sem erro).
  // Detecta e devolve erro em vez de fingir sucesso.
  if (!data?.length) {
    return NextResponse.json(
      { error: 'Atualização bloqueada pelas policies do banco (rode a migration 003).' },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
