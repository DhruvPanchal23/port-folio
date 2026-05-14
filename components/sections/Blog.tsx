'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/supabase';

const PLACEHOLDER_POSTS: BlogPost[] = [
  {
    id: '1', title: 'The Hidden Cost of Unoptimized Web Performance', slug: 'web-performance-cost',
    excerpt: 'Every 100ms of latency costs you conversions. Here\'s a deep dive into the techniques I use to achieve 95+ Lighthouse scores on complex applications.',
    content: '', cover_image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Engineering', tags: ['Performance', 'Next.js', 'Optimization'], status: 'published', read_time: 8,
    seo_title: '', seo_description: '', og_image: '', published_at: '2024-12-01', created_at: '', updated_at: '',
  },
  {
    id: '2', title: 'Design Systems Are Team Infrastructure', slug: 'design-systems-infrastructure',
    excerpt: 'Why investing in a proper design system is the highest-ROI decision a scaling product team can make, and how to build one that actually gets adopted.',
    content: '', cover_image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Design', tags: ['Design Systems', 'Figma', 'React'], status: 'published', read_time: 12,
    seo_title: '', seo_description: '', og_image: '', published_at: '2024-11-15', created_at: '', updated_at: '',
  },
  {
    id: '3', title: 'Building Secure APIs: What Most Tutorials Get Wrong', slug: 'secure-apis',
    excerpt: 'A security-first approach to API design that goes beyond JWT tokens and HTTPS. The vulnerabilities that actually get companies breached.',
    content: '', cover_image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Security', tags: ['Security', 'API', 'Backend'], status: 'published', read_time: 15,
    seo_title: '', seo_description: '', og_image: '', published_at: '2024-10-28', created_at: '', updated_at: '',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30',
  Design: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/30',
  Security: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30',
};

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 overflow-hidden"
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <motion.img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[post.category] || 'text-muted-foreground bg-muted'}`}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {post.read_time} min read
          </span>
          <span>·</span>
          <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <h3 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="group/link inline-flex items-center gap-1 text-xs font-medium text-primary"
          >
            Read more
            <ArrowUpRight size={11} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog({ posts }: { posts?: BlogPost[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const displayPosts = posts || PLACEHOLDER_POSTS;

  return (
    <section id="blog" className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />

      <div className="container-max relative z-10" ref={ref}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-px bg-primary" />
              <span className="text-xs font-mono-custom text-primary tracking-widest uppercase">Insights</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight"
            >
              Thoughts on
              <span className="text-gradient block">craft & technology.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              All Articles
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
