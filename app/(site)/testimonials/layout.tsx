import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Client testimonials and recommendations for Dhruv Panchal. See what people say about working together on web development projects.',
  keywords: ['testimonials', 'reviews', 'recommendations', 'client feedback'],
  openGraph: {
    title: 'Testimonials - Dhruv Panchal',
    description: 'What clients say about working with Dhruv Panchal',
    url: 'https://dhruvpanchal.dev/testimonials',
  },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
