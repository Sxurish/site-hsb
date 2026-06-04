# 0004 — Rate limiting em memória nas rotas públicas

- **Status:** Aceito
- **Data:** 2026-06-04

## Contexto

As rotas públicas do site (`/api/lead`, `/api/chat`) recebem input anônimo e disparam webhooks
(n8n) — precisam de proteção contra abuso/flood. Uma solução com Redis/Upstash seria robusta, mas
adiciona infraestrutura e custo desproporcionais ao volume atual.

## Decisão

Rate limiting **em memória** (Map por IP, janela deslizante): 5 req/min em `/api/lead`,
10 req/min em `/api/chat`. IP obtido de `x-real-ip` (definido pelo proxy/CDN, não forjável pelo
cliente), com fallback no último valor de `x-forwarded-for`.

## Consequências

- ✅ Zero dependência externa; suficiente para single-instance e volume baixo.
- ⚠️ Estado não é compartilhado entre instâncias serverless e zera em cold start —
  o limite é por instância, não global.
- 🔁 Para escala multi-region, migrar para Upstash/Redis (já previsto em comentário no código).
  Trocar exige novo ADR apenas se mudar a política; a troca de backend é detalhe de implementação.
