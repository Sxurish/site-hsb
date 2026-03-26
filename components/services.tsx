'use client';

import { motion } from 'framer-motion';
import { digitalServices, productionServices } from '@/data/site';
import { SectionShell } from './section-shell';

function ServiceGroup({ title, services }: { title: string; services: typeof digitalServices }) {
  return (
    <div>
      <h3 className="mb-4 text-2xl font-black uppercase tracking-wide">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map(({ title: serviceTitle, description, icon: Icon }) => (
          <motion.article
            key={serviceTitle}
            whileHover={{ y: -6 }}
            className="group glass-card neon-outline rounded-2xl p-5 transition hover:border-hotPink/60"
          >
            <Icon className="h-7 w-7 text-hotPink transition group-hover:scale-110 group-hover:text-brightCyan" />
            <h4 className="mt-4 text-lg font-bold">{serviceTitle}</h4>
            <p className="mt-2 text-sm text-white/75">{description}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export function Services() {
  return (
    <SectionShell
      id="services"
      kicker="Services"
      title="Dual-engine capability: digital performance + audiovisual impact."
      description="We build complete growth systems where your message looks world-class and performs like a machine."
    >
      <div className="grid gap-10 md:grid-cols-2">
        <ServiceGroup title="Digital Services" services={digitalServices} />
        <ServiceGroup title="Audiovisual Production" services={productionServices} />
      </div>
    </SectionShell>
  );
}
