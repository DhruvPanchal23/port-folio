import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect',
  description: 'Get in touch with Dhruv Panchal for freelance projects, collaborations, or full-time opportunities. Available for remote work worldwide.',
  keywords: ['contact', 'hire developer', 'freelance', 'collaboration', 'remote developer'],
  openGraph: {
    title: 'Connect with Dhruv Panchal',
    description: 'Available for freelance projects and full-time opportunities. Let\'s work together!',
    url: 'https://dhruvpanchal.dev/connect',
    type: 'website',
  },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
