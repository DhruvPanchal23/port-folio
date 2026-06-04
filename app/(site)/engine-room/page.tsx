'use client';

import { motion } from 'framer-motion';
import { Monitor, Code2, Palette, Coffee, Headphones, Chrome, Terminal } from 'lucide-react';

const tools = [
  {
    category: 'Development',
    icon: Code2,
    items: [
      { name: 'Visual Studio Code', description: 'Primary code editor', url: 'https://code.visualstudio.com' },
      { name: 'Next.js', description: 'React framework', url: 'https://nextjs.org' },
      { name: 'TypeScript', description: 'Type-safe JavaScript', url: 'https://typescriptlang.org' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS framework', url: 'https://tailwindcss.com' },
      { name: 'Git & GitHub', description: 'Version control', url: 'https://github.com' },
      { name: 'Vercel', description: 'Deployment platform', url: 'https://vercel.com' },
    ],
  },
  {
    category: 'Design',
    icon: Palette,
    items: [
      { name: 'Figma', description: 'Interface design & prototyping', url: 'https://figma.com' },
      { name: 'Adobe Creative Suite', description: 'Graphics & photo editing', url: 'https://adobe.com' },
      { name: 'Framer Motion', description: 'React animations', url: 'https://framer.com/motion' },
      { name: 'Shadcn/ui', description: 'Component library', url: 'https://ui.shadcn.com' },
    ],
  },
  {
    category: 'Productivity',
    icon: Monitor,
    items: [
      { name: 'Notion', description: 'Notes & project management', url: 'https://notion.so' },
      { name: 'Linear', description: 'Issue tracking', url: 'https://linear.app' },
      { name: 'Raycast', description: 'macOS productivity launcher', url: 'https://raycast.com' },
      { name: 'Arc Browser', description: 'Web browser', url: 'https://arc.net' },
    ],
  },
  {
    category: 'Hardware',
    icon: Monitor,
    items: [
      { name: 'MacBook Pro M2', description: '16-inch, 32GB RAM' },
      { name: 'LG UltraWide Monitor', description: '34-inch curved display' },
      { name: 'Mechanical Keyboard', description: 'Keychron K8 Pro' },
      { name: 'Sony WH-1000XM5', description: 'Noise-cancelling headphones' },
    ],
  },
];

const currentlyListening = {
  track: 'Namastute',
  artist: 'Seedhe Maut',
  album: 'Namastute',
  url: 'https://open.spotify.com/album/namastute',
};

export default function EngineRoomPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Engine Room
          </h1>
          <p className="text-xl text-muted-foreground">
            The tools & gear that power my work
          </p>
        </motion.div>

        {/* Currently Listening */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-12 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Currently Listening</p>
              <p className="font-display text-xl font-bold text-foreground">
                {currentlyListening.track}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentlyListening.artist} •{' '}
                <a
                  href={currentlyListening.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {currentlyListening.album}
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="space-y-12">
          {tools.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {section.category}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((tool, i) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {tool.url ? (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass rounded-xl p-6 block hover:border-primary/50 transition-all duration-300 group"
                        >
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </a>
                      ) : (
                        <div className="glass rounded-xl p-6">
                          <h3 className="font-semibold text-foreground mb-2">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coffee Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass rounded-2xl p-12 text-center"
        >
          <Coffee className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Powered by Coffee
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            ∞ cups consumed and counting...
          </p>
          <p className="text-sm text-muted-foreground">
            Because great code doesn't write itself at 3 AM ☕
          </p>
        </motion.div>
      </div>
    </div>
  );
}
