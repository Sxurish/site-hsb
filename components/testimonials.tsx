import { SectionShell } from './section-shell';

const reviews = [
  {
    quote:
      'AGENCY_NAME transformed our acquisition pipeline. In 60 days we had higher-quality leads and a brand that finally looked premium.',
    name: 'Mariana Costa',
    role: 'CMO, NovaHub'
  },
  {
    quote:
      'The campaign videos + paid traffic strategy gave us our best quarter ever. Sharp creative, no fluff, just growth.',
    name: 'Felipe Andrade',
    role: 'Founder, Drivex Auto Group'
  },
  {
    quote:
      'From website rebuild to SEO, everything was built with performance in mind. The team executes insanely fast.',
    name: 'Patrícia Lima',
    role: 'Director, Clinica Vitta'
  }
];

export function Testimonials() {
  return (
    <SectionShell id="testimonials" kicker="Social Proof" title="Trusted by growth-focused teams across São Paulo.">
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <figure key={review.name} className="glass-card neon-outline rounded-2xl p-6">
            <blockquote className="text-white/90">“{review.quote}”</blockquote>
            <figcaption className="mt-5 border-t border-white/15 pt-4">
              <p className="font-semibold">{review.name}</p>
              <p className="text-sm text-white/65">{review.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
