'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ease = [0.16, 1, 0.3, 1] as const;

const projectStyles = [
  { bg: '#15130f', accent: '#d4a566', span: 'md:col-span-2 md:row-span-2' },
  { bg: '#1a1813', accent: '#c8b181', span: '' },
  { bg: '#100e0a', accent: '#a8783c', span: '' },
  { bg: '#0e0c08', accent: '#e4c089', span: 'md:col-span-2' },
];

export function Portfolio() {
  const reduce = useReducedMotion();
  const t = useTranslations('Portfolio');

  const projects = projectStyles.map((s, i) => ({
    title:  t(`projects.p${i + 1}Title`),
    type:   t(`projects.p${i + 1}Type`),
    result: t(`projects.p${i + 1}Result`),
    ...s,
  }));

  return (
    <section id="portfolio" className="border-t border-border/[0.08] py-20 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-10 md:mb-14"
        >
          <p className="section-kicker mb-4">{t('kicker')}</p>
          <h2 className="max-w-2xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
        </motion.div>

        <div className="grid auto-rows-[180px] gap-3 sm:auto-rows-[200px] md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: index * 0.07, ease }}
              whileHover={reduce ? undefined : { y: -3 }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl p-5 sm:p-6 ${project.span}`}
              style={{ background: project.bg }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 65% 50%, ${project.accent}1f, transparent 65%)`,
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
                }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] sm:text-xs"
                    style={{ color: `${project.accent}aa` }}
                  >
                    {project.type}
                  </p>
                  <div
                    className="translate-y-1 rounded-full p-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ border: `1px solid ${project.accent}55`, color: project.accent }}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] text-white/40 sm:text-xs sm:mb-2">
                    {project.result}
                  </p>
                  <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
