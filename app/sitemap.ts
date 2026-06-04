import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dhruvpanchal.dev';
  const currentDate = new Date();

  const routes = [
    '',
    '/about',
    '/work',
    '/resume',
    '/blog',
    '/connect',
    '/guestbook',
    '/testimonials',
    '/links',
    '/feedback',
    '/engine-room',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
