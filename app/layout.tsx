import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { personSchema, websiteSchema, profilePageSchema } from '@/lib/structured-data';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://dhruvpanchal.dev'),
  title: {
    default: 'Dhruv Panchal — Full Stack Developer & Designer',
    template: '%s | Dhruv Panchal',
  },
  description:
    'Full-stack developer, graphic designer & creative technologist. I craft digital experiences you\'ll never forget. Available for freelance projects and collaborations.',
  keywords: ['developer', 'full-stack', 'react', 'nextjs', 'typescript', 'portfolio', 'graphic designer', 'ui ux design', 'freelance', 'web development'],
  authors: [{ name: 'Dhruv Panchal' }],
  creator: 'Dhruv Panchal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Dhruv Panchal — Full Stack Developer & Designer',
    description: 'Full-stack developer and creative technologist crafting digital experiences you\'ll never forget.',
    siteName: 'Dhruv Panchal',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhruv Panchal — Full Stack Developer & Designer',
    description: 'Full-stack developer and creative technologist crafting digital experiences you\'ll never forget.',
    images: ['/og-image.png'],
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
            __html: `(function(){try{var k='theme';var t=localStorage.getItem(k);var r=(t==='light')?'light':'dark';document.documentElement.classList.toggle('dark',r==='dark');document.documentElement.style.colorScheme=r;document.documentElement.style.backgroundColor= r==='dark'?'hsl(24 14% 5%)':'hsl(0 0% 98%)';}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';document.documentElement.style.backgroundColor='hsl(24 14% 5%)';}})();`,
          }}
        />
        <script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          id="profile-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
