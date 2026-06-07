import { fetchPublishedTestimonials } from '@/lib/cms-fetch';
import TestimonialsClient from './TestimonialsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'What people say about working with me. Read client feedback, endorsements, and project reviews from professionals.',
  alternates: {
    canonical: '/testimonials',
  },
  openGraph: {
    type: 'website',
    title: 'Testimonials | Dhruv Panchal',
    description: 'What people say about working with me. Read client feedback, endorsements, and project reviews from professionals.',
    url: '/testimonials',
  },
};

export const revalidate = 300;

export default async function TestimonialsPage() {
  const testimonials = await fetchPublishedTestimonials();
  return <TestimonialsClient testimonials={testimonials} />;
}
