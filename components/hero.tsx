'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './brand-logo';

export function Hero() {
  return (
    <section className="container-shell grid gap-10 py-16 md:grid-cols-2 md:py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="section-kicker">HSB · São Paulo, Brazil</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">Modern strategy for measurable growth.</h1>
        <p className="mt-5 max-w-xl text-slate-300 md:text-lg">
          HSB is a minimalist, high-performance marketing partner combining digital growth systems and premium audiovisual execution.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-900">
            Request a Quote
          </a>
          <a href="#portfolio" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white">
            View Our Work
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="card p-6 md:p-8"
      >
        <BrandLogo />
        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-cyan-300">Performance Snapshot</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            ['Qualified Leads', '+312%'],
            ['Average ROAS', '6.4x'],
            ['Projects Delivered', '150+'],
            ['Clients in São Paulo', '70+']
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-900 p-4">
              <p className="text-2xl font-semibold text-white">{value}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <a href="#results" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
          Explore detailed results <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
}
