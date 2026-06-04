# 0001 — CSP via nonce + `strict-dynamic` no middleware

- **Status:** Aceito
- **Data:** 2026-06-04

## Contexto

Precisamos de uma Content-Security-Policy forte contra XSS. CSP com `script-src 'unsafe-inline'`
é fraca (permite qualquer script inline). A alternativa robusta (CSP3) é um **nonce por request**
+ `'strict-dynamic'`, que exige gerar o nonce em tempo de request — incompatível com header
estático no `next.config`. O nonce precisa chegar aos scripts inline do Next.js.

## Decisão

Definir a CSP **por request no middleware**, gerando um nonce aleatório (Web Crypto) e propagando-o
via `request.headers` (`x-nonce` + `Content-Security-Policy`). O Next.js lê o nonce do header de
request e o injeta automaticamente nos scripts.

- **Dashboard:** middleware próprio já faz isso.
- **Site:** o middleware seta os headers antes de chamar o `next-intl`, que clona `request.headers`
  (`new Headers(request.headers)`) ao montar a resposta, repassando o nonce.
- Os demais headers de segurança (HSTS, COOP/COEP/CORP, X-Content-Type-Options, etc.) seguem
  estáticos no `next.config.mjs`.

## Consequências

- ✅ Elimina `'unsafe-inline'` em `script-src`; scripts injetados passam a depender de nonce.
- ✅ `style-src 'unsafe-inline'` permanece (Tailwind/styled-jsx) — risco baixo.
- ⚠️ Páginas servidas com nonce são renderizadas dinamicamente por request; verificado que o site
  continua funcional (scripts executáveis com nonce batendo com o header; apenas `application/ld+json`
  não-executável fica sem nonce, o que é correto).
- 🔁 Arquivos: `middleware.ts`, `next.config.mjs` (site); `dashboard/middleware.ts`.
