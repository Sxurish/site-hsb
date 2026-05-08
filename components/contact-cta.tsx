'use client';

import { motion } from 'framer-motion';
import { LeadForm } from './lead-form';

const ease = [0.16, 1, 0.3, 1] as const;

export function ContactCta() {
  return (
    <section id="contato" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease }}
          >
            <p className="section-kicker mb-5">Vamos Construir</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Pronto para dominar seu mercado?
            </h2>
            <p className="text-fg/45 leading-relaxed mb-12">
              Nos conte sua meta de crescimento. Vamos traçar o caminho mais rápido para mais
              leads, posicionamento mais forte e receita escalável.
            </p>

            <div className="space-y-6 text-sm">
              {[
                { label: 'WhatsApp', value: '+55 (11) 99999-9999', href: 'https://wa.me/5511999999999' },
                { label: 'E-mail',   value: 'contato@hsb.company',  href: 'mailto:contato@hsb.company' },
              ].map((c) => (
                <div key={c.label}>
                  <p className="text-fg/25 text-xs tracking-[0.25em] uppercase mb-1.5">{c.label}</p>
                  <a href={c.href} className="font-medium transition hover:text-fg/60">
                    {c.value}
                  </a>
                </div>
              ))}
              <div>
                <p className="text-fg/25 text-xs tracking-[0.25em] uppercase mb-1.5">Localização</p>
                <p className="text-fg/55">São Paulo, Brasil</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            <LeadForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
