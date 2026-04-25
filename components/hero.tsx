'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Gauge, Sparkles, Zap } from 'lucide-react';

const floating = {
  y: [0, -18, 0],
  transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const }
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10 bg-grid bg-[length:45px_45px] opacity-20" />
      <div className="absolute left-1/4 top-24 -z-10 h-56 w-56 rounded-full bg-neonPurple/35 blur-3xl" />
      <div className="absolute right-8 top-40 -z-10 h-52 w-52 rounded-full bg-hotPink/25 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-20 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pb-24">
        <div>
          <p className="section-kicker">Marketing Agency · São Paulo, Brazil</p>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
            Build a brand
            <span className="text-brightCyan"> that moves fast</span>
            <br />
            and sells harder.
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
            AGENCY_NAME fuses high-conversion digital strategy with premium audiovisual production to turn bold
            ideas into measurable growth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-brightCyan px-6 py-3 font-bold text-black transition hover:shadow-cyan"
            >
              Request a Quote <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="#portfolio" className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:border-white">
              Explore Projects
            </a>
          </div>
        </div>

        <div className="relative">
          <motion.div
            animate={floating}
            className="glass-card neon-outline relative rotate-[-3deg] rounded-3xl p-6 shadow-neon md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.2em] text-acidGreen">Campaign Performance</p>
              <Gauge className="h-5 w-5 text-acidGreen" />
            </div>
            <p className="text-4xl font-black">+312%</p>
            <p className="mt-2 text-white/70">Average lead increase in 90 days across managed campaigns.</p>
            <div className="mt-7 grid grid-cols-2 gap-4">
              {[
                { label: 'Web Projects', value: '150+' },
                { label: 'Video Assets', value: '1.2K' },
                { label: 'ROAS Average', value: '6.4x' },
                { label: 'Clients in SP', value: '70+' }
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/15 bg-black/30 p-4">
                  <p className="text-xl font-bold text-brightCyan">{metric.value}</p>
                  <p className="text-xs text-white/70">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <Zap className="absolute -right-2 -top-2 h-10 w-10 text-hotPink" />
          <Sparkles className="absolute -bottom-4 left-2 h-8 w-8 text-neonBlue" />
        </div>
      </div>
    </section>
  );
}
