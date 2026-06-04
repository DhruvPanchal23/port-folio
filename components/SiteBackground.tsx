'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Global immersive background: soft gradient field + lightweight canvas node links.
 * Sits behind site content; pointer-events none.
 */
export default function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Pt = { x: number; y: number; vx: number; vy: number };
    let pts: Pt[] = [];

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(48, Math.floor((w * h) / 45000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '220 90% 56%';

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      });

      const maxDist = Math.min(w, h) * 0.14;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const a = 1 - d / maxDist;
            ctx.strokeStyle = `hsl(${primary} / ${0.06 + a * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        ctx.fillStyle = `hsl(${primary} / 0.32)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dot-grid opacity-[0.35] dark:opacity-[0.22]" />
      <div className="absolute inset-0 grid-lines opacity-[0.12] dark:opacity-[0.18]" />

      <motion.div
        className="absolute -left-[20%] top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-primary/[0.07] blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[0%] h-[60vmin] w-[60vmin] rounded-full bg-primary/[0.05] blur-[90px]"
        animate={{ x: [0, -35, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-[45vmin] w-[45vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[80px] dark:bg-blue-400/[0.06]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80 dark:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
    </div>
  );
}
