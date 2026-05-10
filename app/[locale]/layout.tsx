import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LanguageBanner } from '@/components/language-banner';
import '../globals.css';

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isDefault = locale === routing.defaultLocale;
  const path = isDefault ? '/' : `/${locale}`;

  const ogLocaleMap: Record<string, string> = {
    'pt-BR': 'pt_BR',
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
    'zh-CN': 'zh_CN',
  };

  return {
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
      icon: [{ url: '/logo.png', type: 'image/png' }],
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, l === routing.defaultLocale ? '/' : `/${l}`]),
      ),
    },
    openGraph: {
      title: 'HSB Company | Agência de Marketing & Audiovisual em São Paulo',
      description:
        'Estratégia digital focada em performance e produção audiovisual de alto impacto para marcas ambiciosas em São Paulo.',
      url: `${SITE_URL}${path}`,
      siteName: 'HSB Company',
      locale: ogLocaleMap[locale] ?? 'pt_BR',
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LanguageBanner />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
