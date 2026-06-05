'use client';

import { motion } from 'framer-motion';
import {
  Coffee,
  ArrowUpRight,
  FileText,
  MessageSquare,
  Sparkles,
  Linkedin,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { usePortfolioSettingsContext } from '@/components/providers/PortfolioSettingsProvider';
import { getFeaturedLinks, getSecondarySocialLinks } from '@/lib/social-links';
import { getMailtoUrl } from '@/lib/portfolio-settings';

type Link = {
  icon: LucideIcon;
  title: string;
  handle: string;
  description: string;
  url: string;
  accent: string;
  featured?: boolean;
};

const ACCENTS = [
  'from-foreground/20 to-foreground/5',
  'from-sky-500/30 to-blue-700/10',
  'from-primary/30 to-cyan-500/10',
  'from-sky-400/20 to-cyan-500/5',
  'from-violet-500/20 to-fuchsia-500/5',
  'from-amber-500/20 to-orange-500/5',
];

const onSite: Link[] = [
  {
    icon: FileText,
    title: 'Resume',
    handle: '/resume',
    description: 'Skills, experience, projects — the formal pitch.',
    url: '/resume',
    accent: 'from-amber-500/20 to-orange-500/5',
  },
  {
    icon: Sparkles,
    title: 'Engine Room',
    handle: '/engine-room',
    description: 'The tools, gear, and apps I use daily.',
    url: '/engine-room',
    accent: 'from-emerald-500/20 to-teal-500/5',
  },
  {
    icon: MessageSquare,
    title: 'Guestbook',
    handle: '/guestbook',
    description: 'Sign in, leave a mark, become part of the wall.',
    url: '/guestbook',
    accent: 'from-rose-500/20 to-pink-500/5',
  },
  {
    icon: MessageSquare,
    title: 'Feedback',
    handle: '/feedback',
    description: 'Spot a typo? Have a wild idea? Tell me.',
    url: '/feedback',
    accent: 'from-indigo-500/20 to-violet-500/5',
  },
];

function toLinkCard(item: ReturnType<typeof getFeaturedLinks>[number], i: number, featured = false): Link {
  return {
    icon: item.icon,
    title: item.label,
    handle: item.handle || item.label,
    description: item.description || '',
    url: item.href,
    accent: ACCENTS[i % ACCENTS.length],
    featured,
  };
}

function LinkCard({ link, i, large = false }: { link: Link; i: number; large?: boolean }) {
  const Icon = link.icon;
  const isExternal = link.url.startsWith('http') || link.url.startsWith('mailto:');
  return (
    <motion.a
      href={link.url}
      target={isExternal && !link.url.startsWith('mailto:') ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.45 }}
      whileHover={{ y: -4 }}
      data-testid={`links-card-${link.title.toLowerCase().replace(/\s|\//g, '-')}`}
      className={`group relative flex overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 ${
        large ? 'p-6 md:p-7' : 'p-5'
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${link.accent} opacity-30 transition-opacity group-hover:opacity-60`}
      />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />

      <div className="relative flex w-full items-center gap-4">
        <div
          className={`flex flex-shrink-0 items-center justify-center rounded-xl border border-border bg-background/50 backdrop-blur-sm transition-all group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary ${
            large ? 'h-14 w-14' : 'h-11 w-11'
          }`}
        >
          <Icon size={large ? 22 : 18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-display font-bold text-foreground group-hover:text-primary transition-colors ${
                large ? 'text-lg' : 'text-base'
              }`}
            >
              {link.title}
            </h3>
            <span className="font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground/70 truncate">
              {link.handle}
            </span>
          </div>
          <p
            className={`mt-0.5 text-muted-foreground leading-snug truncate ${
              large ? 'text-sm' : 'text-xs'
            }`}
          >
            {link.description}
          </p>
        </div>
        <ArrowUpRight
          size={16}
          className="flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
        />
      </div>
    </motion.a>
  );
}

export default function LinksPage() {
  const { settings } = usePortfolioSettingsContext();
  const { social } = settings;

  const featured = getFeaturedLinks(social).map((item, i) => toLinkCard(item, i, true));
  const socialLinks = getSecondarySocialLinks(social).map((item, i) => toLinkCard(item, i + 3));

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container-max max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-primary">
              All my links
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-5">
            One page,<br /> every <span className="text-gradient">door.</span>
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-xl leading-relaxed">
            Pick whichever rabbit hole you&apos;re in the mood for. They all lead back to me.
          </p>
        </motion.div>

        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-mono-custom text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              ⭐ Featured
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {featured.map((l, i) => (
                <LinkCard key={l.title} link={l} i={i} large />
              ))}
            </div>
          </section>
        )}

        {socialLinks.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-mono-custom text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              ✦ Around the web
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {socialLinks.map((l, i) => (
                <LinkCard key={`${l.title}-${i}`} link={l} i={i} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="mb-4 font-mono-custom text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            ⌂ On this site
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {onSite.map((l, i) => (
              <LinkCard key={l.title} link={l} i={i} />
            ))}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-card p-8 md:p-10"
        >
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Coffee size={14} className="text-primary" />
                <span className="font-mono-custom text-xs uppercase tracking-wider text-muted-foreground">
                  Coffee&apos;s on me
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Want the fastest way<br className="hidden md:block" /> to reach me?
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {social.email && (
                <a
                  href={getMailtoUrl(social.email)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03] active:scale-95"
                  data-testid="links-quick-email"
                >
                  <Mail size={15} /> Email me
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted/50"
                >
                  <Linkedin size={15} /> Connect
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
