'use client';

import { motion } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            101 errors?
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Nah, just ideas brewing with a sip of coffee.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-12 text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Coffee className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Coming Soon
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            I'm brewing up some thoughtful content about development, design, and the beautiful 
            chaos of creating digital experiences.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            In the meantime, feel free to explore my work or reach out for a chat!
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
            Currently brewing
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8"
        >
          <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">
            Want to be notified when I publish?
          </h3>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled
              />
              <button
                className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium cursor-not-allowed"
                disabled
              >
                Soon
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Newsletter coming soon ☕
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          <div>
            <div className="flex items-center justify-center gap-2 text-3xl font-display font-bold text-foreground mb-1">
              <span className="text-4xl">∞</span>
            </div>
            <p className="text-sm text-muted-foreground">Cups of coffee consumed</p>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-foreground mb-1">101+</div>
            <p className="text-sm text-muted-foreground">Ideas in the pipeline</p>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-foreground mb-1">Soon™</div>
            <p className="text-sm text-muted-foreground">Launch timeline</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
