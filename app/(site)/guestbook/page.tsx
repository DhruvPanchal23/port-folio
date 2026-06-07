import GuestbookClient from './GuestbookClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Sign the wall. Leave a message, drop a hello, or read logs from previous visitors.',
  alternates: {
    canonical: '/guestbook',
  },
  openGraph: {
    type: 'website',
    title: 'Guestbook | Dhruv Panchal',
    description: 'Sign the wall. Leave a message, drop a hello, or read logs from previous visitors.',
    url: '/guestbook',
  },
};

export default function GuestbookPage() {
  return <GuestbookClient />;
}
