'use client';

import { motion } from 'framer-motion';
import { digitalServices, productionServices } from '@/data/site';

const ease = [0.16, 1, 0.3, 1] as const;

function ServiceList({ title, services }: { title: string; services: typeof digitalServices }) {
  return (
    <div>
      <p className="text-xs tracking-[0.25em] uppercase text-fg/25 mb-6">{title}</p>
      {services.map((s, i) => (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: i * 0.06, ease }}
          className="group border-t border-border/[0.08] py-5 cursor-default"
        >
          <div className="flex gap-5 items-start">
            <span className="text-xs font-mono text-fg/20 mt-0.5 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm group-hover:text-fg/60 transition-colors">
                {s.title}
              </p>
              <p className="mt-2 text-sm text-fg/35 leading-relaxed max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-300 ease-in-out">
                {s.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      <div className="border-t border-border/[0.08]" />
    </div>
  );
}

export function Services() {
  return (
    <section id="servicos" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="section-kicker mb-4">Serviços</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-xl">
              Capacidade dupla: performance digital + impacto audiovisual.
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-sm text-fg/40 max-w-xs md:text-right leading-relaxed"
          >
            Construímos sistemas de crescimento completos onde sua mensagem parece premium e
            performa como uma máquina.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-20">
          <ServiceList title="Digital" services={digitalServices} />
          <ServiceList title="Audiovisual" services={productionServices} />
        </div>
      </div>
    </section>
  );
}
