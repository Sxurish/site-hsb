'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const metrics = [
  { value: '150+',  label: 'sites entregues' },
  { value: '+312%', label: 'leads em 90 dias' },
  { value: '6.4×',  label: 'ROAS médio' },
  { value: '70+',   label: 'clientes em SP' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-28 pb-16">
      {/* Glow ambiente — apenas dark mode */}
      <div className="pointer-events-none absolute -top-40 left-1/4 -z-10 h-[600px] w-[600px] rounded-full opacity-0 dark:opacity-15 blur-[130px] bg-accent" />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="section-kicker mb-10"
        >
          Agência de Marketing · São Paulo, Brasil
        </motion.p>

        <div className="overflow-hidden">
          {[
            { text: 'Construa uma marca',        style: '' },
            { text: 'que cresce rápido',          style: 'italic text-accent' },
            { text: 'e vende mais.',              style: '' },
          ].map((line, i) => (
            <div key={line.text} className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
                className={`block text-[clamp(3.2rem,10.5vw,9.5rem)] font-black leading-[0.92] tracking-tight ${line.style}`}
              >
                {line.text}
              </motion.h1>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <a
            href="#contato"
            className="group inline-flex items-center gap-2 rounded-full bg-fg px-7 py-3.5 text-sm font-bold text-bg transition hover:opacity-85"
          >
            Solicitar Orçamento
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#portfolio"
            className="text-sm text-fg/40 underline underline-offset-4 decoration-fg/20 transition hover:text-fg hover:decoration-fg/50"
          >
            Ver Projetos
          </a>
        </motion.div>
      </div>

      {/* Faixa de métricas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7, ease }}
        className="mx-auto w-full max-w-7xl px-4 md:px-8"
      >
        <div className="border-t border-border/[0.1] pt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 + i * 0.07, ease }}
            >
              <p className="text-4xl md:text-5xl font-black tabular-nums">{m.value}</p>
              <p className="mt-1.5 text-sm text-fg/35">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
