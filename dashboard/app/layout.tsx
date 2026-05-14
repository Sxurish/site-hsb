import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0c0b0a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: { default: 'HSB Dashboard', template: '%s | HSB Dashboard' },
  description: 'Área interna HSB Company — métricas, leads e insights.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
