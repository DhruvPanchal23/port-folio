import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
            __html: `(function(){try{var k='theme';var t=localStorage.getItem(k);var sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=t==='system'?sys:t==='light'?'light':'dark';document.documentElement.classList.toggle('dark',r==='dark')}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Dhruv Panchal',
              url: 'https://dhruvpanchal.dev',
              email: 'dhruvpanchal.dev@gmail.com',
              jobTitle: 'Full Stack Developer & Designer',
              description: 'Full-stack developer, graphic designer & creative technologist.',
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Sardar Vallabhbhai National Institute of Technology',
              },
              knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'UI/UX Design'],
              sameAs: [
                'https://github.com/dhruvpanchal',
                'https://linkedin.com/in/dhruv-panchal',
                'https://twitter.com/dhruvpanchal',
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
