import { MessageCircle } from 'lucide-react';
import { SectionShell } from './section-shell';
import { LeadForm } from './lead-form';

export function ContactCta() {
  return (
    <SectionShell
      id="contact"
      kicker="Contact"
      title="Let&apos;s build your next growth phase."
      description="Share your goals and receive a strategic proposal aligned with business outcomes."
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <LeadForm />
        <aside className="space-y-4">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">Speak with our team</h3>
            <p className="mt-2 text-slate-300">Prefer a faster conversation? Reach us directly on WhatsApp.</p>
            <a href="https://wa.me/5511999999999" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 font-semibold text-white">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <div className="card p-6 text-sm text-slate-300">
            Email: <span className="font-semibold text-white">hello@hsbcompany.com</span>
            <br />
            Phone: <span className="font-semibold text-white">+55 (11) 99999-9999</span>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
