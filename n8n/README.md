# n8n — Workflows do site HSB

Dois workflows separados servem o site:

| Workflow | Webhook | Função |
|---|---|---|
| `HSB-Concierge-Chatbot-PATCHED.json` | `/webhook/hsb-chatbot-site` | Chatbot conversacional (multi-turno, IA, qualificação) |
| `HSB-Lead-Form.json` | `/webhook/hsb-lead-form` | Formulário do `#contato` (single-shot, salva + email) |

Ambos persistem em `leads` (Supabase), criam página no Notion e mandam email pro time.

---

## 1. Chatbot — `HSB-Concierge-Chatbot-PATCHED.json`

Atende o webhook `/webhook/hsb-chatbot-site`, persiste leads no Supabase, qualifica via Mistral, cria registro no Notion e envia email pro time quando o briefing fica completo.

### Importar / atualizar

1. Abre o n8n.
2. **Settings → Import from File** → seleciona `HSB-Concierge-Chatbot-PATCHED.json`.
3. O n8n vai pedir pra mapear as credenciais (Postgres, SMTP). Aponta pras suas existentes.
4. Confere as env vars no workflow: `MISTRAL_API_KEY`, `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `HSB_TEAM_EMAIL`, `HSB_FROM_EMAIL`.
5. Ativa o workflow (toggle no topo).

> ⚠️ **Antes de ativar, rode esta migração** no Supabase pra adicionar a coluna de funil:
>
> ```sql
> ALTER TABLE leads ADD COLUMN IF NOT EXISTS step_funil text;
> ```
>
> A coluna serve pra rastrear em qual etapa do funil cada lead está (espelha o evento `chatbot_step_reached` que vai pro PostHog).

## Provider de IA

**Mistral AI** (`mistral-small-latest`) — hosting na União Europeia (Paris), alinhado com a LGPD que a política do site promete.

- Endpoint: `https://api.mistral.ai/v1/chat/completions` (compatível com formato OpenAI)
- Modelo: `mistral-small-latest` — qualidade comparável a `gpt-4o-mini` em PT-BR, suporta `response_format: { type: "json_object" }`
- Custo aproximado: ~$0.20/M input, ~$0.60/M output (similar a `gpt-4o-mini`)
- Como pegar a key: https://console.mistral.ai → **API Keys** → criar

Para migrar pra outro provider futuramente (DeepSeek, Anthropic, Groq, etc.), edite só o nó `AI - HSB Concierge` no n8n — troque a URL, o header de auth e o nome do modelo no `jsonBody`. O resto do fluxo é provider-agnostic.

## Mudanças desta versão (vs. versão anterior)

| # | Mudança | Por quê |
|---|---|---|
| 1 | `IF - Empty Message?` agora está conectado no fluxo | Antes era nó órfão — mensagens vazias entravam no fluxo |
| 2 | Todas as queries Postgres usam **parameterized queries** (`$1, $2, ...`) | Mata SQL injection que existia com string concat |
| 3 | Novo nó **Derive Step** | Calcula o `step` do funil PostHog (`service_identified` → `contact_data_collecting` → `contact_data_complete`) a partir dos dados coletados |
| 4 | `Webhook Response - Final` agora retorna **JSON dinâmico** | Antes retornava string literal `"texto da resposta da IA"`. Agora retorna `{ reply, step }` real |
| 5 | `Webhook Response - Empty Message` padronizado pra `{ reply, step: null }` | Antes usava `{ response }` — o site espera `reply` |
| 6 | `IF - Briefing Complete?` consolidado numa única condição booleana | A config antiga tinha `value2` faltando, comportamento imprevisível |
| 7 | Persona da IA renomeada de "Aria" pra **"Concierge da HSB"** | Alinha com o título `HSB Concierge` no site |
| 8 | `lead_key` = `sessionId` (UUID persistente do front) | Antes caía em `web_<exec_id>` toda mensagem → cada msg criava lead novo no Supabase. Agora o histórico acumula corretamente. |

## Contrato com o site

