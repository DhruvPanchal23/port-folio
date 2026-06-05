'use client';

import { motion } from 'framer-motion';

const WELCOME_SEGMENT =
  'Hello • Namaskar • Namaste • स्वस्थस्य स्वागतं • নমস্কার • Hallo • Bonjour • Привет • مرحباً • કેમ છો?   ·   ';

type Props = {
  variant?: 'inline' | 'floating';
};

export default function MultilingualWelcomeTicker({ variant = 'floating' }: Props) {
  const wrapperClass =
    variant === 'floating'
      ? 'absolute -top-11 left-0 right-0 z-20 w-full'
      : 'mb-8 w-full max-w-md';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={wrapperClass}
      data-testid="hero-welcome-ticker"
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="group pointer-events-auto relative w-full overflow-hidden rounded-xl border border-primary/25 bg-card/75 px-1 py-2 shadow-lg shadow-primary/10 backdrop-blur-xl [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -inset-px rounded-xl bg-primary/10 opacity-40 blur-md"
          aria-hidden
        />

        <div className="relative flex w-max animate-welcome-ticker group-hover:[animation-play-state:paused] will-change-transform">
          <span className="shrink-0 px-4 font-mono-custom text-[11px] tracking-[0.12em] text-foreground/85 whitespace-nowrap">
            {WELCOME_SEGMENT}
          </span>
          <span
            className="shrink-0 px-4 font-mono-custom text-[11px] tracking-[0.12em] text-foreground/85 whitespace-nowrap"
            aria-hidden
          >
            {WELCOME_SEGMENT}
          </span>
        </div>

        <span className="sr-only">{WELCOME_SEGMENT}</span>
      </motion.div>
    </motion.div>
  );
}
