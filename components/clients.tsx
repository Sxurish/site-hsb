'use client';

import { motion } from 'framer-motion';
import { clients } from '@/data/site';

const ease = [0.16, 1, 0.3, 1] as const;

export function Clients() {
  return (
    <section id="clientes" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-14"
        >
          <p className="section-kicker mb-4">Clientes</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-2xl">
            Marcas que confiaram na HSB para{' '}
            <em className="italic text-accent">crescer de verdade.</em>
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, i) => (
            <motion.article
              key={client.brand}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: i * 0.07, ease }}
              className="group flex flex-col justify-between gap-6 rounded-2xl border border-border/[0.08] bg-surface p-6 transition-colors hover:border-accent/25"
            >
              {/* Topo: avatar + nome + badges */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
                    {client.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{client.brand}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.services.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-fg/[0.06] px-2 py-0.5 text-[10px] font-medium text-fg/50 tracking-wide"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Depoimento */}
                <blockquote className="text-sm text-fg/65 leading-relaxed">
                  &ldquo;{client.quote}&rdquo;
                </blockquote>
              </div>

              {/* Rodapé: autor */}
              <figcaption className="flex items-center gap-2 border-t border-border/[0.06] pt-4">
                <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">
                  {client.initials[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold">{client.name}</p>
                  <p className="text-[10px] text-fg/35">{client.role}</p>
                </div>
              </figcaption>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
