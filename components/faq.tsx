import { faqs } from '@/data/site';
import { SectionShell } from './section-shell';

export function Faq() {
  return (
    <SectionShell
      id="faq"
      kicker="FAQ"
      title="Straight answers before you invest."
      description="We keep decisions informed with transparent communication."
    >
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.question} className="card p-5">
            <summary className="cursor-pointer text-base font-semibold text-white">{faq.question}</summary>
            <p className="mt-3 text-slate-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
