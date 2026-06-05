'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const STATUS_MESSAGES = [
  'Brewing ideas...',
  'Writing drafts...',
  'Collecting insights...',
  'Debugging thoughts...',
  'Shipping stories...',
];

const STATS = [
  { value: '∞', label: 'Cups of coffee consumed' },
  { value: '101+', label: 'Ideas in the pipeline' },
  { value: 'Soon™', label: 'Launch timeline' },
];

export default function BlogEmptyState() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="mb-10 flex items-center gap-3 border-b border-border pb-5">
        <span className="font-mono-custom text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          /drafts
        </span>
        <span className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 min-w-[168px] justify-end">
          <span className="font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground">
            status
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="relative h-4 w-[132px] font-mono-custom text-[11px] text-primary">
            <AnimatePresence mode="wait">
              <motion.span
                key={statusIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0 truncate"
              >
                {STATUS_MESSAGES[statusIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 mb-14">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-primary">
              Notebook
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
            Coming Soon
          </h2>
        </div>

        <div className="space-y-4 text-muted-foreground leading-relaxed lg:pt-8">
          <p>
            I&apos;m brewing up some thoughtful content about development, design, and the beautiful
            chaos of creating digital experiences.
          </p>
          <p>
            In the meantime, feel free to{' '}
            <Link
              href="/work"
              className="text-foreground font-medium link-underline hover:text-primary transition-colors inline-flex items-center gap-0.5"
            >
              explore my work
              <ArrowUpRight size={12} className="text-primary" />
            </Link>{' '}
            or{' '}
            <Link
              href="/connect"
              className="text-foreground font-medium link-underline hover:text-primary transition-colors inline-flex items-center gap-0.5"
            >
              reach out for a chat
              <ArrowUpRight size={12} className="text-primary" />
            </Link>
            !
          </p>
        </div>
      </div>

      <div className="mb-14 max-w-2xl border-l border-primary/25 pl-5 md:pl-6">
        <p className="font-mono-custom text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
          // notify
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Want to be notified when I publish?
        </p>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 font-mono-custom text-xs uppercase tracking-wider text-muted-foreground/80 cursor-not-allowed"
        >
          <span className="text-primary/70">→</span>
          Newsletter coming soon ☕
        </button>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-border pt-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
            className="min-w-[140px]"
          >
            <div className="font-display text-2xl md:text-3xl font-bold text-foreground leading-none mb-1.5">
              {stat.value}
            </div>
            <div className="font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground leading-snug max-w-[160px]">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
