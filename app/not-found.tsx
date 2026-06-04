'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      
      {/* Animated elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"
      />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* 404 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-9xl md:text-[12rem] font-bold text-gradient leading-none">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Lost, this page is.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              In another system, it may be.
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              The page you're looking for seems to have drifted into hyperspace. 
              Perhaps it was moved, deleted, or you mistyped the URL.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              <Home size={18} />
              Take Me Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 text-sm"
          >
            <div>
              <div className="text-2xl font-display font-bold text-foreground mb-1">∞</div>
              <div className="text-muted-foreground">Possible URLs</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-foreground mb-1">1</div>
              <div className="text-muted-foreground">You Found</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-foreground mb-1">0</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <span>•</span>
          <Link href="/work" className="hover:text-foreground transition-colors">Work</Link>
          <span>•</span>
          <Link href="/connect" className="hover:text-foreground transition-colors">Connect</Link>
        </div>
        <p className="text-xs text-muted-foreground italic">
          "May the force be with you... and better navigation skills too."
        </p>
      </motion.div>
    </div>
  );
}
