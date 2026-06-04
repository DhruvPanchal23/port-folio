'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import {
  ExternalLink,
  Github,
  Lock,
  ArrowUpRight,
  Star,
} from 'lucide-react';

type Project = {
  id: string;
  number: string;
  type: 'Web App' | 'Security Tool' | 'UI/UX';
  title: string;
  description: string;
  tagline: string;
  tech: string[];
  github: string | null;
  live: string | null;
  isPrivate: boolean;
  year: string;
  status: 'Shipped' | 'Live' | 'Archived' | 'Building';
  featured?: boolean;
  /** Tailwind gradient for the preview */
  preview: { from: string; via?: string; to: string; emoji: string };
  metrics?: { label: string; value: string }[];
};

const projects: Project[] = [
  {
    id: 'cinematica',
    number: '01',
    type: 'Web App',
    title: 'Cinematica',
    tagline: 'A film journal for serious cinephiles.',
    description:
      'Invite-only film journaling platform with letterboxd-style logging, mood-based tagging, and a private discovery feed for tastemakers.',
    tech: ['Next.js 14', 'TypeScript', 'Supabase', 'Tailwind', 'Framer Motion'],
    github: null,
    live: null,
    isPrivate: true,
    year: '2026',
    status: 'Building',
    featured: true,
    preview: { from: 'from-cyan-500/30', via: 'via-blue-500/20', to: 'to-violet-500/30', emoji: '🎬' },
    metrics: [
      { label: 'Beta users', value: '120+' },
      { label: 'Lighthouse', value: '98' },
      { label: 'TTI', value: '1.1s' },
    ],
  },
  {
    id: 'personal-portfolio',
    number: '02',
    type: 'Web App',
    title: 'This Portfolio',
    tagline: 'Meta? A little. But it ships.',
    description:
      'The site you’re reading right now. Multi-page architecture, Supabase-powered guestbook & feedback, an admin panel, and a custom theme studio.',
    tech: ['Next.js 14', 'TypeScript', 'Tailwind', 'Supabase', 'Framer Motion'],
    github: 'https://github.com/dhruvpanchal/portfolio',
    live: 'https://dhruvpanchal.dev',
    isPrivate: false,
    year: '2026',
    status: 'Live',
    featured: true,
    preview: { from: 'from-primary/30', via: 'via-cyan-500/20', to: 'to-emerald-500/20', emoji: '✦' },
    metrics: [
      { label: 'Performance', value: '95+' },
      { label: 'Accessibility', value: '100' },
      { label: 'SEO', value: '100' },
    ],
  },
  {
    id: 'hospital-management',
    number: '03',
    type: 'Web App',
    title: 'Hospital Management System',
    tagline: 'Patient records, appointments & PDF reports.',
    description:
      'End-to-end management platform built for a regional hospital — covered patient onboarding, scheduling, billing, and TCPDF-driven discharge summaries.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'TCPDF', 'HTML'],
    github: null,
    live: null,
    isPrivate: true,
    year: '2023',
    status: 'Shipped',
    preview: { from: 'from-sky-500/30', to: 'to-blue-700/20', emoji: '🏥' },
    metrics: [
      { label: 'Users', value: '500+' },
      { label: 'Appointments', value: '2k+' },
    ],
  },
  {
    id: 'netflix-clone',
    number: '04',
    type: 'Web App',
    title: 'Netflix UI Clone',
    tagline: 'A faithful, pixel-accurate study.',
    description:
      'Built primarily as a deep-dive into Netflix’s layout system, lazy media loading, and auth flows. Uses MovieDB for content.',
    tech: ['React', 'Firebase', 'MovieDB API', 'CSS3'],
    github: 'https://github.com/dhruvpanchal/netflix-clone',
    live: 'https://netflix-clone-dp.vercel.app',
    isPrivate: false,
    year: '2024',
    status: 'Shipped',
    preview: { from: 'from-red-500/30', to: 'to-rose-700/20', emoji: '🎥' },
  },
  {
    id: 'arp-detector',
    number: '05',
    type: 'Security Tool',
    title: 'ARP Spoofing Detector',
    tagline: 'Real-time network intrusion detection.',
    description:
      'Lightweight Python tool that monitors the local network for ARP cache poisoning and surfaces alerts via a Tk-based dashboard.',
    tech: ['Python', 'Scapy', 'Tkinter', 'Networking'],
    github: null,
    live: null,
    isPrivate: true,
    year: '2023',
    status: 'Archived',
    preview: { from: 'from-amber-500/30', to: 'to-orange-700/20', emoji: '🛡️' },
  },
  {
    id: 'ecommerce-dashboard',
    number: '06',
    type: 'UI/UX',
    title: 'E-Commerce Admin Dashboard',
    tagline: 'A design system for online retailers.',
    description:
      'Figma-first dashboard design: analytics, inventory, orders, refunds. Includes a 40-component design system with light/dark variants.',
    tech: ['Figma', 'Design System', 'Prototyping', 'Auto Layout'],
    github: null,
    live: 'https://figma.com/file/ecommerce-dashboard',
    isPrivate: false,
    year: '2024',
    status: 'Live',
    preview: { from: 'from-violet-500/30', to: 'to-fuchsia-600/20', emoji: '📊' },
  },
];

