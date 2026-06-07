import EngineRoomClient from './EngineRoomClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engine Room',
  description: 'Step into the engine room to see the hardware, software tools, active music tracks, and metrics powering my development workflow.',
  alternates: {
    canonical: '/engine-room',
  },
  openGraph: {
    type: 'website',
    title: 'Engine Room | Dhruv Panchal',
    description: 'Step into the engine room to see the hardware, software tools, active music tracks, and metrics powering my development workflow.',
    url: '/engine-room',
  },
};

export default function EngineRoomPage() {
  return <EngineRoomClient />;
}
