import { BrainCircuit, Rocket, ShieldCheck } from 'lucide-react';
import { SectionShell } from './section-shell';

const pillars = [
  {
    icon: BrainCircuit,
    title: 'Strategic Creativity',
    text: 'Creative direction backed by market intelligence, intent data, and conversion architecture.'
  },
  {
    icon: Rocket,
    title: 'Execution Velocity',
    text: 'Rapid sprints from concept to launch, without sacrificing polish or performance.'
  },
  {
    icon: ShieldCheck,
    title: 'Reliable Growth',
    text: 'Transparent process, measurable outcomes, and relentless optimization at every stage.'
  }
];

export function About() {
  return (
    <SectionShell
      id="about"
      kicker="About"
      title="An urban-edge agency built for brands that refuse to blend in."
      description="From São Paulo to ambitious markets worldwide, we combine precision strategy and loud creative energy to generate demand, authority, and revenue."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, text }) => (
          <article key={title} className="glass-card neon-outline rounded-3xl p-6 transition hover:-translate-y-1 hover:border-brightCyan/60">
            <Icon className="h-8 w-8 text-brightCyan" />
            <h3 className="mt-4 text-xl font-bold">{title}</h3>
            <p className="mt-3 text-white/75">{text}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
