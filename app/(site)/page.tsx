import HomeClient from './HomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dhruv Panchal — Full Stack Developer & Designer',
  description: 'Full-stack developer, graphic designer & creative technologist crafting digital experiences where engineering meets visual storytelling. Available for freelance projects.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Dhruv Panchal — Full Stack Developer & Designer',
    description: 'Full-stack developer, graphic designer & creative technologist crafting digital experiences where engineering meets visual storytelling.',
    url: '/',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
