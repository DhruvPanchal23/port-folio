import { MetadataRoute } from 'next';
import { fetchPublishedProjects, fetchPublishedBlogPosts } from '@/lib/cms-fetch';
import type { ProjectRecord, BlogPostRecord } from '@/lib/types/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dhruvpanchal.dev';
  const currentDate = new Date();

  const staticRoutes = [
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

  let projects: ProjectRecord[] = [];
  let blogs: BlogPostRecord[] = [];
  try {
    const [fetchedProjects, fetchedBlogs] = await Promise.all([
      fetchPublishedProjects(),
      fetchPublishedBlogPosts(),
    ]);
    projects = fetchedProjects || [];
    blogs = fetchedBlogs || [];
  } catch (err) {
    console.error('Failed to fetch dynamic routes for sitemap:', err);
  }

  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogRoutes = blogs.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticSitemap, ...projectRoutes, ...blogRoutes];
}
