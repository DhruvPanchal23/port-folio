'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Lightweight page transition that fades in new content
 * without unmounting/re-mounting via AnimatePresence key.
 *
 * AnimatePresence mode="wait" with key={pathname} is incompatible
 * with Next.js 13 App Router's RSC streaming — it forces React
 * to unmount the old tree and triggers an infinite RSC re-fetch loop.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    // When pathname changes, briefly fade out then update content
    setTransitioning(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitioning(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Also update children when they change for the same route
  useEffect(() => {
    if (!transitioning) {
      setDisplayChildren(children);
    }
  }, [children, transitioning]);

  return (
    <motion.div
      animate={{ opacity: transitioning ? 0 : 1, y: transitioning ? 8 : 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[50vh]"
    >
      {displayChildren}
    </motion.div>
  );
}
