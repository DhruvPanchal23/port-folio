'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AboutGalleryItem } from '@/lib/types/about-gallery';

type CarouselItem = Pick<AboutGalleryItem, 'id' | 'title' | 'subtitle' | 'image_url'>;

type Props = {
  items: CarouselItem[];
  fallbackInitials?: string;
};

const AUTO_MS = 5000;

function wrapOffset(index: number, active: number, length: number) {
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function cardStyle(offset: number) {
  if (offset === 0) {
    return { x: 0, scale: 1, rotateZ: 0, opacity: 1, zIndex: 30 };
  }
  if (offset === -1) {
    return { x: -52, scale: 0.9, rotateZ: -5, opacity: 0.72, zIndex: 20 };
  }
  if (offset === 1) {
    return { x: 52, scale: 0.9, rotateZ: 5, opacity: 0.72, zIndex: 20 };
  }
  if (offset === -2) {
    return { x: -88, scale: 0.82, rotateZ: -7, opacity: 0.38, zIndex: 10 };
  }
  if (offset === 2) {
    return { x: 88, scale: 0.82, rotateZ: 7, opacity: 0.38, zIndex: 10 };
  }
  return { x: offset * 40, scale: 0.75, rotateZ: 0, opacity: 0, zIndex: 0 };
}

export default function AboutGalleryCarousel({ items, fallbackInitials = 'DP' }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const length = items.length;
  const hasMultiple = length > 1;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => (i + dir + length) % length);
    },
    [length]
  );

  useEffect(() => {
    if (!hasMultiple || paused) return;
    const timer = setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, paused, go, active]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!hasMultiple) return;
    if (info.offset.x < -48 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 48 || info.velocity.x > 400) go(-1);
  };

  if (length === 0) return null;

  return (
    <div
      className="relative flex w-full items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-testid="about-gallery-carousel"
    >
      <div className="relative h-80 w-full max-w-sm md:h-[22rem]">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const offset = wrapOffset(index, active, length);
            const style = cardStyle(offset);
            if (Math.abs(offset) > 2) return null;

            return (
              <motion.div
                key={item.id}
                layout
                drag={hasMultiple && offset === 0 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                style={{ zIndex: style.zIndex }}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  rotateZ: style.rotateZ,
                  opacity: style.opacity,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                onDragEnd={offset === 0 ? handleDragEnd : undefined}
                className="absolute left-1/2 top-1/2 h-72 w-64 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-black/25">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary/60">
                      <span className="font-display text-6xl font-bold text-primary-foreground/25">
                        {fallbackInitials}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                    {item.subtitle ? (
                      <p className="mt-1 text-xs font-mono-custom uppercase tracking-wider text-white/70">
                        {item.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-0 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-0 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-1.5">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to ${item.title}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-5 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
