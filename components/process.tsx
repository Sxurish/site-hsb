'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ease = [0.16, 1, 0.3, 1] as const;

export function Process() {
  const t = useTranslations('Process');

  const steps = [1, 2, 3, 4, 5].map((n) => ({
    step: String(n).padStart(2, '0'),
    title: t(`steps.s${n}Title`),
    description: t(`steps.s${n}Desc`),
  }));

  return (
    <section id="processo" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <p className="section-kicker mb-4">{t('kicker')}</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-xl">
            {t('title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-0">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="border-t border-border/[0.08] pt-6 pb-10 md:border-l md:border-t-0 md:pl-6 first:md:border-l-0 first:md:pl-0"
            >
              <span className="block text-[5.5rem] font-black leading-none text-fg/[0.05] select-none tabular-nums">
                {item.step}
              </span>
              <h3 className="text-sm font-bold mt-4 mb-2">{item.title}</h3>
              <p className="text-sm text-fg/40 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
