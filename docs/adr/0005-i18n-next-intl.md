# 0005 — Internacionalização com next-intl (`as-needed`)

- **Status:** Aceito
- **Data:** 2026-06-04

## Contexto

O site institucional precisa atender múltiplos idiomas (pt-BR, en, es e outros) com boa UX e SEO,
mantendo a URL do idioma padrão limpa.

## Decisão

Usar **next-intl** com roteamento por segmento de locale (`app/[locale]/...`) e estratégia de prefixo
`as-needed`: o locale padrão (pt-BR) é servido **sem prefixo** (`/`), os demais com prefixo
(`/en`, `/es`). Mensagens em `messages/<locale>.json`; tradução assistida via `npm run translate`
(DeepL) a partir do `pt-BR`.

## Consequências

- ✅ URL limpa para o público principal (pt-BR em `/`) e SEO por idioma com `alternateLinks`.
- ✅ O middleware do next-intl também serve de ponto único para propagar o nonce da CSP (ver
  [ADR-0001](0001-csp-nonce-strict-dynamic.md)).
- ⚠️ Acesso direto a `/pt-BR` redireciona (307) para `/` — comportamento esperado do `as-needed`.
- 🔁 Páginas de locale são prerenderizadas (SSG) mas servidas com nonce dinâmico por request.
