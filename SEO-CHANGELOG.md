# SEO Changelog — HSB Company

Otimização de SEO técnico + AEO executada em 2026-07-14, sem alteração de
paleta, layout, animações ou copy de posicionamento. Site é Next.js 14
(App Router) com SSG — todas as páginas públicas são HTML estático pré-
renderizado nos 6 idiomas, legível por Googlebot e crawlers de IA sem JS.

## Alterações por arquivo

### Fase 1 — SEO técnico
| Arquivo | Mudança |
|---|---|
| `messages/*.json` (6 idiomas) | `Meta.title` reduzido pra ≤60 chars (palavra-chave comercial + marca) e `Meta.description` ≤155 chars |
| `app/[locale]/privacidade/page.tsx` | **Bug corrigido:** a página herdava o canonical do layout (apontava pra home). Agora tem canonical + hreflang próprios por idioma e description truncada em 155 chars |
| `app/sitemap.ts` | `/privacidade` incluída (12 URLs = 2 páginas × 6 idiomas, com hreflang e lastmod) |

### Fase 2 — Schema markup (JSON-LD)
| Arquivo | Mudança |
|---|---|
| `app/robots.ts` | Regras explícitas pra Googlebot, Bingbot e crawlers de IA: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Google-Extended. Bloqueadas apenas `/api/` e `/ingest/` |
| `app/[locale]/page.tsx` | JSON-LD virou `@graph` único **localizado por idioma**: `LocalBusiness` (subtipo de Organization — description localizada, contactPoint email, endereço São Paulo) + `WebSite` (inLanguage) + **8 × `Service`** gerados dos serviços reais das messages + `FAQPage`. Escape de `<` (`<`) contra quebra de parse |

### Fase 3 — Conteúdo extraível (AEO)
| Arquivo | Mudança |
|---|---|
| `components/faq.tsx` | **Nova seção FAQ** na home (`#faq`, entre Processo e Contato), no padrão visual das seções existentes. `<details>/<summary>` nativos: respostas sempre presentes no DOM (extraíveis por buscadores e IAs), zero JavaScript |
| `messages/*.json` | Namespace `Faq` com 6 perguntas de intenção comercial nos 6 idiomas — respostas de 40–60 palavras com resposta direta na primeira frase, sem estatísticas inventadas |
| `app/[locale]/page.tsx` | Schema `FAQPage` espelhando 1:1 a seção visível (exigência do Google) |

### Fase 4 — Performance
| Arquivo | Mudança |
|---|---|
| `components/dotted-surface-lazy.tsx` | three.js (fundo 3D decorativo) saiu do carregamento inicial: `dynamic(..., { ssr: false })`. **Antes:** 2 chunks (~550 KB raw) referenciados no HTML inicial. **Depois:** carregam sob demanda após o conteúdo crítico. LCP não depende deles (hero é texto) |
| `components/services-carousel.tsx` | Botão "Solicitar proposta" no detalhe do carrossel não tinha ação — virou âncora pra `#contato` (fix de conversão) |
| — | Fontes já eram self-hosted via `next/font` com `display: swap` e preload automático. First Load JS da home: 228 kB (React 87 kB + página) |

### Já existia (auditoria anterior, mesmo dia)
- Open Graph + Twitter Cards localizados, og:image 1200×630 gerada por idioma (`opengraph-image.tsx`)
- `<html lang>` por idioma; HTML semântico (main/header/footer/nav/section + aria-labels); h1 único por página
- Site 100% SSG (tema via script inline, sem `cookies()` no layout)

## Validação executada
- `next lint` limpo e `next build` sem erros (19 páginas estáticas)
- JSON-LD parseado e validado: `[LocalBusiness, WebSite, Service ×8, FAQPage]` — sem campos inventados
- Canonical de `/privacidade` verificado em runtime por idioma
- FAQ presente no HTML estático (6 `<details>` + conteúdo no `@graph`)
- three.js ausente do HTML inicial (verificado antes/depois com build comparativo)

## ✅ Checklist — o que VOCÊ precisa fazer manualmente

1. **Google Search Console**: verificar a propriedade `hsb.company`, enviar
   `https://hsb.company/sitemap.xml` e pedir indexação da home.
2. **Google Business Profile**: criar/reivindicar o perfil da HSB Company
   (São Paulo) — impacta buscas locais "agência de marketing são paulo".
3. **Redes sociais**: os ícones do footer apontam pra `#` e o `sameAs` do
   JSON-LD está vazio. Me passe as URLs reais (Instagram/LinkedIn/YouTube)
   pra eu preencher os dois.
4. **WhatsApp**: o site hoje só expõe email. Se quiser o WhatsApp no
   `contactPoint` do schema (e no site), me passe o número comercial.
5. **og:image definitiva**: a atual é gerada por código (fundo escuro +
   marca). Se quiser uma arte de brand própria, substitua em
   `app/[locale]/opengraph-image.tsx`.
6. **Dados reais de cases**: quando tiver números aprovados (ROAS médio,
   projetos entregues, prazos típicos), me avise — dá pra enriquecer o FAQ
   e a seção Sobre sem inventar nada.
7. **Bing Webmaster Tools** (opcional): importa a propriedade do GSC em
   1 clique — Bing alimenta o ChatGPT search.
