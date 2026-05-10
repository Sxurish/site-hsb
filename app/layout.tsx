import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://hsb.company';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f6' },
    { media: '(prefers-color-scheme: dark)',  color: '#0c0b0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HSB Company | Agência de Marketing & Audiovisual em São Paulo',
    template: '%s | HSB Company',
  },
  description:
    'A HSB Company é uma agência de marketing orientada a resultados em São Paulo, especializada em sites, SEO, tráfego pago, branding, produção de vídeo e fotografia comercial.',
  applicationName: 'HSB Company',
  authors: [{ name: 'HSB Company' }],
  creator: 'HSB Company',
  publisher: 'HSB Company',
  keywords: [
    'agência de marketing São Paulo',
    'desenvolvimento de sites Brasil',
    'SEO São Paulo',
    'gestão de tráfego pago',
    'produção audiovisual São Paulo',
    'agência de marketing digital',
    'landing page de alta conversão',
    'branding premium',
    'fotografia comercial SP',
    'automação com IA',
  ],
  category: 'business',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  alternates: {
    canonical: '/',
    languages: { 'pt-BR': '/' },
  },
  openGraph: {
    title: 'HSB Company | Agência de Marketing & Audiovisual em São Paulo',
    description:
      'Estratégia digital focada em performance e produção audiovisual de alto impacto para marcas ambiciosas em São Paulo.',
    url: SITE_URL,
    siteName: 'HSB Company',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'HSB Company — Agência de Marketing em São Paulo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HSB Company | Agência de Marketing & Audiovisual',
    description:
      'Performance digital e produção audiovisual premium para marcas que querem crescer em São Paulo.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Anti-flash: aplica dark antes do primeiro render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
