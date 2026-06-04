# 0002 — Lista de leads (PII) restrita a admin

- **Status:** Aceito
- **Data:** 2026-06-04

## Contexto

O dashboard tem dois papéis: `admin` e `viewer`. A lista de leads contém PII (e-mail, telefone).
Pela LGPD (princípio da minimização), acesso a dados pessoais deve se limitar a quem precisa.
`viewer` precisa acompanhar desempenho, mas não necessariamente acessar contatos individuais.

## Decisão

`viewer` acessa **apenas métricas agregadas** (`/api/metrics`); a **lista completa de leads** com
PII é restrita a `admin`, aplicado em três camadas:

1. **API (fronteira real):** `GET /api/leads` retorna `403` se `role !== 'admin'`.
2. **Rota:** `app/(protected)/leads/layout.tsx` chama `requireAdmin()` (redireciona viewer).
3. **UX:** item "Leads" escondido do menu para viewer.

## Consequências

- ✅ Minimização de dados conforme LGPD; PII só para quem tem necessidade.
- ✅ Métricas agregadas (contagens, top serviços) seguem disponíveis a todos os autenticados —
  não expõem PII individual.
- ✅ Coberto por testes (`viewer → 403` em `GET /api/leads`).
- 🔁 Caso o negócio precise que viewer veja contatos, criar novo ADR (ex.: PII mascarada).
