'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export function MidCta() {
  const t = useTranslations('MidCta');
  const reduce = useReducedMotion();

  return (
    <section
      aria-label={t('regionAria')}
      className="relative overflow-hidden border-y border-border/[0.08] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.10] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
        className="relative mx-auto w-full max-w-4xl px-4 text-center md:px-8"
      >
        <p className="section-kicker mb-5">{t('kicker')}</p>
        <h2 className="mb-5 text-3xl font-black leading-tight tracking-tight md:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto mb-9 max-w-2xl leading-relaxed text-fg/55 md:text-lg">
          {t('lede')}
        </p>

        <motion.a
          whileHover={reduce ? undefined : { y: -2 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          href="#contato"
          className="group inline-flex items-center gap-2 rounded-full bg-fg px-7 py-3.5 text-sm font-bold text-bg transition-shadow hover:shadow-glow-sm"
        >
          {t('cta')}
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </motion.a>

        <p className="mt-5 text-xs uppercase tracking-[0.25em] text-fg/30">
          {t('subnote')}
        </p>
      </motion.div>
    </section>
  );
}
