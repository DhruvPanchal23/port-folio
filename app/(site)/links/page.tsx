'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Mail, Twitter, Globe, FileText, MessageSquare } from 'lucide-react';

const links = [
  {
    category: 'Featured',
    items: [
      {
        icon: Globe,
        title: 'Website',
        description: 'My personal portfolio website',
        url: 'https://dhruvpanchal.dev',
      },
      {
        icon: Linkedin,
        title: 'LinkedIn',
        description: 'Professional network & career updates',
        url: 'https://linkedin.com/in/dhruv-panchal',
      },
      {
        icon: Github,
        title: 'GitHub',
        description: 'Open source projects & contributions',
        url: 'https://github.com/dhruvpanchal',
      },
      {
        icon: Mail,
        title: 'Email',
        description: 'Direct communication for projects',
        url: 'mailto:dhruvpanchal.dev@gmail.com',
      },
      {
        icon: FileText,
        title: 'Resume',
        description: 'Download my latest resume',
        url: '/resume',
      },
    ],
  },
  {
    category: 'More',
    items: [
      {
        icon: Twitter,
        title: 'Twitter',
        description: 'Thoughts, tech updates & random musings',
        url: 'https://twitter.com/dhruvpanchal',
      },
      {
        icon: Globe,
        title: 'Projects',
        description: 'Showcase of my development work',
        url: '/work',
      },
      {
        icon: MessageSquare,
        title: 'Guestbook',
        description: 'Leave a message for me',
        url: '/guestbook',
      },
      {
        icon: MessageSquare,
        title: 'Feedback',
        description: 'Help me improve my website',
        url: '/feedback',
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            All Links
          </h1>
          <p className="text-xl text-muted-foreground">
            Find me across the web
          </p>
        </motion.div>

        {/* Links */}
        <div className="space-y-12">
          {links.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((link, i) => {
                  const Icon = link.icon;
                  const isExternal = link.url.startsWith('http');
                  const LinkComponent = isExternal ? 'a' : 'a';
                  
                  return (
                    <motion.div
                      key={link.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sectionIndex * 0.1 + i * 0.05 }}
                    >
                      <LinkComponent
                        href={link.url}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="group glass rounded-xl p-6 flex items-center gap-4 hover:border-primary/50 transition-all duration-300 block"
                      >
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                        </div>
                        <ExternalLink
                          size={18}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </LinkComponent>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 glass rounded-2xl p-8 text-center"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Quick Contact
          </h2>
          <p className="text-muted-foreground mb-6">
            Need to reach me quickly? Here are the best ways
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:dhruvpanchal.dev@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Mail size={16} />
              Email Me
            </a>
            <a
              href="https://linkedin.com/in/dhruv-panchal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
