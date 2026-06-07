import ConnectClient from './ConnectClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect',
  description: 'Good Wi-Fi, Great Vibes. Ping me to start a conversation about full-stack engineering, creative design, or digital branding.',
  alternates: {
    canonical: '/connect',
  },
  openGraph: {
    type: 'website',
    title: 'Connect | Dhruv Panchal',
    description: 'Good Wi-Fi, Great Vibes. Ping me to start a conversation about full-stack engineering, creative design, or digital branding.',
    url: '/connect',
  },
};

export default function ConnectPage() {
  return <ConnectClient />;
}
