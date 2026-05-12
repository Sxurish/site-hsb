'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations('Hero');

  const metrics = [
    { value: '150+',  label: t('metrics.sitesLabel') },
    { value: '+312%', label: t('metrics.leadsLabel') },
    { value: '6.4×',  label: t('metrics.roasLabel') },
    { value: '70+',   label: t('metrics.clientsLabel') },
  ];

  const lines = [
    { text: t('line1'), style: '' },
    { text: t('line2'), style: 'gold-sheen' },
    { text: t('line3'), style: '' },
  ];

  const lineInitial: { y: number | string; opacity?: number } = reduce
    ? { y: 0, opacity: 1 }
    : { y: '110%' };
  const lineAnimate = { y: 0, opacity: 1 };

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16">
      {/* Glow ambiente */}
      <div className="pointer-events-none absolute -top-40 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-accent opacity-[0.06] blur-[140px] dark:opacity-[0.18]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-accent-soft opacity-[0.04] blur-[120px] dark:opacity-[0.10]" />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="section-kicker mb-8 md:mb-10"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent shadow-glow-sm" />
          {t('kicker')}
        </motion.p>

        <h1 className="sr-only">{t('srTitle')}</h1>

        <div aria-hidden="true">
          {lines.map((line, i) => (
            <div key={line.text} className="overflow-hidden text-[clamp(2.6rem,9.8vw,9rem)] pb-[0.22em] -mb-[0.18em]">
              <motion.span
                initial={lineInitial}
                animate={lineAnimate}
                transition={{ duration: 0.85, delay: 0.1 + i * 0.12, ease }}
                className={`block text-[clamp(2.6rem,9.8vw,9rem)] font-black leading-[0.92] tracking-tight ${line.style}`}
              >
                {line.text}
              </motion.span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5"
        >
          <motion.a
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            href="#contato"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-fg px-6 py-3.5 text-sm font-bold text-bg shadow-glow-sm transition-shadow hover:shadow-glow sm:px-7"
          >
            <span className="relative z-10">{t('ctaPrimary')}</span>
            <ArrowUpRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </motion.a>

          <a
            href="#portfolio"
            className="group inline-flex items-center gap-1.5 text-sm text-fg/55 transition hover:text-fg"
          >
            <span className="border-b border-fg/20 transition group-hover:border-accent">
              {t('ctaSecondary')}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      {/* Faixa de métricas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7, ease }}
        className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8"
      >
        <div className="grid grid-cols-2 gap-6 border-t border-border/[0.1] pt-8 sm:gap-8 md:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 + i * 0.07, ease }}
              className="group"
            >
              <p className="text-3xl font-black tabular-nums transition-colors group-hover:text-accent sm:text-4xl md:text-5xl">
                {m.value}
              </p>
              <p className="mt-1.5 text-xs text-fg/40 sm:text-sm">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
