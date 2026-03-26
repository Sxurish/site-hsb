'use client';

import { motion } from 'framer-motion';
import { processSteps } from '@/data/site';
import { SectionShell } from './section-shell';

export function Process() {
  return (
    <SectionShell
      id="process"
      kicker="Process"
      title="A high-speed framework designed for momentum."
      description="Structured, transparent, and built to keep your campaigns moving from first brief to scalable growth."
    >
      <div className="relative">
        <div className="absolute left-[22px] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-brightCyan via-hotPink to-transparent md:block" />
        <div className="space-y-5">
          {processSteps.map((item, index) => (
            <motion.article
              key={item.step}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card neon-outline relative rounded-2xl p-5 md:ml-14"
            >
              <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-brightCyan bg-black font-bold text-brightCyan md:-left-20">
                {item.step}
              </span>
              <h3 className="pl-14 text-xl font-bold md:pl-0">{item.title}</h3>
              <p className="mt-2 pl-14 text-white/75 md:pl-0">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
