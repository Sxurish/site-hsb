'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CircularTestimonials } from './ui/circular-testimonials';

const ease = [0.16, 1, 0.3, 1] as const;

const PLACEHOLDER_IMAGES = [
  'https://i.pravatar.cc/600?img=14',
  'https://i.pravatar.cc/600?img=33',
  'https://i.pravatar.cc/600?img=12',
  'https://i.pravatar.cc/600?img=47',
  'https://i.pravatar.cc/600?img=45',
  'https://i.pravatar.cc/600?img=68',
];

export function Testimonials() {
  const t = useTranslations('Testimonials');

  const testimonials = Array.from({ length: 6 }).map((_, i) => {
    const n = i + 1;
    return {
      quote: t(`items.c${n}Quote`),
      name: t(`items.c${n}Name`),
      designation: t(`items.c${n}Designation`),
      src: PLACEHOLDER_IMAGES[i],
    };
  });

  return (
    <section
      id="clientes"
      className="border-t border-border/[0.08] py-24 md:py-36"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease }}
          className="mb-16 md:mb-20 max-w-3xl"
        >
          <p className="section-kicker mb-5">{t('kicker')}</p>
          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-black leading-tight"
          >
            {t('title')}{' '}
            <em className="not-italic text-accent">{t('titleEm')}</em>.
          </h2>
          <p className="text-lg text-fg/50 leading-relaxed mt-6">{t('lede')}</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="flex justify-center"
        >
          <div className="w-full">
            <CircularTestimonials
              testimonials={testimonials}
              autoplay
              colors={{
                name: 'rgb(var(--fg))',
                designation: 'rgb(var(--accent) / 0.9)',
                testimony: 'rgb(var(--fg) / 0.7)',
                arrowBackground: 'rgb(var(--fg) / 0.08)',
                arrowForeground: 'rgb(var(--fg))',
                arrowHoverBackground: 'rgb(var(--accent))',
              }}
              fontSizes={{
                name: '1.75rem',
                designation: '0.95rem',
                quote: '1.125rem',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
