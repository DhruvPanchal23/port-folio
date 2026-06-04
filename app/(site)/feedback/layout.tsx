import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share your feedback about Dhruv Panchal\'s portfolio website. Report bugs, suggest features, or share your thoughts.',
  openGraph: {
    title: 'Feedback - Dhruv Panchal',
    description: 'Help improve the website by sharing your feedback',
    url: 'https://dhruvpanchal.dev/feedback',
  },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
