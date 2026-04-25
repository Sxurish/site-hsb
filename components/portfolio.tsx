import { SectionShell } from './section-shell';

const projects = [
  { title: 'Fintech Demand Generation', service: 'Landing Page + Paid Media' },
  { title: 'Retail Brand Video Campaign', service: 'Video Production' },
  { title: 'Healthcare Local SEO Program', service: 'SEO + Content Strategy' },
  { title: 'Automotive Paid Traffic Scale', service: 'Google Ads + Meta Ads' },
  { title: 'Corporate Rebranding Project', service: 'Branding + Visual Identity' },
  { title: 'Product Launch Photo & Video', service: 'Photography + Post Production' }
];

export function Portfolio() {
  return (
    <SectionShell
      id="portfolio"
      kicker="Portfolio"
      title="Clean execution across sectors."
      description="A minimalist portfolio where every project reflects strategy, precision, and performance impact."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <article key={project.title} className="card p-6 transition hover:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">{project.service}</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
            <p className="mt-3 text-sm text-slate-400">Case details available upon request.</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
