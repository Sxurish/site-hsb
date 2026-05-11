'use client';

/**
 * LanguageBanner — graceful fallback for "any language" coverage.
 *
 * When a visitor lands on the site, this banner:
 *  1. Reads navigator.language and primary Accept-Language preference
 *  2. Maps it to the closest CURATED locale we ship (one of the 6)
 *  3. If the resolved locale is different from the current URL locale,
 *     shows a discreet, dismissible suggestion to switch.
 *
 * For locales we have not yet generated translations for (e.g. ja, ko, ru),
 * the user is steered to English as the most universal fallback.
 *
 * When the team runs `npm run translate <locale>` and registers the new
 * locale in i18n/routing.ts, the banner will automatically start
 * suggesting that locale instead of falling back to English.
 */

import { X } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const DISMISS_KEY = 'hsb_lang_banner_dismissed_v1';

/* Map any BCP-47 prefix to the closest curated locale we ship. */
const CLOSEST_MATCH: Record<string, string> = {
  pt:    'pt-BR',
  en:    'en',
  es:    'es',
  fr:    'fr',
  de:    'de',
  zh:    'zh-CN',
  // Languages we don't ship yet → steer toward the most universal one
  // available. English is the safest default for the long tail.
  it: 'en', ja: 'en', ko: 'en', ar: 'en', ru: 'en', nl: 'en', pl: 'en',
  sv: 'en', tr: 'en', uk: 'en', cs: 'en', da: 'en', fi: 'en', el: 'en',
  he: 'en', hu: 'en', id: 'en', no: 'en', nb: 'en', ro: 'en', sk: 'en',
  sl: 'en', lt: 'en', lv: 'en', et: 'en', bg: 'en', hr: 'en', sr: 'en',
  // Latin-script European with closer Romance sibling → keep generic en
  // (could be refined: it→es/fr, ro→fr, etc., once those are curated).
};

const LOCALE_NATIVE: Record<string, string> = {
  'pt-BR': 'Português',
  en:      'English',
  es:      'Español',
  fr:      'Français',
  de:      'Deutsch',
  'zh-CN': '中文',
};

function resolveSuggestion(navLang: string | undefined, currentLocale: string): Locale | null {
  if (!navLang) return null;

  // Try full match first (e.g. "zh-CN" exact)
  const fullLower = navLang.toLowerCase();
  for (const l of routing.locales) {
    if (l.toLowerCase() === fullLower) {
      return l === currentLocale ? null : l;
    }
  }

  // Then prefix match (e.g. "fr-CA" → "fr")
  const prefix = fullLower.split('-')[0];
  const mapped = CLOSEST_MATCH[prefix];
  if (!mapped) return null;
  if (mapped === currentLocale) return null;
  // Only suggest locales we actually serve
  if (!routing.locales.includes(mapped as Locale)) return null;
  return mapped as Locale;
}

export function LanguageBanner() {
  const t = useTranslations('LanguageBanner');
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<Locale | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
    } catch { /* ignore */ }

    const navLang =
      typeof navigator !== 'undefined'
        ? navigator.languages?.[0] ?? navigator.language
        : undefined;

    const target = resolveSuggestion(navLang, current);
    if (target) setSuggested(target);
  }, [current]);

  function accept() {
    if (!suggested) return;
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    const target = suggested;
    setSuggested(null);
    startTransition(() => {
      router.replace(pathname, { locale: target });
    });
  }

  function dismiss() {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setSuggested(null);
  }

  if (!suggested) return null;

  const nativeLabel = LOCALE_NATIVE[suggested] ?? suggested;

  return (
    <div
      role="region"
      aria-label={t('aria')}
      className="fixed left-1/2 top-[88px] z-[60] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-border/[0.14] bg-bg/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-5 sm:py-3.5"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm text-fg/80">
          <p className="leading-snug">
            {t('message', { language: nativeLabel })}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              onClick={accept}
              className="rounded-full bg-fg px-3 py-1.5 text-xs font-bold text-bg transition hover:opacity-90"
            >
              {t('accept', { language: nativeLabel })}
            </button>
            <button
              onClick={dismiss}
              className="text-xs text-fg/45 transition hover:text-fg/75"
            >
              {t('keep')}
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label={t('close')}
          className="rounded-full p-1 text-fg/45 transition hover:bg-fg/[0.06] hover:text-fg"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
