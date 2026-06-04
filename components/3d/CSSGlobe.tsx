'use client';

import { motion } from 'framer-motion';

export default function CSSGlobe() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
      {/* Outer glow */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-96 h-96 rounded-full bg-primary/20 blur-3xl"
      />

      {/* Main globe */}
      <div className="relative">
        {/* Globe sphere */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden"
        >
          {/* Grid lines */}
          <div className="absolute inset-0">
            {/* Horizontal lines */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 border-t border-primary/20"
                style={{ top: `${(i + 1) * 12.5}%` }}
              />
            ))}
            {/* Vertical lines */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 border-l border-primary/20"
                style={{ left: `${(i + 1) * 8.33}%` }}
              />
            ))}
          </div>

          {/* Continents */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            {/* Simplified continent shapes */}
            <path
              d="M 30 20 Q 35 15 40 20 L 45 25 L 40 30 Z"
              fill="currentColor"
              className="text-primary/40"
            />
            <path
              d="M 60 35 Q 65 30 70 35 L 75 45 L 70 50 L 60 45 Z"
              fill="currentColor"
              className="text-primary/40"
            />
            <path
              d="M 25 55 Q 30 50 35 55 L 40 65 L 30 70 Z"
              fill="currentColor"
              className="text-primary/40"
            />
          </svg>

          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-full" />
        </motion.div>

        {/* Country markers */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0"
        >
          {/* UK */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
          />
          {/* India */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            className="absolute top-1/2 right-1/3 w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
          />
          {/* USA */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
            className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"
          />
        </motion.div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            d="M 80 60 Q 150 100 220 140"
            stroke="url(#gradient1)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M 220 140 Q 180 200 140 240"
            stroke="url(#gradient2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting particles */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/60"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateX(150px)`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
