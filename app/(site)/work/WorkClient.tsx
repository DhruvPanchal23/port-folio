'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExternalLink, Github, Lock, ArrowUpRight, Star } from 'lucide-react';
import type { DisplayStatus, ProjectRecord } from '@/lib/types/cms';
import { metricsToCardItems } from '@/lib/cms-utils';

function StatusBadge({ status }: { status: DisplayStatus }) {
  const map: Record<DisplayStatus, { dot: string; text: string }> = {
    Live: { dot: 'bg-emerald-500', text: 'text-emerald-500' },
    Shipped: { dot: 'bg-primary', text: 'text-primary' },
    Building: { dot: 'bg-amber-400', text: 'text-amber-400' },
    Archived: { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 backdrop-blur-sm">
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${map[status].dot}`} />
      <span className={`font-mono-custom text-[10px] uppercase tracking-wider ${map[status].text}`}>{status}</span>
    </span>
  );
}

function ProjectCard({ p, i }: { p: ProjectRecord; i: number }) {
  const cardMetrics = metricsToCardItems(p.metrics, p.performance_metrics);
  const github = p.is_private ? null : p.github_url || null;
  const live = p.live_url || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: (i % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden hover:border-primary/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {p.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/10" />
        )}
        <div className="absolute top-4 left-4">
          <span className="rounded-md border border-border bg-background/70 px-2 py-1 font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-md">
            {String(i + 1).padStart(2, '0')} · {p.category}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          {p.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-1 backdrop-blur-md">
              <Star size={10} className="text-primary fill-primary" />
              <span className="font-mono-custom text-[10px] uppercase tracking-wider text-primary">Featured</span>
            </span>
          )}
          <StatusBadge status={p.display_status} />
        </div>
        {p.is_private && (
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-mono-custom uppercase tracking-wider text-muted-foreground backdrop-blur-md">
            <Lock size={10} /> Private
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{p.title}</h3>
          <span className="font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground/80">{p.year}</span>
        </div>
        {p.tagline && <p className="text-sm font-medium text-foreground/80 mb-2">{p.tagline}</p>}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.description}</p>
        {cardMetrics.length > 0 && (
          <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/20 p-3">
            {cardMetrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="font-display text-lg font-bold leading-none">{m.value}</div>
                <div className="mt-1 font-mono-custom text-[9px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {p.tech_stack.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px] font-mono-custom text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary/70" />{t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
          <div className="flex items-center gap-1.5">
            {github ? (
              <a href={github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:text-primary">
                <Github size={13} /> Code
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground/60"><Lock size={13} /> Private</span>
            )}
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                <ExternalLink size={13} /> Live
              </a>
            )}
          </div>
          <Link href={`/work/${p.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            Case study <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function WorkClient({ projects }: { projects: ProjectRecord[] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container-max">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
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
            Thoughtfully crafted products, experiments, and digital experiences.
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="mb-12 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No published projects yet. Add one from the admin panel.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
