import { SectionShell } from './section-shell';

const reviews = [
  {
    quote:
      'HSB redesigned our acquisition strategy and improved lead quality in a predictable, data-driven way.',
    name: 'Mariana Costa',
    role: 'CMO, NovaHub'
  },
  {
    quote:
      'The integration between media buying and production increased our sales pipeline consistency month after month.',
    name: 'Felipe Andrade',
    role: 'Founder, Drivex Auto Group'
  },
  {
    quote:
      'From SEO to website structure, HSB delivered clarity, discipline, and measurable progress.',
    name: 'Patrícia Lima',
    role: 'Director, Clínica Vitta'
  }
];

export function Testimonials() {
  return (
    <SectionShell id="testimonials" kicker="Testimonials" title="Credibility built through outcomes.">
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <figure key={review.name} className="card p-6">
            <blockquote className="text-slate-300">“{review.quote}”</blockquote>
            <figcaption className="mt-4 border-t border-slate-800 pt-4">
              <p className="font-semibold text-white">{review.name}</p>
              <p className="text-sm text-slate-400">{review.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
