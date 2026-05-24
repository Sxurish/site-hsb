import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
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

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE}/#organization`,
  name: 'HSB Company',
  legalName: 'HSB Company',
  url: SITE,
  logo: `${SITE}/logo.png`,
  image: `${SITE}/logo.png`,
  description:
    'Agência de marketing em São Paulo especializada em desenvolvimento de sites, SEO, tráfego pago, branding e produção audiovisual.',
  priceRange: '$$$',
  areaServed: [
    { '@type': 'City', name: 'São Paulo' },
    { '@type': 'Country', name: 'Brasil' },
  ],
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
  sameAs: [],
  knowsAbout: [
    'Desenvolvimento de Sites',
    'SEO',
    'Google Ads',
    'Meta Ads',
    'Branding',
    'Produção Audiovisual',
    'Automação com IA',
  ],
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'HSB Company',
  publisher: { '@id': `${SITE}/#organization` },
  inLanguage: 'pt-BR',
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
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
