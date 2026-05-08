import { About } from '@/components/about';
import { Clients } from '@/components/clients';
import { ContactCta } from '@/components/contact-cta';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Portfolio } from '@/components/portfolio';
import { Process } from '@/components/process';
import { Services } from '@/components/services-carousel';
import { ChatbotWidget } from '@/components/chatbot-widget';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'HSB Company',
  description:
    'Agência de marketing em São Paulo especializada em desenvolvimento de sites, SEO, tráfego pago, branding e produção audiovisual.',
  areaServed: 'São Paulo, Brasil',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Paulo',
    addressCountry: 'BR'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'contato@hsb.company',
    telephone: '+55-11-99999-9999'
  }
};

export default function Home() {
  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main id="top">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Clients />
        <Process />
        <ContactCta />
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
