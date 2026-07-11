-- Dashboard HSB — Hardening pós-advisors (Supabase database linter)
-- Migration 004: fecha os avisos de segurança apontados pelo linter.
--
-- 1. O Supabase concede EXECUTE a anon/authenticated por default privilege
--    na criação de funções — o `revoke ... from public` das migrations
--    002/003 NÃO remove esses grants diretos. Resultado: `anon` conseguia
--    chamar as funções SECURITY DEFINER via /rest/v1/rpc/*.
--    `authenticated` PRECISA manter EXECUTE em dashboard_user_role e
--    is_dashboard_admin (as policies RLS avaliam com o privilégio do
--    usuário da query); `anon` não precisa de nenhuma.
--
-- 2. handle_new_dashboard_user é função de trigger — Postgres só checa
--    EXECUTE na criação do trigger, não no disparo. Ninguém precisa
--    chamá-la via RPC; revoga de todos os roles de API.
--
-- 3. Funções de trigger sem search_path fixo (lint 0011) — pina em public.

revoke execute on function public.dashboard_user_role(uuid) from anon;
revoke execute on function public.is_dashboard_admin(uuid) from anon;

revoke execute on function public.handle_new_dashboard_user() from public, anon, authenticated;

alter function public.touch_updated_at() set search_path = public;
alter function public.update_updated_at() set search_path = public;
