'use client';

import { digitalServices, productionServices } from '@/data/site';

function ServiceList({
  title,
  services,
}: {
  title: string;
  services: typeof digitalServices;
}) {
  return (
    <div>
      <p className="text-xs tracking-[0.25em] uppercase text-white/25 mb-6">{title}</p>
      {services.map((s, i) => (
        <div key={s.title} className="group border-t border-white/[0.08] py-5 cursor-default">
          <div className="flex gap-5 items-start">
            <span className="text-xs font-mono text-white/20 mt-0.5 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm group-hover:text-white/60 transition-colors">
                {s.title}
              </p>
              <p className="mt-2 text-sm text-white/35 leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300 ease-in-out">
                {s.description}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="border-t border-white/[0.08]" />
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="border-t border-white/[0.08] py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="section-kicker mb-4">Services</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-xl">
              Dual-engine capability: digital performance + audiovisual impact.
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs md:text-right leading-relaxed">
            We build complete growth systems where your message looks world-class and performs like a
            machine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-20">
          <ServiceList title="Digital" services={digitalServices} />
          <ServiceList title="Audiovisual" services={productionServices} />
        </div>
      </div>
    </section>
  );
}
