# Architecture Decision Records — HSB Company

Registro das decisões de arquitetura do projeto (site institucional + dashboard).
Formato: [MADR](https://adr.github.io/madr/) enxuto — Status, Contexto, Decisão, Consequências.

Cada ADR documenta uma decisão **já implementada** e verificável no código.
ADRs são imutáveis: para mudar uma decisão, crie um novo ADR que **supersede** o anterior.

## Índice

| # | Título | Status |
|---|--------|--------|
| [0001](0001-csp-nonce-strict-dynamic.md) | CSP via nonce + `strict-dynamic` no middleware | Aceito |
| [0002](0002-leads-pii-admin-only.md) | Lista de leads (PII) restrita a admin | Aceito |
| [0003](0003-role-authz-getuser-rls.md) | Autorização por role com `getUser()` + RLS | Aceito |
| [0004](0004-rate-limit-in-memory.md) | Rate limiting em memória nas rotas públicas | Aceito |
| [0005](0005-i18n-next-intl.md) | Internacionalização com next-intl (`as-needed`) | Aceito |

## Convenção de numeração

Sequencial, zero-padded a 4 dígitos (`0001`, `0002`, …). O número nunca é reutilizado.
