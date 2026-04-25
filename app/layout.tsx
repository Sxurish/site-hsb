import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HSB Company | Marketing & Audiovisual Agency in São Paulo',
  description:
    'HSB Company is a results-driven marketing agency in São Paulo delivering websites, SEO, paid ads, branding, video production, and commercial photography.',
  keywords: [
    'marketing agency São Paulo',
    'website development Brazil',
    'SEO São Paulo',
    'paid traffic management',
    'audiovisual production São Paulo'
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'HSB Company | Marketing & Audiovisual Agency in São Paulo',
    description:
      'Performance-first digital strategy and high-impact audiovisual production for ambitious brands in São Paulo.',
    locale: 'en_US',
    type: 'website'
  },
  metadataBase: new URL('https://hsb.company')
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
