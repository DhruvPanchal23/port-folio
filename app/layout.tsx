import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://alexrivera.dev'),
  title: {
    default: 'Alex Rivera — Creative Technologist & Full-Stack Developer',
    template: '%s | Alex Rivera',
  },
  description:
    'Full-stack developer and creative technologist building premium digital experiences. Available for freelance projects, collaborations, and consulting.',
  keywords: ['developer', 'full-stack', 'react', 'nextjs', 'portfolio', 'creative technologist', 'ui ux design', 'freelance'],
  authors: [{ name: 'Alex Rivera' }],
  creator: 'Alex Rivera',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Alex Rivera — Creative Technologist',
    description: 'Full-stack developer and creative technologist building premium digital experiences.',
    siteName: 'Alex Rivera',
    images: [{ url: 'https://bolt.new/static/og_default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Rivera — Creative Technologist',
    description: 'Full-stack developer and creative technologist building premium digital experiences.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='theme';var t=localStorage.getItem(k);var sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=t==='system'?sys:t==='light'?'light':'dark';document.documentElement.classList.toggle('dark',r==='dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
