'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    num: '01',
    title: 'Strategic Creativity',
    text: 'Creative direction backed by market intelligence, intent data, and conversion architecture.',
  },
  {
    num: '02',
    title: 'Execution Velocity',
    text: 'Rapid sprints from concept to launch, without sacrificing polish or performance.',
  },
  {
    num: '03',
    title: 'Reliable Growth',
    text: 'Transparent process, measurable outcomes, and relentless optimization at every stage.',
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-24 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="section-kicker mb-5">About</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              An urban-edge agency for brands that{' '}
              <em className="italic text-accent">refuse to blend in.</em>
            </h2>
          </motion.div>

          {/* Right column */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-lg text-fg/50 leading-relaxed mb-12"
            >
              From São Paulo to ambitious markets worldwide, we combine precision strategy and loud
              creative energy to generate demand, authority, and revenue.
            </motion.p>

            <div>
              {pillars.map((p, i) => (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="border-t border-border/[0.08] py-6 flex gap-5 items-start"
                >
                  <span className="text-xs font-mono text-fg/25 mt-0.5 shrink-0">{p.num}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1.5">{p.title}</p>
                    <p className="text-sm text-fg/45 leading-relaxed">{p.text}</p>
                  </div>
                </motion.div>
              ))}
              <div className="border-t border-border/[0.08]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
