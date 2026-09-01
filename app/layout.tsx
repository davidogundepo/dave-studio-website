import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SelectionProvider } from '@/components/providers/SelectionProvider';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Nav from '@/components/nav/Nav';
import CartDrawer from '@/components/cart/CartDrawer';
import Footer from '@/components/footer/Footer';
import { site } from '@/lib/site';

/* The logo mark is a high-contrast Didone D, so the headlines come from the
   same lineage — mark and type then read as one voice instead of two. */
const display = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

/* Space Grotesk carries the interface: modern, a little quirky in the numerals,
   and specifically not the system-sans everything else uses. */
const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `${site.name} — %s`,
  },
  description:
    'Studio-grade graduation and NYSC portraits built from the photos already on your phone. Pick your looks, approve the results, then pay. Ready in 48 hours.',
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      'Graduation and NYSC portraits from the photos already on your phone. Approve before you pay.',
    url: site.url,
    siteName: site.name,
    type: 'website',
    locale: 'en_NG',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Dave Studio — graduation and NYSC portraits, from ₦10,000',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: 'Graduation and NYSC portraits from the photos already on your phone.',
    images: ['/og.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SelectionProvider>
          <SmoothScrollProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
          </SmoothScrollProvider>
        </SelectionProvider>
      </body>
    </html>
  );
}
