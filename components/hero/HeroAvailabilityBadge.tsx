'use client';

import { motion } from 'framer-motion';

type Props = {
  status: string;
  variant?: 'inline' | 'floating';
};

export default function HeroAvailabilityBadge({ status, variant = 'inline' }: Props) {
  const pill = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 backdrop-blur-sm"
      data-testid="hero-status-pill"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-mono-custom uppercase tracking-wider text-muted-foreground">
        {status}
      </span>
    </motion.div>
  );

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 flex w-full justify-center"
        data-testid="hero-status-pill-floating"
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {pill}
        </motion.div>
      </motion.div>
    );
  }

  return <div className="mb-8">{pill}</div>;
}
