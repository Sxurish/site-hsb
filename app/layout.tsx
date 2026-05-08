import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HSB Company | Agência de Marketing & Audiovisual em São Paulo',
  description:
    'A HSB Company é uma agência de marketing orientada a resultados em São Paulo, especializada em sites, SEO, tráfego pago, branding, produção de vídeo e fotografia comercial.',
  keywords: [
    'agência de marketing São Paulo',
    'desenvolvimento de sites Brasil',
    'SEO São Paulo',
    'gestão de tráfego pago',
    'produção audiovisual São Paulo'
  ],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'HSB Company | Agência de Marketing & Audiovisual em São Paulo',
    description:
      'Estratégia digital focada em performance e produção audiovisual de alto impacto para marcas ambiciosas em São Paulo.',
    locale: 'pt_BR',
    type: 'website'
  },
  metadataBase: new URL('https://hsb.company')
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
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
