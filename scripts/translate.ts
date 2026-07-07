/* eslint-disable no-console */
/**
 * Translation generator — uses DeepL API to translate messages/pt-BR.json
 * to any DeepL-supported locale and writes messages/<locale>.json.
 *
 * Usage:
 *   npm run translate            -> translate ALL supported locales
 *   npm run translate -- ja      -> translate only ja
 *   npm run translate -- ja ko ru
 *
 * Setup:
 *   1. Create a free DeepL account: https://www.deepl.com/pro-api
 *   2. Add DEEPL_API_KEY=... to .env.local
 *   3. (Optional) Set DEEPL_PRO=true for the paid endpoint
 *
 * Notes:
 *   - Skips locales whose JSON already exists unless --force is passed.
 *   - Preserves placeholders like {year}, {brand}, {title} via DeepL "ignore_tags".
 *   - Batches strings to minimize API calls.
 */

import fs from 'node:fs';
import path from 'node:path';

type DeepLLang =
  | 'ar' | 'bg' | 'cs' | 'da' | 'de' | 'el' | 'en-US' | 'en-GB' | 'es' | 'et'
  | 'fi' | 'fr' | 'he' | 'hu' | 'id' | 'it' | 'ja' | 'ko' | 'lt' | 'lv'
  | 'nb' | 'nl' | 'pl' | 'pt-BR' | 'pt-PT' | 'ro' | 'ru' | 'sk' | 'sl' | 'sv'
  | 'tr' | 'uk' | 'zh' | 'zh-HANS';

// All DeepL target languages we currently expose on the site.
// Edit this list to add/remove auto-translated locales.
const TARGETS: { locale: string; deepl: DeepLLang; label: string }[] = [
  { locale: 'en',    deepl: 'en-US',   label: 'English' },
  { locale: 'es',    deepl: 'es',      label: 'Español' },
  { locale: 'fr',    deepl: 'fr',      label: 'Français' },
  { locale: 'de',    deepl: 'de',      label: 'Deutsch' },
  { locale: 'zh-CN', deepl: 'zh-HANS', label: '中文 (简体)' },
  { locale: 'it',    deepl: 'it',      label: 'Italiano' },
  { locale: 'ja',    deepl: 'ja',      label: '日本語' },
  { locale: 'ko',    deepl: 'ko',      label: '한국어' },
  { locale: 'ar',    deepl: 'ar',      label: 'العربية' },
  { locale: 'ru',    deepl: 'ru',      label: 'Русский' },
  { locale: 'nl',    deepl: 'nl',      label: 'Nederlands' },
  { locale: 'pl',    deepl: 'pl',      label: 'Polski' },
  { locale: 'sv',    deepl: 'sv',      label: 'Svenska' },
  { locale: 'tr',    deepl: 'tr',      label: 'Türkçe' },
  { locale: 'uk',    deepl: 'uk',      label: 'Українська' },
  { locale: 'cs',    deepl: 'cs',      label: 'Čeština' },
  { locale: 'da',    deepl: 'da',      label: 'Dansk' },
  { locale: 'fi',    deepl: 'fi',      label: 'Suomi' },
  { locale: 'el',    deepl: 'el',      label: 'Ελληνικά' },
  { locale: 'he',    deepl: 'he',      label: 'עברית' },
  { locale: 'hu',    deepl: 'hu',      label: 'Magyar' },
  { locale: 'id',    deepl: 'id',      label: 'Bahasa Indonesia' },
  { locale: 'no',    deepl: 'nb',      label: 'Norsk' },
  { locale: 'pt-PT', deepl: 'pt-PT',   label: 'Português (PT)' },
  { locale: 'ro',    deepl: 'ro',      label: 'Română' },
];

const ROOT = path.resolve(__dirname, '..');
const SRC_FILE = path.join(ROOT, 'messages', 'pt-BR.json');
const OUT_DIR  = path.join(ROOT, 'messages');

/* ── Load .env.local manually (avoid extra deps) ───────
   Precisa rodar ANTES de ler DEEPL_API_KEY/DEEPL_PRO, senão as chaves
   definidas só no .env.local nunca são vistas. */
try {
  const envPath = path.join(ROOT, '.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#'))
      .forEach((l) => {
        const [k, ...rest] = l.split('=');
        if (k && rest.length && !process.env[k.trim()]) {
          process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
        }
      });
  }
} catch { /* ignore */ }

const API_KEY = process.env.DEEPL_API_KEY;
const API_URL = process.env.DEEPL_PRO === 'true'
  ? 'https://api.deepl.com/v2/translate'
  : 'https://api-free.deepl.com/v2/translate';

