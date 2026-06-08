'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Briefcase, Wrench, MessageSquare, Disc3 } from 'lucide-react';
import { usePortfolioSettingsContext } from '@/components/providers/PortfolioSettingsProvider';
import { getFooterSocialLinks } from '@/lib/social-links';

const quickLinks = [
  { label: 'Uses', href: '/engine-room' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Recent Fav', href: '#' },
];

export default function Footer() {
  const { settings } = usePortfolioSettingsContext();
  const { site, social, profile } = settings;
  const socials = getFooterSocialLinks(social);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Section 1: Main CTA */}
        <div className="py-16 md:py-20 border-b border-border">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {site.footer_cta_title || 'MY SITE'}
              <br />
              <span className="text-gradient">{site.footer_cta_subtitle || 'Explore, Connect'}</span>
              <br />
              <span className="text-muted-foreground text-2xl md:text-3xl">& Leave Your Mark</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              {site.footer_content}
            </p>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="py-12 md:py-16 border-b border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Uses */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/40"
              data-testid="footer-card-uses"
            >
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 12 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 text-primary"
                  >
                    <Wrench size={15} />
                  </motion.div>
                  <h4 className="font-display text-base font-bold text-foreground">Uses</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Check out my favorite tools and spots around the web.
                </p>
                <Link
                  href="/engine-room"
                  className="group/cta inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                >
                  Explore tools
                  <ArrowUpRight size={14} className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Guestbook */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/40"
              data-testid="footer-card-guestbook"
            >
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 text-primary"
                  >
                    <MessageSquare size={15} />
                  </motion.div>
                  <h4 className="font-display text-base font-bold text-foreground">Guestbook</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Let me know you were here!
                </p>
                <Link
                  href="/guestbook"
                  className="group/cta inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                >
                  Sign guestbook
                  <ArrowUpRight size={14} className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Recent Favorite */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 sm:col-span-2 lg:col-span-1"
              data-testid="footer-card-recent"
            >
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 text-primary"
                  >
                    <Disc3 size={15} />
                  </motion.div>
                  <h4 className="font-display text-base font-bold text-foreground">Recent Favorite</h4>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono-custom text-[9px] uppercase tracking-wider text-primary">
                    <motion.span
                      animate={{ scaleY: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                      className="inline-block h-2 w-0.5 rounded-full bg-primary"
                    />
                    <motion.span
                      animate={{ scaleY: [1, 0.4, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
                      className="inline-block h-2 w-0.5 rounded-full bg-primary"
                    />
                    <motion.span
                      animate={{ scaleY: [0.6, 1, 0.6] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: 0.3 }}
                      className="inline-block h-2 w-0.5 rounded-full bg-primary"
                    />
                    playing
                  </span>
                </div>
                <p className="text-xs font-mono-custom uppercase tracking-wider text-muted-foreground mb-1.5">
                  I&apos;m listening to
                </p>
                <p className="text-sm font-medium text-foreground mb-1">&quot;Namastute&quot;</p>
                {social.spotify && (
                  <p className="text-xs text-muted-foreground">
                    <a
                      href={social.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Listen on Spotify
                    </a>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 3: Availability */}
        <div className="py-12 md:py-16 border-b border-border">
          <div className="text-center max-w-3xl mx-auto">
            {site.open_to_work && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Open to Work</span>
              </div>
            )}
            <h3 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
              {site.open_to_work_headline || site.availability_status}
            </h3>
            <p className="text-muted-foreground mb-6">
              {site.open_to_work_description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase size={14} />
                {profile.name}
              </span>
              <span>•</span>
              <span>{site.current_location}</span>
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
            Current Version: {site.current_version} | Last Updated: {site.last_updated}
          </p>
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            © {year} {profile.name} • {site.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
}
