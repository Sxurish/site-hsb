'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const reviews = [
  {
    quote:
      'HSB transformed our acquisition pipeline. In 60 days we had higher-quality leads and a brand that finally looked premium.',
    name: 'Mariana Costa',
    role: 'CMO, NovaHub',
    initials: 'MC',
  },
  {
    quote:
      'The campaign videos + paid traffic strategy gave us our best quarter ever. Sharp creative, no fluff, just growth.',
    name: 'Felipe Andrade',
    role: 'Founder, Drivex Auto Group',
    initials: 'FA',
  },
  {
    quote:
      'From website rebuild to SEO, everything was built with performance in mind. The team executes insanely fast.',
    name: 'Patrícia Lima',
    role: 'Director, Clinica Vitta',
    initials: 'PL',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-14"
        >
          <p className="section-kicker mb-4">Social Proof</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            Trusted by growth-focused teams across São Paulo.
          </h2>
        </motion.div>

        {/* Gap-grid: parent background shows through the gap as divider lines */}
        <div className="grid md:grid-cols-3 gap-px bg-border/[0.08]">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: i * 0.09, ease }}
              className="bg-bg flex flex-col justify-between gap-10 p-8"
            >
              <blockquote className="text-base text-fg/75 leading-relaxed">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent shrink-0">
                  {r.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-fg/35">{r.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
