import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links',
  description: 'Find Dhruv Panchal across the web - GitHub, LinkedIn, Twitter, and more. All important links in one place.',
  openGraph: {
    title: 'All Links - Dhruv Panchal',
    description: 'Connect with me on various platforms',
    url: 'https://dhruvpanchal.dev/links',
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
