import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Sign the guestbook and leave a message for Dhruv Panchal. Share your thoughts and connect with other visitors.',
  openGraph: {
    title: 'Guestbook - Dhruv Panchal',
    description: 'Leave your mark and sign the guestbook',
    url: 'https://dhruvpanchal.dev/guestbook',
  },
};

export default function GuestbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
