-- Dashboard HSB — Multi-user auth via Supabase Auth
-- Migration 001: cria dashboard_users com roles (admin/viewer) e trigger
-- que popula automaticamente quando um auth.users é criado.

-- ─── Tabela ─────────────────────────────────────────────────────────────
create table if not exists public.dashboard_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  role        text not null default 'viewer' check (role in ('admin', 'viewer')),
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists dashboard_users_email_idx on public.dashboard_users (email);

-- ─── Trigger: criar dashboard_users ao criar auth.users ─────────────────
create or replace function public.handle_new_dashboard_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.dashboard_users (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'viewer'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_dashboard on auth.users;
create trigger on_auth_user_created_dashboard
  after insert on auth.users
  for each row execute function public.handle_new_dashboard_user();

-- ─── Trigger: updated_at ────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_dashboard_users on public.dashboard_users;
create trigger touch_dashboard_users
  before update on public.dashboard_users
  for each row execute function public.touch_updated_at();

-- ─── RLS ────────────────────────────────────────────────────────────────
alter table public.dashboard_users enable row level security;

-- Qualquer dashboard_user autenticado pode ver a própria linha
drop policy if exists "dashboard_users_self_read" on public.dashboard_users;
create policy "dashboard_users_self_read"
  on public.dashboard_users
  for select
  to authenticated
  using (id = auth.uid());

-- Admins veem todos
drop policy if exists "dashboard_users_admin_read_all" on public.dashboard_users;
create policy "dashboard_users_admin_read_all"
  on public.dashboard_users
  for select
  to authenticated
  using (
    exists (
      select 1 from public.dashboard_users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins atualizam qualquer linha
drop policy if exists "dashboard_users_admin_update" on public.dashboard_users;
create policy "dashboard_users_admin_update"
  on public.dashboard_users
  for update
  to authenticated
  using (
    exists (
      select 1 from public.dashboard_users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── Pós-migration ──────────────────────────────────────────────────────
-- Depois de rodar essa migration:
--   1. Authentication → Users → "Add user" → cria seu primeiro usuário admin
--   2. SQL: update public.dashboard_users set role='admin' where email='SEU_EMAIL';
--   3. Reutiliza esse usuário pra logar no dashboard
