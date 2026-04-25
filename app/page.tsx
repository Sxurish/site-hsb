import { About } from '@/components/about';
import { ContactCta } from '@/components/contact-cta';
import { Faq } from '@/components/faq';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Portfolio } from '@/components/portfolio';
import { Process } from '@/components/process';
import { Results } from '@/components/results';
import { Services } from '@/components/services';
import { Testimonials } from '@/components/testimonials';
import { TrustBar } from '@/components/trust-bar';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'HSB',
  description:
    'Marketing agency in São Paulo focused on website development, SEO, paid traffic, branding, and audiovisual production.',
  areaServed: 'São Paulo, Brazil',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Paulo',
    addressCountry: 'BR'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'hello@hsbcompany.com',
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
        <TrustBar />
        <About />
        <Services />
        <Results />
        <Portfolio />
        <Testimonials />
        <Process />
        <Faq />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
