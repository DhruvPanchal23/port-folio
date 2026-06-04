'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight, Briefcase } from 'lucide-react';

const socials = [
  { icon: Linkedin, href: 'https://linkedin.com/in/dhruv-panchal', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/dhruvpanchal', label: 'GitHub' },
  { icon: Mail, href: 'mailto:dhruvpanchal.dev@gmail.com', label: 'Mail' },
  { icon: Twitter, href: 'https://twitter.com/dhruvpanchal', label: 'X (Twitter)' },
];

const quickLinks = [
  { label: 'Uses', href: '/engine-room' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Recent Fav', href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Section 1: Main CTA */}
        <div className="py-16 md:py-20 border-b border-border">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              MY SITE
              <br />
              <span className="text-gradient">Explore, Connect</span>
              <br />
              <span className="text-muted-foreground text-2xl md:text-3xl">& Leave Your Mark</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              Explore, experiment && say hello
            </p>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="py-12 md:py-16 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Uses</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Check out my favorite tools and spots around the web.
              </p>
              <Link
                href="/engine-room"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Explore Tools
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Guestbook</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Let me know you were here!
              </p>
              <Link
                href="/guestbook"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Sign Guestbook
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Recent Favorite</h4>
              <p className="text-sm text-muted-foreground mb-2">
                I'm listening to
              </p>
              <p className="text-sm font-medium text-foreground mb-1">
                "Namastute"
              </p>
              <p className="text-xs text-muted-foreground">
                by Seedhe Maut from the album{' '}
                <a
                  href="https://open.spotify.com/album/namastute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Namastute
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Availability */}
        <div className="py-12 md:py-16 border-b border-border">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Open to Work</span>
            </div>
            <h3 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
              I'm available for full-time roles & freelance projects.
            </h3>
            <p className="text-muted-foreground mb-6">
              I thrive on crafting dynamic web applications, and delivering seamless user experiences.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase size={14} />
                Full Stack Developer
              </span>
              <span>•</span>
              <span>Remote Available</span>
            </div>
          </div>
        </div>

        {/* Section 4: Social Links */}
        <div className="py-8 border-b border-border">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label={label}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
            <Link
              href="/resume"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Resume
            </Link>
          </div>
        </div>

        {/* Section 5: Copyright */}
        <div className="py-6 text-center">
          <p className="text-xs text-muted-foreground mb-1">
            Current Version: 1.0 | Last Updated: July 2025
          </p>
          <p className="text-xs text-muted-foreground">
            © {year} Dhruv Panchal • Crafted with Coffee, Playlists & Curiosity.
          </p>
        </div>
      </div>
    </footer>
  );
}
