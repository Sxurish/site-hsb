import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface DashboardUser {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  full_name: string | null;
}

// Use em server components / route handlers. Redireciona pra /login se não logado.
export async function requireUser(): Promise<DashboardUser> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: row } = await supabase
    .from('dashboard_users')
    .select('id,email,role,full_name')
    .eq('id', user.id)
    .single();

  if (!row) {
    // Auth user existe mas dashboard_users não foi populado (raro — trigger falhou?)
    redirect('/login?error=no_dashboard_user');
  }

  return row as DashboardUser;
}

// Variante que NÃO redireciona — retorna null se não logado. Use em layouts/headers.
export async function getUser(): Promise<DashboardUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from('dashboard_users')
    .select('id,email,role,full_name')
    .eq('id', user.id)
    .single();

  return (row as DashboardUser) ?? null;
}

export async function requireAdmin(): Promise<DashboardUser> {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/overview?error=forbidden');
  return user;
}
