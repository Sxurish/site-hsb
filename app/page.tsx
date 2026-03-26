import { About } from '@/components/about';
import { ContactCta } from '@/components/contact-cta';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Portfolio } from '@/components/portfolio';
import { Process } from '@/components/process';
import { Services } from '@/components/services';
import { Testimonials } from '@/components/testimonials';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'AGENCY_NAME',
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
    email: 'hello@agencyname.com',
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
        <Testimonials />
        <Process />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
