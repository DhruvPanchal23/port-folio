'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const steps = [0, 20, 45, 70, 88, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-lines opacity-30" />

          {/* Animated orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-12"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg ring-1 ring-white/10">
              AR
            </div>
          </motion.div>

          {/* Progress */}
          <div className="relative w-48">
            <div className="flex justify-between text-xs text-muted-foreground mb-2 font-mono-custom">
              <span>Loading</span>
              <motion.span
                key={progress}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {progress}%
              </motion.span>
            </div>
            <div className="h-0.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-10 text-xs text-muted-foreground font-mono-custom tracking-widest"
          >
            CRAFTING YOUR EXPERIENCE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
