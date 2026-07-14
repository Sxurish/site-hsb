import { useTranslations } from 'next-intl';

export const FAQ_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

// Server component — usa <details>/<summary> nativos: as respostas ficam
// sempre no DOM (extraíveis por buscadores e bots de IA), abrir/fechar é do
// browser, sem JavaScript.
export function Faq() {
  const t = useTranslations('Faq');

  return (
    <section id="faq" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <p className="section-kicker mb-6">{t('kicker')}</p>
        <h2 className="max-w-xl text-4xl font-black leading-tight md:text-5xl">
          {t('title')}
        </h2>

        <div className="mt-12 max-w-3xl space-y-3">
          {FAQ_IDS.map((id) => (
            <details
              key={id}
              className="group rounded-2xl border border-border/[0.08] bg-surface/40 px-5 py-4 transition-colors open:bg-surface/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-fg/85 transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
                {t(`items.${id}.q`)}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-lg text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-fg/60 md:text-base">
                {t(`items.${id}.a`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
