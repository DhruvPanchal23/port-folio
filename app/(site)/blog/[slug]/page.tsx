'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug } from '@/lib/cms-fetch';
import type { BlogPostRecord } from '@/lib/types/cms';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetchBlogPostBySlug(params.slug).then((p) => {
      if (!p) setMissing(true);
      else setPost(p);
      setLoading(false);
    });
  }, [params.slug]);

  if (loading) return <div className="min-h-screen py-24 flex justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (missing || !post) notFound();

  return (
    <article className="min-h-screen py-24">
      <div className="container-max max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="text-sm text-muted-foreground mb-4">{post.read_time} min read · {post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-xl text-muted-foreground">{post.excerpt}</p>}
        </motion.header>
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden mb-10 aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="prose prose-invert max-w-none">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-wrap">{para}</p>
          ))}
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-10 border-t border-border">
            {post.tags.map((t) => <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{t}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}
