'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { readConsent, writeConsent } from '@/lib/analytics';

export function CookieConsent() {
  const t = useTranslations('Consent');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const decided = readConsent();
    if (!decided) {
      const id = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(id);
    }
  }, []);

  const decide = (analytics: boolean) => {
    writeConsent(analytics);
    window.dispatchEvent(new CustomEvent('hsb:consent-changed', { detail: { analytics } }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('ariaLabel')}
      className="fixed bottom-4 left-1/2 z-[60] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-border/15 bg-surface/95 p-4 shadow-2xl backdrop-blur-md sm:p-5"
      style={{
        boxShadow: '0 20px 60px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex-1 text-sm leading-relaxed text-fg/80">
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-fg/40">{t('kicker')}</p>
          <p>
            {t('message')}{' '}
            <Link href="/privacidade" className="underline decoration-accent/40 underline-offset-2 transition hover:text-fg hover:decoration-accent">
              {t('readMore')}
            </Link>
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => decide(false)}
            className="rounded-full border border-border/20 bg-transparent px-4 py-2 text-xs font-medium text-fg/70 transition hover:border-border/40 hover:text-fg"
          >
            {t('refuse')}
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="rounded-full bg-fg px-5 py-2 text-xs font-bold text-bg transition hover:opacity-90"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
