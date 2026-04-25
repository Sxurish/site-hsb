import { MessageCircle } from 'lucide-react';
import { SectionShell } from './section-shell';
import { LeadForm } from './lead-form';

export function ContactCta() {
  return (
    <SectionShell
      id="contact"
      kicker="Let&apos;s Build"
      title="Ready to dominate your market?"
      description="Tell us your growth target. We&apos;ll map the fastest route to more leads, stronger positioning, and scalable revenue."
    >
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <LeadForm />

        <aside className="space-y-4">
          <div className="glass-card neon-outline rounded-3xl p-6">
            <h3 className="text-2xl font-black">Direct Line, Zero Friction.</h3>
            <p className="mt-3 text-white/75">Need speed? Talk to our team on WhatsApp and get a strategic response in minutes.</p>
            <a
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-acidGreen px-5 py-3 font-bold text-black"
              href="https://wa.me/5511999999999"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
          </div>
          <div className="rounded-3xl border border-dashed border-brightCyan/40 p-6 text-sm text-white/70">
            Prefer email? Reach us at <span className="font-semibold text-white">contato@hsb.company</span>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
