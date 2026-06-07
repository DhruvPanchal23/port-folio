import FeedbackClient from './FeedbackClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Refining the experience. Drop suggestion, general feedback, report bugs or send appreciation to help improve this site.',
  alternates: {
    canonical: '/feedback',
  },
  openGraph: {
    type: 'website',
    title: 'Feedback | Dhruv Panchal',
    description: 'Refining the experience. Drop suggestion, general feedback, report bugs or send appreciation to help improve this site.',
    url: '/feedback',
  },
};

export default function FeedbackPage() {
  return <FeedbackClient />;
}
