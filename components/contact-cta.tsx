import { LeadForm } from './lead-form';

export function ContactCta() {
  return (
    <section id="contact" className="border-t border-white/[0.08] py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">
          <div>
            <p className="section-kicker mb-5">Let&apos;s Build</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Ready to dominate your market?
            </h2>
            <p className="text-white/45 leading-relaxed mb-12">
              Tell us your growth target. We&apos;ll map the fastest route to more leads, stronger
              positioning, and scalable revenue.
            </p>

            <div className="space-y-6 text-sm">
              <div>
                <p className="text-white/25 text-xs tracking-[0.25em] uppercase mb-1.5">WhatsApp</p>
                <a
                  href="https://wa.me/5511999999999"
                  className="font-medium hover:text-white/60 transition-colors"
                >
                  +55 (11) 99999-9999
                </a>
              </div>
              <div>
                <p className="text-white/25 text-xs tracking-[0.25em] uppercase mb-1.5">Email</p>
                <a
                  href="mailto:contato@hsb.company"
                  className="font-medium hover:text-white/60 transition-colors"
                >
                  contato@hsb.company
                </a>
              </div>
              <div>
                <p className="text-white/25 text-xs tracking-[0.25em] uppercase mb-1.5">Location</p>
                <p className="text-white/60">São Paulo, Brazil</p>
              </div>
            </div>
          </div>

          <LeadForm />
        </div>
      </div>
    </section>
  );
}
