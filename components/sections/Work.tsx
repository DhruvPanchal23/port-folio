'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/lib/supabase';

const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Stellar Design System',
    slug: 'stellar-design-system',
    description: 'A comprehensive design system powering enterprise products at scale with 200+ components.',
    long_description: '',
    cover_image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [],
    tech_stack: ['React', 'TypeScript', 'Storybook', 'Figma'],
    category: 'design-system',
    status: 'published',
    featured: true,
    github_url: '#',
    live_url: '#',
    metrics: { components: '200+', teams: '50+', adoption: '94%' },
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'NeuralFlow AI Platform',
    slug: 'neuralflow-ai',
    description: 'Real-time AI workflow automation platform with visual pipeline builder for non-technical teams.',
    long_description: '',
    cover_image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [],
    tech_stack: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'OpenAI'],
    category: 'saas',
    status: 'published',
    featured: true,
    github_url: '#',
    live_url: '#',
    metrics: { users: '10k+', pipelines_built: '50k+', time_saved: '40hrs/week' },
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Cinematica Web App',
    slug: 'cinematica',
    description: 'Award-winning film discovery platform with AI-powered recommendations and social features.',
    long_description: '',
    cover_image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [],
    tech_stack: ['React', 'Node.js', 'GraphQL', 'MongoDB'],
    category: 'web',
    status: 'published',
    featured: true,
    github_url: '#',
    live_url: '#',
    metrics: { users: '25k+', rating: '4.9/5', award: 'PH #1' },
    sort_order: 3,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    title: 'CyberShield Dashboard',
    slug: 'cybershield',
    description: 'Enterprise security monitoring dashboard with real-time threat detection and 15+ integrations.',
    long_description: '',
    cover_image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [],
    tech_stack: ['React', 'D3.js', 'Python', 'Kafka', 'Elasticsearch'],
    category: 'security',
    status: 'published',
    featured: false,
    github_url: '#',
    live_url: '#',
    metrics: { threats_blocked: '1M+', uptime: '99.99%', integrations: '15+' },
    sort_order: 4,
    created_at: '',
    updated_at: '',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'design-system': 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
  saas: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  web: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  security: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative rounded-2xl border border-border overflow-hidden bg-card transition-all duration-500 ${
        hovered ? 'border-primary/30 shadow-xl shadow-primary/8' : ''
      } ${index === 0 ? 'md:col-span-2' : ''}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-muted ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}>
        <motion.img
          src={project.cover_image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {project.featured && (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground font-medium backdrop-blur-sm">
              <Star size={10} />
              Featured
            </span>
          )}
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm ${CATEGORY_COLORS[project.category] || ''}`}>
            {project.category}
          </span>
        </div>

        {/* Action buttons */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-4 right-4 flex items-center gap-2"
            >
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={14} />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight
            size={16}
            className="text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
          />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>

        {/* Metrics */}
        {Object.keys(project.metrics).length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 py-3 border-y border-border/60">
            {Object.entries(project.metrics).map(([key, val]) => (
              <div key={key}>
                <div className="font-display text-sm font-bold text-foreground leading-none">{val}</div>
                <div className="text-xs text-muted-foreground mt-0.5 capitalize">{key.replace(/_/g, ' ')}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 5 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
              +{project.tech_stack.length - 5}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Work({ projects }: { projects?: Project[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const displayProjects = projects || PLACEHOLDER_PROJECTS;

  return (
    <section id="work" className="section-padding bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />

      <div className="container-max relative z-10" ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-px bg-primary" />
              <span className="text-xs font-mono-custom text-primary tracking-widest uppercase">Selected Work</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight"
            >
              Projects that
              <span className="text-gradient block">move the needle.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              Start a Project
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* More work CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4 text-sm">
            These are a few highlights. I&apos;ve shipped 50+ projects across many industries.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={15} />
            <span className="link-underline">See more on GitHub</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
