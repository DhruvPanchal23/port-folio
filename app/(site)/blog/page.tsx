'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import BlogEmptyState from '@/components/blog/BlogEmptyState';
import { fetchPublishedBlogPosts } from '@/lib/cms-fetch';
import type { BlogPostRecord } from '@/lib/types/cms';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedBlogPosts().then((data) => { setPosts(data); setLoading(false); });
  }, []);

  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  if (loading) {
    return <div className="min-h-screen py-24 flex justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">101 errors?</h1>
          <p className="text-xl text-muted-foreground">
            {posts.length === 0
              ? 'Nah, just ideas brewing with a sip of coffee.'
              : 'Ideas brewing with a sip of coffee.'}
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <BlogEmptyState />
        ) : (
          <div className="space-y-8">
            {featured.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block glass rounded-2xl overflow-hidden hover:border-primary/40 border border-transparent transition-colors">
                {post.cover_image && (
                  <div className="aspect-[21/9] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={14} className="text-primary fill-primary" />
                    <span className="text-xs font-mono-custom uppercase tracking-wider text-primary">Featured</span>
                  </div>
                  <h2 className="font-display text-3xl font-bold mb-2">{post.title}</h2>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <span className="text-sm text-primary inline-flex items-center gap-1">Read post <ArrowUpRight size={14} /></span>
                </div>
              </Link>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/blog/${post.slug}`} className="block glass rounded-2xl p-6 h-full hover:border-primary/40 border border-transparent transition-colors">
                    <div className="text-xs text-muted-foreground mb-2">{post.read_time} min · {post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</div>
                    <h3 className="font-display text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {post.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>)}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
