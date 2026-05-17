-- Dashboard HSB — Fix RLS recursivo em dashboard_users
-- Migration 002: corrige causa raiz do bug "/overview não carrega após login".
--
-- Problema:
--   001 criou "dashboard_users_admin_read_all" e "dashboard_users_admin_update"
--   com EXISTS (SELECT … FROM dashboard_users …) — recursivo. Postgres dispara
--   42P17 "infinite recursion detected in policy", o que zera o SELECT em
--   requireUser(). Em seguida o self-heal tenta INSERT, mas 001 nunca criou
--   policy FOR INSERT — RLS bloqueia silenciosamente e cai no
--   redirect('/login?error=no_dashboard_user'), gerando loop com o middleware.
--
-- Fix:
--   1. Substitui as policies recursivas por checagem via função SECURITY DEFINER
--      (bypassa RLS internamente; sem recursão no plano).
--   2. Adiciona policy FOR INSERT pro self-heal funcionar quando o trigger
--      handle_new_dashboard_user perder o evento.

-- ─── 1. Função SECURITY DEFINER que bypassa RLS para checar role ──────────
create or replace function public.is_dashboard_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.dashboard_users
    where id = uid and role = 'admin'
  );
$$;

revoke all on function public.is_dashboard_admin(uuid) from public;
grant execute on function public.is_dashboard_admin(uuid) to authenticated;

-- ─── 2. Recria policies admin sem recursão ────────────────────────────────
drop policy if exists "dashboard_users_admin_read_all" on public.dashboard_users;
create policy "dashboard_users_admin_read_all"
  on public.dashboard_users
  for select
  to authenticated
  using (public.is_dashboard_admin(auth.uid()));

drop policy if exists "dashboard_users_admin_update" on public.dashboard_users;
create policy "dashboard_users_admin_update"
  on public.dashboard_users
  for update
  to authenticated
  using (public.is_dashboard_admin(auth.uid()));

-- ─── 3. Policy INSERT pro self-heal de requireUser() ──────────────────────
-- Só permite inserir a própria linha (id = auth.uid()), e fixa role='viewer'
-- no banco para evitar escalação de privilégio via insert manual.
drop policy if exists "dashboard_users_self_insert" on public.dashboard_users;
create policy "dashboard_users_self_insert"
  on public.dashboard_users
  for insert
  to authenticated
  with check (id = auth.uid() and role = 'viewer');
