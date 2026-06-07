import { fetchBlogPostBySlug } from '@/lib/cms-fetch';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import { getBlogPostSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const ogImage = post.og_image || post.cover_image || '/og-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: `${title} | Dhruv Panchal`,
      description,
      url: `/blog/${post.slug}`,
      images: [{ url: ogImage }],
      publishedTime: post.published_at || undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export const revalidate = 300;

export default async function BlogPostPage({ params }: Props) {
  const post = await fetchBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const schema = getBlogPostSchema(post);

  return (
    <>
      <script
        id={`schema-blog-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
