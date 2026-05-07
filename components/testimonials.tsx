const reviews = [
  {
    quote:
      'HSB transformed our acquisition pipeline. In 60 days we had higher-quality leads and a brand that finally looked premium.',
    name: 'Mariana Costa',
    role: 'CMO, NovaHub',
    initials: 'MC',
  },
  {
    quote:
      'The campaign videos + paid traffic strategy gave us our best quarter ever. Sharp creative, no fluff, just growth.',
    name: 'Felipe Andrade',
    role: 'Founder, Drivex Auto Group',
    initials: 'FA',
  },
  {
    quote:
      'From website rebuild to SEO, everything was built with performance in mind. The team executes insanely fast.',
    name: 'Patrícia Lima',
    role: 'Director, Clinica Vitta',
    initials: 'PL',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-white/[0.08] py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mb-14">
          <p className="section-kicker mb-4">Social Proof</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            Trusted by growth-focused teams across São Paulo.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
          {reviews.map((review) => (
            <figure key={review.name} className="bg-surface p-8 flex flex-col justify-between gap-10">
              <blockquote className="text-base text-white/75 leading-relaxed">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-white/35">{review.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
