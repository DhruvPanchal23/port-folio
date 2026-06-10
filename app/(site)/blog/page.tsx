import { fetchPublishedBlogPosts } from '@/lib/cms-fetch';
import BlogClient from './BlogClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Ideas charging up with a can of Monster. Tech thoughts, design principles, and developer life.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    type: 'website',
    title: 'Blog | Dhruv Panchal',
    description: 'Ideas charging up with a can of Monster. Tech thoughts, design principles, and developer life.',
    url: '/blog',
  },
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await fetchPublishedBlogPosts();
  return <BlogClient posts={posts} />;
}
