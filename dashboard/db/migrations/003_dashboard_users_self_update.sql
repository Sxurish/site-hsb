-- Dashboard HSB — Self-update de perfil sem escalação de privilégio
-- Migration 003: corrige o bug "salvar nome não funciona pra viewer".
--
-- Problema:
--   001/002 criaram policies de UPDATE apenas para admins
--   (dashboard_users_admin_update). O PATCH /api/me roda com a sessão do
--   próprio usuário (anon key + RLS); para um viewer o UPDATE de full_name
--   não casa com nenhuma policy, afeta 0 linhas e NÃO gera erro — a API
--   respondia ok e o nome nunca era salvo.
--
-- Fix:
--   Policy de self-update que permite editar a própria linha, mas NÃO o
--   próprio role. O WITH CHECK compara o role da linha nova com o role
--   atual lido por função SECURITY DEFINER (STABLE → enxerga o snapshot
--   pré-UPDATE), bloqueando viewer→admin via update manual.

-- ─── 1. Função que retorna o role atual (bypassa RLS, sem recursão) ───────
create or replace function public.dashboard_user_role(uid uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.dashboard_users where id = uid;
$$;

revoke all on function public.dashboard_user_role(uuid) from public;
grant execute on function public.dashboard_user_role(uuid) to authenticated;

-- ─── 2. Policy de self-update (role imutável pela própria pessoa) ─────────
drop policy if exists "dashboard_users_self_update" on public.dashboard_users;
create policy "dashboard_users_self_update"
  on public.dashboard_users
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.dashboard_user_role(auth.uid()));
