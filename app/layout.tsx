import type { Metadata, Viewport } from 'next';
import { Nunito, Manrope } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800'],
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: 'Хвост — журнал здоровья вашей собаки',
  description:
    'Ведите профиль собаки, отслеживайте прививки, получайте советы от AI-помощника.',
  openGraph: {
    title: 'Хвост — журнал здоровья вашей собаки',
    description: 'Ведите профиль собаки, отслеживайте прививки, получайте советы от AI-помощника.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBF0' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1511' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${nunito.variable} ${manrope.variable}`}>
      <body className="bg-bg text-text antialiased font-body">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
