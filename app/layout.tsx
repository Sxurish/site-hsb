import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HSB | Marketing Agency in São Paulo',
  description:
    'HSB is a corporate marketing and audiovisual agency in São Paulo focused on measurable growth, lead generation, SEO, paid media, and premium production.',
  keywords: [
    'marketing agency São Paulo',
    'lead generation agency Brazil',
    'SEO São Paulo',
    'paid media management',
    'audiovisual production São Paulo'
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'HSB | Strategic Marketing & Production',
    description:
      'Professional marketing strategy, website performance, paid traffic, and audiovisual production for companies in São Paulo.',
    locale: 'en_US',
    type: 'website'
  },
  metadataBase: new URL('https://hsbcompany.example')
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
