import LinksClient from './LinksClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links',
  description: 'One page, every door. Access my social media profiles, resume, tool stack, and contact details.',
  alternates: {
    canonical: '/links',
  },
  openGraph: {
    type: 'website',
    title: 'Links | Dhruv Panchal',
    description: 'One page, every door. Access my social media profiles, resume, tool stack, and contact details.',
    url: '/links',
  },
};

export default function LinksPage() {
  return <LinksClient />;
}
