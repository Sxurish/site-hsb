# HSB Dashboard

Painel administrativo da **HSB Company**. Subprojeto isolado do site principal, com autenticação via Supabase e métricas de tráfego/funil via PostHog.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) — auth + leads + RLS
- **PostHog** — tráfego, sessões e funil (via API)
- **Recharts** — gráficos
- **lucide-react** — ícones

## Estrutura

```
app/
  (protected)/     Rotas protegidas por auth
  api/             Route handlers
  auth/            Callbacks e fluxo de auth
  login/           Tela de login
  reset-password/  Reset de senha
components/        UI (layout, sidebar, etc.)
db/migrations/     Migrations SQL do Supabase
hooks/             React hooks
lib/               Utilitários (Supabase clients, helpers)
middleware.ts      Middleware de proteção de rotas
```

## Pré-requisitos

- Node.js 18+
- npm
- Projeto Supabase configurado
- Conta PostHog com Personal API Key

## Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública do dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server-only — **nunca** expor) |
| `POSTHOG_API_KEY` | Personal API Key (`phx_...`) com scopes `query:read` + `project:read` |
| `POSTHOG_PROJECT_ID` | ID numérico do projeto PostHog |
| `POSTHOG_API_HOST` | Host da API (default `https://eu.posthog.com`) |

## Banco de dados

Migrations SQL ficam em `db/migrations/` e devem ser aplicadas no Supabase em ordem:

1. `001_dashboard_users.sql` — tabela de usuários do dashboard
2. `002_fix_dashboard_users_rls.sql` — ajuste de policies RLS
3. `003_dashboard_users_self_update.sql` — self-update de perfil (nome) sem permitir troca do próprio role
4. `004_harden_functions.sql` — revoga EXECUTE do `anon` nas funções SECURITY DEFINER e pina `search_path` das funções de trigger (advisors do Supabase)

Aplique via SQL Editor do Supabase ou pelo CLI (`supabase db push`).

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3001` (porta separada do site principal em `:3000`).

## Build de produção

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` — desenvolvimento na porta 3001
- `npm run build` — build de produção
- `npm start` — sobe o build na porta 3001
- `npm run lint` — lint do projeto

## Autenticação & segurança

- Auth via Supabase (e-mail/senha + reset de senha)
- Rotas protegidas via `middleware.ts` e grupo `(protected)/`
- RLS habilitada nas tabelas — verifique policies antes de criar novas
- `SUPABASE_SERVICE_ROLE_KEY` só pode ser usada em route handlers/server actions, **nunca** em código client

## Deploy

Deploy independente do site principal. Configurar as variáveis de ambiente no provedor (Vercel recomendado) e apontar para a pasta `dashboard/` como root.
