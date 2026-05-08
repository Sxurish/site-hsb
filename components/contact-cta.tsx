'use client';

import { motion } from 'framer-motion';
import { LeadForm } from './lead-form';

const ease = [0.16, 1, 0.3, 1] as const;

export function ContactCta() {
  return (
    <section id="contact" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease }}
          >
            <p className="section-kicker mb-5">Let&apos;s Build</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Ready to dominate your market?
            </h2>
            <p className="text-fg/45 leading-relaxed mb-12">
              Tell us your growth target. We&apos;ll map the fastest route to more leads, stronger
              positioning, and scalable revenue.
            </p>

            <div className="space-y-6 text-sm">
              {[
                { label: 'WhatsApp', value: '+55 (11) 99999-9999', href: 'https://wa.me/5511999999999' },
                { label: 'Email',    value: 'contato@hsb.company',  href: 'mailto:contato@hsb.company' },
              ].map((c) => (
                <div key={c.label}>
                  <p className="text-fg/25 text-xs tracking-[0.25em] uppercase mb-1.5">{c.label}</p>
                  <a href={c.href} className="font-medium transition hover:text-fg/60">
                    {c.value}
                  </a>
                </div>
              ))}
              <div>
                <p className="text-fg/25 text-xs tracking-[0.25em] uppercase mb-1.5">Location</p>
                <p className="text-fg/55">São Paulo, Brazil</p>
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
