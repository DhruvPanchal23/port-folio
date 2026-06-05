'use client';

import { motion } from 'framer-motion';

type Node = {
  id: string;
  x: number;
  y: number;
  primary?: boolean;
};

const NODES: Node[] = [
  { id: 'india', x: 58, y: 52, primary: true },
  { id: 'london', x: 44, y: 30 },
  { id: 'sf', x: 22, y: 36 },
  { id: 'berlin', x: 50, y: 28 },
  { id: 'singapore', x: 66, y: 56 },
];

const ROUTES: [string, string][] = [
  ['india', 'london'],
  ['india', 'sf'],
  ['india', 'berlin'],
  ['india', 'singapore'],
  ['london', 'berlin'],
  ['london', 'sf'],
  ['berlin', 'singapore'],
  ['sf', 'singapore'],
];

const PARALLELS = [-70, -50, -30, -10, 10, 30, 50, 70];
const MERIDIANS = Array.from({ length: 12 }, (_, i) => i * 15);

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function routePath(a: Node, b: Node) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 14;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function WireframeLayer({ opacity = 1 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', opacity }}>
      {PARALLELS.map((lat) => {
        const w = Math.abs(Math.cos((lat * Math.PI) / 180)) * 100;
        return (
          <div
            key={`lat-${lat}`}
            className="absolute inset-0"
            style={{ transform: `rotateX(${lat}deg)`, transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute left-1/2 top-1/2 rounded-full border border-primary/20"
              style={{
                width: `${w}%`,
                height: `${w}%`,
                transform: 'translate(-50%, -50%) rotateX(90deg) scaleY(0.34)',
              }}
            />
          </div>
        );
      })}
      {MERIDIANS.map((lon) => (
        <div
          key={`lon-${lon}`}
          className="absolute inset-0"
          style={{ transform: `rotateY(${lon}deg)`, transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-full w-full rounded-full border border-primary/15"
            style={{ transform: 'translate(-50%, -50%) scaleX(0.34)' }}
          />
        </div>
      ))}
    </div>
  );
}

export default function CSSGlobe() {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center md:h-[600px]">
      <motion.div
        animate={{ opacity: [0.25, 0.42, 0.25], scale: [1, 1.06, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-primary/15 blur-3xl md:h-96 md:w-96"
      />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
        style={{ perspective: '1000px' }}
      >
        <div
          className="pointer-events-none absolute -inset-[14%] rounded-full"
          style={{
            background:
              'radial-gradient(circle, transparent 58%, hsl(var(--primary) / 0.07) 72%, hsl(var(--primary) / 0.14) 82%, transparent 100%)',
          }}
        />

        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 72, repeat: Infinity, ease: 'linear' }}
          className="relative h-[280px] w-[280px] md:h-[320px] md:w-[320px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 32% 26%, hsl(var(--foreground) / 0.07), transparent 42%),
                radial-gradient(circle at 68% 72%, hsl(var(--primary) / 0.1), transparent 48%),
                radial-gradient(circle at 50% 50%, hsl(var(--card) / 0.55) 0%, hsl(var(--background) / 0.92) 68%, hsl(var(--background)) 100%)
              `,
              border: '1px solid hsl(var(--primary) / 0.22)',
              boxShadow: `
                inset 0 0 48px hsl(var(--primary) / 0.06),
                inset -12px -18px 36px hsl(var(--background) / 0.85),
                0 0 48px hsl(var(--primary) / 0.1)
              `,
              backdropFilter: 'blur(2px)',
            }}
          />

          <WireframeLayer opacity={0.9} />

          <motion.div
            animate={{ rotateY: -360 }}
            transition={{ duration: 96, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[6%]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <WireframeLayer opacity={0.35} />
          </motion.div>

          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 28% 22%, hsl(var(--foreground) / 0.12), transparent 38%)',
            }}
          />

          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <defs>
              <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="45%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ROUTES.map(([from, to], i) => (
              <motion.path
                key={`${from}-${to}`}
                d={routePath(nodeById(from), nodeById(to))}
                fill="none"
                stroke="url(#route-grad)"
                strokeWidth="0.35"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0.15, 1, 0.15],
                  opacity: [0.15, 0.55, 0.15],
                }}
                transition={{
                  duration: 5 + (i % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.35,
                }}
              />
            ))}
          </svg>

          {NODES.map((node, i) => (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: node.primary ? [1, 1.35, 1] : [1, 1.2, 1],
                opacity: node.primary ? [0.75, 1, 0.75] : [0.45, 0.85, 0.45],
              }}
              transition={{
                duration: node.primary ? 2.4 : 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              {node.primary && (
                <span
                  className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-sm"
                  aria-hidden
                />
              )}
              <span
                className={`relative block rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.55)] ${
                  node.primary ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5'
                }`}
              />
              {node.primary && (
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono-custom text-[8px] uppercase tracking-wider text-primary/70">
                  BLR
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 rounded-full border border-primary/10"
          style={{
            boxShadow: '0 0 32px hsl(var(--primary) / 0.12), 0 0 64px hsl(var(--primary) / 0.06)',
          }}
        />
      </motion.div>
    </div>
  );
}