const categories = ['All', 'Web App', 'Security Tool', 'UI/UX'] as const;

function StatusBadge({ status }: { status: Project['status'] }) {
  const map: Record<Project['status'], { dot: string; text: string }> = {
    Live: { dot: 'bg-emerald-500', text: 'text-emerald-500' },
    Shipped: { dot: 'bg-primary', text: 'text-primary' },
    Building: { dot: 'bg-amber-400', text: 'text-amber-400' },
    Archived: { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 backdrop-blur-sm">
      <span className={`relative flex h-1.5 w-1.5`}>
        {status === 'Building' && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${map[status].dot} opacity-75`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${map[status].dot}`} />
      </span>
      <span className={`font-mono-custom text-[10px] uppercase tracking-wider ${map[status].text}`}>
        {status}
      </span>
    </span>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: (i % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card/40 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 overflow-hidden"
      data-testid={`project-card-${p.id}`}
    >
      {/* Preview */}
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.preview.from} ${p.preview.via ?? ''} ${p.preview.to}`}
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 grid-lines opacity-30 mix-blend-overlay" />
        {/* Animated emoji glyph */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="font-display text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
            {p.preview.emoji}
          </span>
        </motion.div>

        {/* Top-left meta */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="rounded-md border border-border bg-background/70 px-2 py-1 font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-md">
            {p.number} · {p.type}
          </span>
        </div>
        {/* Top-right status */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {p.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-1 backdrop-blur-md">
              <Star size={10} className="text-primary fill-primary" />
              <span className="font-mono-custom text-[10px] uppercase tracking-wider text-primary">
                Featured
              </span>
            </span>
          )}
          <StatusBadge status={p.status} />
        </div>

        {/* Bottom gradient + private lock */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card/95 to-transparent" />
        {p.isPrivate && (
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-mono-custom uppercase tracking-wider text-muted-foreground backdrop-blur-md">
            <Lock size={10} />
            Private
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {p.title}
          </h3>
          <span className="font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground/80">
            {p.year}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground/80 mb-2">{p.tagline}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.description}</p>

        {/* Metrics */}
        {p.metrics && p.metrics.length > 0 && (
          <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/20 p-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="font-display text-lg font-bold text-foreground leading-none">
                  {m.value}
                </div>
                <div className="mt-1 font-mono-custom text-[9px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px] font-mono-custom text-muted-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-primary/70" />
              {t}
            </span>
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
          <div className="flex items-center gap-1.5">
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                data-testid={`project-${p.id}-github`}
              >
                <Github size={13} />
                Code
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground/60">
                <Lock size={13} />
                Private
              </span>
            )}
            {p.live ? (
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                data-testid={`project-${p.id}-live`}
              >
                <ExternalLink size={13} />
                Live
              </a>
            ) : null}
          </div>

          <Link
            href={`/work/${p.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid={`project-${p.id}-case-study`}
          >
            Case study
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
  const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.type === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-primary">
              Selected work · {projects.length} projects
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Things I&apos;ve <span className="text-gradient">shipped.</span>
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl leading-relaxed">
            A small but honest sample. Some are public, some are under NDA, some are still cooking.
            All taught me something I now reach for on the next one.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12 flex flex-wrap items-center gap-2"
          data-testid="work-filter-bar"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            const count = cat === 'All' ? projects.length : projects.filter((p) => p.type === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat.toLowerCase().replace(/\s|\//g, '-')}`}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                {cat}
                <span className={`font-mono-custom text-[10px] ${active ? 'text-primary/80' : 'text-muted-foreground/60'}`}>
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-24 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-card p-10 md:p-14"
        >
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-end">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">
                Have something <span className="text-gradient">half-built?</span>
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-xl leading-relaxed">
                I love picking up projects that are 60% there but need an extra hand to make
                them recruiter-ready, investor-ready, or just out-the-door-ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/connect"
                data-testid="work-cta-connect"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03] active:scale-95"
              >
                Start a project
                <ArrowUpRight size={15} />
              </Link>
              <a
                href="https://github.com/dhruvpanchal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted/50"
              >
                <Github size={15} />
                All on GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
