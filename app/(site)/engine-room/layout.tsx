import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engine Room',
  description: 'The tools, tech stack, and hardware that power Dhruv Panchal\'s work. Explore the development setup, design tools, and productivity apps.',
  keywords: ['tech stack', 'development tools', 'uses', 'setup', 'hardware'],
  openGraph: {
    title: 'Engine Room - Tools & Tech Stack',
    description: 'The tools and technology behind the work',
    url: 'https://dhruvpanchal.dev/engine-room',
  },
};

export default function EngineRoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
