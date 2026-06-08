import { fetchPublishedProjects } from '@/lib/cms-fetch';
import WorkClient from './WorkClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Thoughtfully crafted products, experiments, and digital experiences.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    type: 'website',
    title: 'Work | Dhruv Panchal',
    description: 'Thoughtfully crafted products, experiments, and digital experiences.',
    url: '/work',
  },
};

export const revalidate = 0;

export default async function WorkPage() {
  const projects = await fetchPublishedProjects();
  return <WorkClient projects={projects} />;
}
