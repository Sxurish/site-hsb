import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { About } from '@/components/about';
import { ContactCta } from '@/components/contact-cta';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { MidCta } from '@/components/mid-cta';
import { Process } from '@/components/process';
import { Services } from '@/components/services-carousel';

const ChatbotWidget = dynamic(
  () => import('@/components/chatbot-widget').then((m) => m.ChatbotWidget),
  { ssr: false }
);

const SITE = 'https://hsb.company';
const ORG_ID = `${SITE}/#organization`;

// Serviços reais do site (mesmos ids de messages/*.json → Services.items).
const SERVICE_IDS = ['ai', 'site', 'ads', 'social', 'brand', 'video', 'funnel', 'consult'] as const;

const AREA_SERVED = [
  { '@type': 'City', name: 'São Paulo' },
  { '@type': 'Country', name: 'Brasil' },
];

// JSON-LD localizado por idioma da página — LocalBusiness (subtipo de
// Organization) + WebSite + um Service por serviço real do carrossel.
async function buildJsonLd(locale: string) {
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const tServices = await getTranslations({ locale, namespace: 'Services' });

  const localBusiness = {
    '@type': 'LocalBusiness',
    '@id': ORG_ID,
    name: 'HSB Company',
    legalName: 'HSB Company',
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/logo.png`,
    description: tMeta('description'),
    priceRange: '$$$',
    areaServed: AREA_SERVED,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'contato@hsbcompany.com.br',
        availableLanguage: ['Portuguese', 'English'],
        areaServed: 'BR',
      },
    ],
    // TODO: preencher com as URLs reais das redes sociais (footer ainda usa "#")
    sameAs: [],
    knowsAbout: SERVICE_IDS.map((id) => tServices(`items.${id}.title`)),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'HSB Company',
    publisher: { '@id': ORG_ID },
    inLanguage: locale,
  };

  const services = SERVICE_IDS.map((id) => ({
    '@type': 'Service',
    '@id': `${SITE}/#service-${id}`,
    name: tServices(`items.${id}.title`),
    description: tServices(`items.${id}.desc`),
    serviceType: tServices(`items.${id}.title`),
    provider: { '@id': ORG_ID },
    areaServed: AREA_SERVED,
    inLanguage: locale,
  }));

  return { '@context': 'https://schema.org', '@graph': [localBusiness, website, ...services] };
}

// `</script>` embutido quebraria o parse do HTML — escapa `<` por segurança.
function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLd = await buildJsonLd(locale);

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <main id="top">
        <Hero />
        <About />
        <Services />
        <MidCta />
        <Process />
        <ContactCta />
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
