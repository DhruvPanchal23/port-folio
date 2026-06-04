import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Portfolio of web development projects, cybersecurity tools, and UI/UX designs by Dhruv Panchal. View live projects and case studies.',
  keywords: ['portfolio', 'web development projects', 'react projects', 'nextjs projects', 'cybersecurity'],
  openGraph: {
    title: 'Projects by Dhruv Panchal - Full Stack Developer',
    description: 'Explore my portfolio of web applications, design work, and development projects.',
    url: 'https://dhruvpanchal.dev/work',
    type: 'website',
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
