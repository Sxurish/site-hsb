'use client';

import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { routing, type Locale } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, { native: string; flag: string }> = {
  'pt-BR':  { native: 'Português', flag: '🇧🇷' },
  en:       { native: 'English',   flag: '🇺🇸' },
  es:       { native: 'Español',   flag: '🇪🇸' },
  fr:       { native: 'Français',  flag: '🇫🇷' },
  de:       { native: 'Deutsch',   flag: '🇩🇪' },
  'zh-CN':  { native: '中文',       flag: '🇨🇳' },
};

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function change(next: Locale) {
    if (next === current) {
      setOpen(false);
      return;
    }
    // strip current locale from pathname (if it's prefixed)
    let path = pathname || '/';
    for (const l of routing.locales) {
      if (path === `/${l}` || path.startsWith(`/${l}/`)) {
        path = path.replace(`/${l}`, '') || '/';
        break;
      }
    }
    const target = next === routing.defaultLocale ? path : `/${next}${path === '/' ? '' : path}`;
    router.push(target);
    router.refresh();
    setOpen(false);
  }

  const currentLabel = LOCALE_LABELS[current] ?? LOCALE_LABELS[routing.defaultLocale];

  return (
    <div ref={wrap} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('ariaLabel')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 items-center gap-1.5 rounded-full border border-border/[0.12] px-2.5 text-xs text-fg/55 transition hover:border-border/25 hover:text-fg"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{currentLabel.flag}</span>
        <span className="text-[10px] uppercase tracking-wide">{current.split('-')[0]}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-border/[0.12] bg-bg/95 py-1 shadow-xl backdrop-blur"
        >
          {routing.locales.map((l) => {
            const info = LOCALE_LABELS[l] ?? { native: l, flag: '' };
            const active = l === current;
            return (
              <li key={l}>
                <button
                  role="option"
                  aria-selected={active}
                  onClick={() => change(l)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                    active ? 'bg-fg/[0.06] text-fg' : 'text-fg/70 hover:bg-fg/[0.04] hover:text-fg'
                  }`}
                >
                  <span className="text-base leading-none">{info.flag}</span>
                  <span className="flex-1">{info.native}</span>
                  {active && <span className="text-accent">●</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
