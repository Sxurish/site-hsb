'use client';

import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { BrandLogo } from './brand-logo';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';

const navKeys = [
  { href: '#sobre',     key: 'about' },
  { href: '#servicos',  key: 'services' },
  { href: '#processo',  key: 'process' },
  { href: '#faq',       key: 'faq' },
  { href: '#contato',   key: 'contact' },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const t = useTranslations('Header');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-border/[0.10] bg-bg/85 backdrop-blur-md'
          : 'border-transparent bg-bg/40 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 md:px-8 md:py-4">
        <a href="#top" aria-label={t('logoAriaLabel')} className="shrink-0">
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label={t('navAriaPrimary')}>
          {navKeys.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm text-fg/55 transition hover:text-fg"
            >
              {t(`nav.${item.key}`)}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <motion.a
            whileHover={reduce ? undefined : { y: -1 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            href="#contato"
            className="group inline-flex items-center gap-1.5 rounded-full bg-fg px-5 py-2 text-sm font-bold text-bg transition-shadow hover:shadow-glow-sm"
          >
            {t('ctaQuote')}
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            className="rounded-lg border border-border/[0.12] p-2 text-fg/65 transition hover:text-fg"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((p) => !p)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease }}
            className="overflow-hidden border-t border-border/[0.08] bg-bg/95 backdrop-blur md:hidden"
            aria-label={t('navAriaMobile')}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navKeys.map((item, i) => (
                <motion.a
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease }}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base text-fg/75 transition hover:bg-fg/[0.05] hover:text-fg"
                >
                  {t(`nav.${item.key}`)}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3, ease }}
                href="#contato"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-fg px-4 py-3 text-sm font-bold text-bg"
              >
                {t('ctaQuote')}
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
