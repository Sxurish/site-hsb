# 0003 — Autorização por role com `getUser()` + RLS

- **Status:** Aceito
- **Data:** 2026-06-04

## Contexto

O dashboard usa Supabase Auth. Precisamos validar identidade no servidor de forma confiável e
controlar acesso por papel (`admin`/`viewer`), sem confiar no cliente.

## Decisão

- Validar sessão sempre com `supabase.auth.getUser()` (não `getSession()`), conforme recomendação
  do Supabase — `getUser()` valida o token no servidor de Auth.
- Papel e dados do usuário vêm da tabela `dashboard_users`; helpers `requireUser()`, `getUser()`
  e `requireAdmin()` em `lib/auth.ts` centralizam a checagem.
- **Defense-in-depth:** além da checagem na aplicação, RLS habilitado em `dashboard_users`
  (self-read, admin-read-all via função `SECURITY DEFINER` para evitar recursão de policy —
  ver migration `002`). Policy de `INSERT` força `role='viewer'` (sem escalonamento).
- Leitura de leads usa a **service-role key** server-only (bypassa RLS) encapsulada em
  `lib/services/supabase.ts`, nunca importada em client component.

## Consequências

- ✅ Toda rota de API protegida revalida o usuário no servidor antes de responder.
- ✅ RLS é uma segunda barreira caso a aplicação falhe.
- ✅ Auto-alteração de role bloqueada (`PATCH /api/team/[id]` retorna 400 se `targetId === user.id`).
- ⚠️ A service-role key bypassa RLS: qualquer rota que a use **deve** checar `role` antes
  (garantido por testes de authz).
