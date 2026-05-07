const pillars = [
  {
    num: '01',
    title: 'Strategic Creativity',
    text: 'Creative direction backed by market intelligence, intent data, and conversion architecture.',
  },
  {
    num: '02',
    title: 'Execution Velocity',
    text: 'Rapid sprints from concept to launch, without sacrificing polish or performance.',
  },
  {
    num: '03',
    title: 'Reliable Growth',
    text: 'Transparent process, measurable outcomes, and relentless optimization at every stage.',
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-white/[0.08] py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-24 items-start">
          <div>
            <p className="section-kicker mb-5">About</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              An urban-edge agency for brands that{' '}
              <em className="italic text-white/35">refuse to blend in.</em>
            </h2>
          </div>

          <div>
            <p className="text-lg text-white/50 leading-relaxed mb-12">
              From São Paulo to ambitious markets worldwide, we combine precision strategy and loud
              creative energy to generate demand, authority, and revenue.
            </p>
            <div>
              {pillars.map((p) => (
                <div
                  key={p.num}
                  className="border-t border-white/[0.08] py-6 flex gap-5 items-start"
                >
                  <span className="text-xs font-mono text-white/25 mt-0.5 shrink-0">{p.num}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1.5">{p.title}</p>
                    <p className="text-sm text-white/45 leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/[0.08]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
