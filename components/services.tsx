import { digitalServices, productionServices } from '@/data/site';
import { SectionShell } from './section-shell';

function ServiceGroup({ title, services }: { title: string; services: typeof digitalServices }) {
  return (
    <div>
      <h3 className="mb-4 text-2xl font-semibold text-white">{title}</h3>
      <div className="grid gap-4">
        {services.map(({ title: serviceTitle, description, icon: Icon }) => (
          <article key={serviceTitle} className="card p-5 transition hover:-translate-y-0.5">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-slate-800 p-2">
                <Icon className="h-5 w-5 text-cyan-300" />
              </span>
              <div>
                <h4 className="font-semibold text-white">{serviceTitle}</h4>
                <p className="mt-1 text-sm text-slate-300">{description}</p>
              </div>
            </div>
          </article>
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
      title="Integrated digital and production capabilities."
      description="Minimal complexity for clients, maximum alignment across strategy, execution, and reporting."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <ServiceGroup title="Digital Services" services={digitalServices} />
        <ServiceGroup title="Audiovisual Production" services={productionServices} />
      </div>
    </SectionShell>
  );
}