**Request** (do site pro n8n):
```http
POST /webhook/hsb-chatbot-site
Content-Type: application/json

{
  "message": "Quero IA pra atendimento",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response** (do n8n pro site):
```json
{
  "replies": [
    "Legal! Automação com IA é justamente o que mais entregamos hoje.",
    "Pra te direcionar melhor, qual o cenário atual — você já tem fluxos rodando ou está começando do zero?"
  ],
  "reply": "Legal! Automação com IA é justamente o que mais entregamos hoje.\n\nPra te direcionar melhor, qual o cenário atual — você já tem fluxos rodando ou está começando do zero?",
  "step": "service_identified"
}
```

- `replies` (array de 1–5 strings): cada item vira uma bolha separada no chat (delay 700–2000ms entre elas no front).
- `reply` (string): retro-compat com clientes legados (concatenação de `replies` com `\n\n`).
- `step` pode ser:
- `service_identified` — IA já entendeu qual serviço o cliente quer
- `contact_data_collecting` — coletando nome/email/telefone
- `contact_data_complete` — finalizou (briefing pronto, vai pro Notion + email)
- `null` — ainda na fase exploratória

## Limpeza / LGPD (rodar como cron mensal no Supabase)

A política de privacidade do site promete `chatbot_messages` retidos por até 90 dias. Pra cumprir, crie um cron no Supabase (Database → Cron Jobs):

```sql
DELETE FROM leads
WHERE status NOT IN ('qualificado', 'enviado_para_equipe')
  AND updated_at < NOW() - INTERVAL '90 days';
```

Leads que viraram qualificados/enviados pro time ficam — esses são dados comerciais legítimos. Conversas que morreram no caminho expiram.

## Debug

- **Resposta vem `null` ou genérica:** confere se o webhook tá ativo e se a env `N8N_WEBHOOK_URL` no Vercel aponta pra URL produção do n8n.
- **Lead duplicado em cada mensagem:** front não está mandando `sessionId` — confere `components/chatbot-widget.tsx`.
- **`step` sempre null:** confere o nó `Derive Step` — ele depende de `dados_coletados.servico` (ou nome/email/phone) vir preenchido pela IA. Se a IA não tá preenchendo, o problema é no system prompt do nó `AI - HSB Concierge`.
- **Erro SQL injection-like:** se algum field tem caractere especial e dá erro, o `queryReplacement` pode estar mal-formatado. Cada `$N` precisa ter um valor correspondente, na mesma ordem.

---

## 2. Formulário do site — `HSB-Lead-Form.json`

Atende o webhook `/webhook/hsb-lead-form`, valida o payload do formulário do `#contato`, faz upsert no Supabase (mesma tabela `leads`), cria página no Notion e envia email pro time. Single-shot — sem IA, sem múltiplas mensagens.

### Importar

1. Abre o n8n.
2. **Settings → Import from File** → seleciona `HSB-Lead-Form.json`.
3. Mapeia credenciais (todas iguais às do chatbot):
   - **Postgres** no nó `DB - Upsert Lead` → mesma credencial Supabase
   - **HTTP Header Auth** no nó `Notion - Create Page` → mesma credencial com header `Authorization: Bearer <NOTION_API_KEY>`
   - **SMTP** no nó `Email - Notify Team` → mesma credencial SMTP
4. No nó `Notion - Create Page`, substitua `REPLACE_WITH_NOTION_DATABASE_ID` pelo ID do database `HSB - Leads` (já está em `NOTION_DATABASE_ID` do chatbot — em n8n Cloud sem `$env`, hardcode aqui também).
5. Ativa o workflow (toggle no topo).
6. **Copia a Production URL do webhook** (botão `Production URL` no nó `Webhook - Lead Form`) e cola em `N8N_LEAD_WEBHOOK_URL` no Vercel (Preview + Production).

### Contrato

**Request** (do `/api/lead` do site pro n8n):
```http
POST /webhook/hsb-lead-form
Content-Type: application/json

{
  "source": "form",
  "name": "Maria Silva",
  "email": "maria@empresa.com",
  "phone": "+55 11 91234-5678",
  "message": "Quero refazer o site institucional, prazo 30 dias.",
  "locale": "pt-BR",
  "timestamp": "2026-05-23T15:30:00.000Z"
}
```

**Response** (sucesso):
```json
{ "ok": true, "lead_key": "form_abc123..." }
```

**Response** (payload inválido):
```json
{ "ok": false, "error": "invalid_payload" }
```

### Notas

- **`lead_key` estável por email:** `form_` + `sha256(email).slice(0, 24)`. Mesmo email reenviando = mesmo lead, com `briefing_completo` concatenado (separador `\n\n---\n\n`) e `updated_at` atualizado.
- **Sem retry interno:** se o Notion ou SMTP falharem, o lead já está no Supabase (upsert acontece antes) — não perde dado. Adicione um nó de error trigger se quiser alertas.
- **`source='form'` no Supabase** diferencia dos leads vindos do chatbot (`source='site'`).
