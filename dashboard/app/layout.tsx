import type { Metadata, Viewport } from 'next';
import './globals.css';

// CSP usa nonce por request (middleware.ts). Nonce em HTML pré-renderizado
// fica defasado em runtime → scripts inline do Next quebram com 'strict-dynamic'.
// Forçar dynamic no root layout garante nonce fresh em toda página.
export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dashboard.hsbcompany.com.br';

export const viewport: Viewport = {
  themeColor: '#0c0b0a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'HSB Dashboard', template: '%s | HSB Dashboard' },
  description: 'Área interna HSB Company — métricas, leads e insights.',
  // Nunca indexar — área interna protegida
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  // Sem OG/Twitter cards (não deve aparecer em redes sociais)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
