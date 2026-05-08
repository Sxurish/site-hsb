import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ChatWidget from '@/components/ChatWidget/ChatWidget';
import CursorTracker from '@/components/CursorTracker/CursorTracker';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HSB Company | Create • Connect • Grow',
  description: 'Agência de Marketing Digital — HSB Company. Soluções premium em automação, design de alta conversão e tráfego pago.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${outfit.className}`}>
      <body>
        <CursorTracker />
        <Navbar />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
