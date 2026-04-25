import { SectionShell } from './section-shell';

const steps = [
  ['01', 'Discovery', 'We audit your current operation and define priorities.'],
  ['02', 'Strategy', 'We structure channels, budget logic, and KPI accountability.'],
  ['03', 'Execution', 'We launch campaigns and creative assets with consistent quality.'],
  ['04', 'Optimization', 'We continuously improve performance based on live data.']
] as const;

export function Process() {
  return (
    <SectionShell
      id="process"
      kicker="Process"
      title="Minimal process, maximum control."
      description="A clear framework designed for speed, alignment, and sustainable growth."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map(([number, title, description]) => (
          <article key={number} className="card p-5">
            <p className="text-sm font-semibold text-cyan-300">Step {number}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
