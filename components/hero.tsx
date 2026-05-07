'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const metrics = [
  { value: '150+', label: 'websites entregues' },
  { value: '+312%', label: 'leads em 90 dias' },
  { value: '6.4×', label: 'ROAS médio' },
  { value: '70+', label: 'clientes em SP' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-kicker mb-10"
        >
          Marketing Agency · São Paulo, Brazil
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[clamp(3.2rem,9vw,8.5rem)] font-black leading-[0.9] tracking-tight"
        >
          Build a brand
          <br />
          <em className="italic text-white/35 not-italic" style={{ fontStyle: 'italic' }}>
            that moves fast
          </em>
          <br />
          and sells harder.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 text-sm font-bold rounded-full hover:bg-white/90 transition"
          >
            Request a Quote
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#portfolio"
            className="text-sm text-white/40 hover:text-white transition underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
          >
            Explore Projects
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-auto w-full max-w-7xl px-4 md:px-8"
      >
        <div className="border-t border-white/10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-4xl md:text-5xl font-black tabular-nums">{m.value}</p>
              <p className="mt-1.5 text-sm text-white/35">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
