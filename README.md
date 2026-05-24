# HSB Company — Site Institucional

Site oficial da **HSB Company**, agência de marketing sediada em São Paulo, Brasil. Foco em branding, tráfego, IA aplicada e funis de conversão.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + Framer Motion
- **next-intl** — 6 idiomas (pt-BR, en, es, fr, de, zh-CN)
- **Three.js** — elementos 3D
- **lucide-react** / **react-icons**
- **PostHog** — analytics e produto
- **n8n** — workflows de lead form e chatbot concierge
- **Vercel** — hospedagem e deploy

## Estrutura

```
app/            Rotas Next (App Router) com [locale]
components/    Componentes da UI
i18n/          Config do next-intl
messages/      Traduções (pt-BR, en, es, fr, de, zh-CN)
lib/           Utilitários
n8n/           Workflows exportados (Lead Form, Concierge Chatbot)
scripts/       Scripts auxiliares (ex.: translate.ts)
dashboard/     Subprojeto do painel administrativo
public/        Assets estáticos
```

## Pré-requisitos

- Node.js 18+
- npm
- Conta na Vercel (deploy)
- Instância n8n (automações)

## Variáveis de ambiente

Copie o exemplo e preencha as chaves:

```bash
cp .env.example .env.local
```

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm start` — sobe o build
- `npm run lint` — lint do projeto
- `npm run translate` — gera/atualiza traduções (`scripts/translate.ts`)

## Deploy

Deploy automatizado via Vercel (pasta `.vercel/` já vinculada ao projeto). Push na branch principal dispara o build.

## Automações (n8n)

Workflows disponíveis em `n8n/`:

- `HSB-Lead-Form.json` — captura e roteamento de leads
- `HSB-Concierge-Chatbot-PATCHED.json` — chatbot concierge integrado ao site

Importe os JSONs na sua instância n8n e configure as credenciais necessárias.

## Dashboard

O painel administrativo da HSB fica em `dashboard/` como subprojeto isolado, com suas próprias dependências, migrations (Supabase) e variáveis de ambiente. Consulte `dashboard/README.md` quando aplicável.

## Contato

HSB Company — São Paulo, Brasil
contato@hsbcompany.com.br
