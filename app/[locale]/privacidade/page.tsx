import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Privacy' });
  return {
    title: t('title'),
    description: t('intro'),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Privacy');

  const sections = [
    'controller',
    'dataCollected',
    'purposes',
    'legalBasis',
    'cookies',
    'retention',
    'sharing',
    'security',
    'rights',
    'contact',
  ] as const;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32">
      <p className="section-kicker mb-6">{t('kicker')}</p>
      <h1 className="text-4xl font-black leading-tight md:text-5xl">{t('title')}</h1>
      <p className="mt-4 text-sm text-fg/40">{t('updated')}</p>

      <p className="mt-10 text-base leading-relaxed text-fg/75">{t('intro')}</p>

      <div className="mt-12 space-y-10">
        {sections.map((key) => (
          <section key={key}>
            <h2 className="text-xl font-bold md:text-2xl">{t(`sections.${key}.title`)}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fg/65 md:text-base">
              {t(`sections.${key}.body`)}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
