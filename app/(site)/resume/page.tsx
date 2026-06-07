import { fetchResumeData } from '@/lib/resume';
import ResumeClient from './ResumeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'A professional snapshot of my work experience, education, skills, and achievements.',
  alternates: {
    canonical: '/resume',
  },
  openGraph: {
    type: 'profile',
    title: 'Resume | Dhruv Panchal',
    description: 'A professional snapshot of my work experience, education, skills, and achievements.',
    url: '/resume',
  },
};

export const revalidate = 300;

export default async function ResumePage() {
  const resumeData = await fetchResumeData(true);
  return <ResumeClient resumeData={resumeData} />;
}
