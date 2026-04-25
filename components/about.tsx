import { BarChart3, BriefcaseBusiness, Clock3 } from 'lucide-react';
import { SectionShell } from './section-shell';

const highlights = [
  {
    icon: BriefcaseBusiness,
    title: 'Business-First Strategy',
    text: 'Every decision is aligned with revenue goals, not vanity metrics.'
  },
  {
    icon: BarChart3,
    title: 'Performance Focus',
    text: 'Campaigns are optimized with transparent KPIs and weekly reporting.'
  },
  {
    icon: Clock3,
    title: 'Reliable Execution',
    text: 'Agile process, clear timelines, and proactive communication.'
  }
];

export function About() {
  return (
    <SectionShell
      id="about"
      kicker="About HSB"
      title="A modern minimalist agency built for serious growth."
      description="From São Paulo, HSB supports companies with strategy, media, and production systems designed for sustainable performance."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, text }) => (
          <article key={title} className="card p-6">
            <Icon className="h-6 w-6 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