if (!API_KEY) {
  console.error('❌ DEEPL_API_KEY missing. Add it to .env.local (see .env.example).');
  process.exit(1);
}

/* ── CLI args ───────────────────────────────────────── */
const args = process.argv.slice(2);
const force = args.includes('--force');
const requestedLocales = args.filter((a) => !a.startsWith('--'));
const targetsToRun = requestedLocales.length
  ? TARGETS.filter((t) => requestedLocales.includes(t.locale))
  : TARGETS;

if (requestedLocales.length && !targetsToRun.length) {
  console.error(`❌ No matching targets for: ${requestedLocales.join(', ')}`);
  console.error(`   Available: ${TARGETS.map((t) => t.locale).join(', ')}`);
  process.exit(1);
}

/* ── Walk JSON: collect leaf strings + paths ─────────── */
type Leaf = { path: (string | number)[]; value: string };
function collectLeaves(obj: unknown, p: (string | number)[] = []): Leaf[] {
  if (typeof obj === 'string') return [{ path: p, value: obj }];
  if (Array.isArray(obj)) return obj.flatMap((v, i) => collectLeaves(v, [...p, i]));
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) => collectLeaves(v, [...p, k]));
  }
  return [];
}

function setByPath(target: any, p: (string | number)[], value: string) {
  let cursor = target;
  for (let i = 0; i < p.length - 1; i++) {
    const key = p[i];
    if (cursor[key] === undefined) {
      cursor[key] = typeof p[i + 1] === 'number' ? [] : {};
    }
    cursor = cursor[key];
  }
  cursor[p[p.length - 1]] = value;
}

/* ── DeepL: protect ICU placeholders {var} with XML tags ─ */
const TOKEN_OPEN  = '<x>';
const TOKEN_CLOSE = '</x>';

function protectPlaceholders(s: string): string {
  return s.replace(/\{([^}]+)\}/g, `${TOKEN_OPEN}{$1}${TOKEN_CLOSE}`);
}
function unprotectPlaceholders(s: string): string {
  return s.replace(new RegExp(`${TOKEN_OPEN}\\{([^}]+)\\}${TOKEN_CLOSE}`, 'g'), '{$1}');
}

/* ── Translate in batches (DeepL accepts ~50 texts/req) ─ */
async function translateBatch(texts: string[], targetLang: DeepLLang): Promise<string[]> {
  const body = new URLSearchParams();
  body.set('target_lang', targetLang);
  body.set('source_lang', 'PT');
  body.set('tag_handling', 'xml');
  body.set('ignore_tags', 'x');
  body.set('preserve_formatting', '1');
  texts.forEach((t) => body.append('text', protectPlaceholders(t)));

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DeepL ${res.status}: ${t}`);
  }

  const data = (await res.json()) as { translations: { text: string }[] };
  return data.translations.map((t) => unprotectPlaceholders(t.text));
}

async function chunked<T>(arr: T[], size: number): Promise<T[][]> {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* ── Run ────────────────────────────────────────────── */
async function main() {
  const srcRaw = fs.readFileSync(SRC_FILE, 'utf8');
  const src = JSON.parse(srcRaw);
  const leaves = collectLeaves(src);
  console.log(`📄 Source pt-BR.json — ${leaves.length} string leaves`);
  console.log(`🌐 Targets: ${targetsToRun.map((t) => t.locale).join(', ')}\n`);

  for (const target of targetsToRun) {
    const outFile = path.join(OUT_DIR, `${target.locale}.json`);
    if (fs.existsSync(outFile) && !force) {
      console.log(`⏭️  ${target.locale.padEnd(7)} — exists (use --force to overwrite)`);
      continue;
    }

    process.stdout.write(`🔄 ${target.locale.padEnd(7)} → ${target.label} ... `);

    try {
      const batches = await chunked(leaves.map((l) => l.value), 40);
      const translated: string[] = [];
      for (const batch of batches) {
        const out = await translateBatch(batch, target.deepl);
        translated.push(...out);
      }

      const result: any = Array.isArray(src) ? [] : {};
      leaves.forEach((leaf, i) => setByPath(result, leaf.path, translated[i]));

      fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n', 'utf8');
      console.log(`✅`);
    } catch (err) {
      console.log(`❌`);
      console.error(`   ${(err as Error).message}\n`);
    }
  }

  console.log('\n🎉 Done. Review the generated files and adjust routing.ts to enable the new locales.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
