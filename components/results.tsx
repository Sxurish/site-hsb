import { caseStudies } from '@/data/site';
import { SectionShell } from './section-shell';

export function Results() {
  return (
    <SectionShell
      id="results"
      kicker="Results"
      title="Performance outcomes with executive clarity."
      description="We present measurable progress tied to pipeline quality, revenue, and efficiency."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {caseStudies.map((item) => (
          <article key={item.brand} className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">{item.brand}</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{item.result}</h3>
            <p className="mt-2 text-slate-300">{item.details}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
