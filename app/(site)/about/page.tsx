import AboutClient from './AboutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Technology is my foundation, creativity is my language. I\'m a Computer Science student and multidisciplinary creator passionate about building at the intersection of technology, design, and storytelling.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    type: 'profile',
    title: 'About | Dhruv Panchal',
    description: 'Computer Science student and multidisciplinary creator passionate about building at the intersection of technology, design, and storytelling.',
    url: '/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
