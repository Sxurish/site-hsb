import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface DashboardUser {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  full_name: string | null;
}

// Use em server components / route handlers. Redireciona pra /login se não logado.
// `cache()` dedup por request — várias chamadas no mesmo render compartilham resultado.
export const requireUser = cache(async (): Promise<DashboardUser> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: row, error: selectError } = await supabase
    .from('dashboard_users')
    .select('id,email,role,full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) {
    console.error('[requireUser] dashboard_users select error:', selectError);
  }

  // Self-heal: se auth.users existe mas dashboard_users não tem a linha,
  // cria como viewer (trigger pode ter perdido o evento se foi criada depois).
  if (!row) {
    const { data: inserted, error: insertError } = await supabase
      .from('dashboard_users')
      .insert({ id: user.id, email: user.email ?? '', role: 'viewer' })
      .select('id,email,role,full_name')
      .maybeSingle();
    if (insertError) {
      console.error('[requireUser] dashboard_users self-heal insert error:', insertError);
    }
    if (inserted) return inserted as DashboardUser;
  } else {
    return row as DashboardUser;
  }

  redirect('/login?error=no_dashboard_user');
});

// Variante que NÃO redireciona — retorna null se não logado. Use em layouts/headers.
export const getUser = cache(async (): Promise<DashboardUser | null> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row, error } = await supabase
    .from('dashboard_users')
    .select('id,email,role,full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (error) console.error('[getUser] dashboard_users select error:', error);
  return (row as DashboardUser) ?? null;
});

export const requireAdmin = cache(async (): Promise<DashboardUser> => {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/overview?error=forbidden');
  return user;
});
