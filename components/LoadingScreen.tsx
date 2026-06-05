'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function getLoadProgress(): number {
  if (typeof document === 'undefined') return 0;
  switch (document.readyState) {
    case 'complete':
      return 100;
    case 'interactive':
      return 72;
    default:
      return 28;
  }
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setProgress(getLoadProgress());
    sync();

    const finish = () => {
      setProgress(100);
      setVisible(false);
    };

    document.addEventListener('readystatechange', sync);

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    return () => {
      document.removeEventListener('readystatechange', sync);
      window.removeEventListener('load', finish);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading portfolio"
        >
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-20" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-10"
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/25 blur-xl scale-110" aria-hidden />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/40">
              DP
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-52"
          >
            <div className="h-px w-full overflow-hidden rounded-full bg-border/80">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-6 text-[11px] font-mono-custom tracking-[0.14em] text-muted-foreground/80"
          >
            Preparing pixels, logic &amp; story...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
