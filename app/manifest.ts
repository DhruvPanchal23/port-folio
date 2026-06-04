import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dhruv Panchal - Portfolio',
    short_name: 'Dhruv P.',
    description: 'Full Stack Developer & Designer Portfolio',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0b0a',
    theme_color: '#f97316',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
