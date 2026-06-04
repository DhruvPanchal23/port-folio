import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Full-stack developer, graphic designer & creative technologist based in Surat, India. Currently pursuing B.Tech CSE and working on AI in Digital Forensics.',
  keywords: ['about dhruv panchal', 'developer india', 'graphic designer', 'freelance developer', 'svnit'],
  openGraph: {
    title: 'About Dhruv Panchal - Full Stack Developer & Designer',
    description: 'Learn more about Dhruv Panchal - A full-stack developer and creative technologist building digital experiences.',
    url: 'https://dhruvpanchal.dev/about',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Dhruv Panchal',
    description: 'Full-stack developer and creative technologist based in India',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
