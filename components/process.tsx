'use client';

import { motion } from 'framer-motion';
import { processSteps } from '@/data/site';

export function Process() {
  return (
    <section id="process" className="border-t border-white/[0.08] py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mb-16">
          <p className="section-kicker mb-4">Process</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-xl">
            A high-speed framework designed for momentum.
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-0">
          {processSteps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.07 }}
              className="border-t border-white/[0.08] pt-6 pb-10 md:border-l md:border-t-0 md:pl-6 first:md:border-l-0 first:md:pl-0"
            >
              <span className="block text-[5rem] font-black leading-none text-white/[0.06] select-none tabular-nums">
                {item.step}
              </span>
              <h3 className="text-sm font-bold mt-4 mb-2">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
