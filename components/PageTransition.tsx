'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Lightweight page transition that fades in new content.
 *
 * Storing RSC children in client component state (e.g. useState(children))
 * is incompatible with Next.js App Router client routing. It captures RSC
 * elements in state, causing React to treat them as async Client Components,
 * which triggers React Error #482 on static routes during navigation.
 *
 * Instead, we render children directly and use pathname as a key on motion.div
 * to trigger the entry transition on route changes.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[50vh]"
    >
      {children}
    </motion.div>
  );
}

