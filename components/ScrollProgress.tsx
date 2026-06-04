'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/use-scroll';

export default function ScrollProgress() {
  const scrollProgress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
      style={{
        scaleX: scrollProgress,
        transformOrigin: '0%',
      }}
    />
  );
}
