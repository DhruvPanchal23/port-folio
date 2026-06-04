'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { notFound } from 'next/navigation';

const projectsData: Record<string, any> = {
  'personal-portfolio': {
    title: 'Personal Portfolio',
    type: 'Web App',
    description: 'Modern dark glassmorphism portfolio website with smooth animations and responsive design',
    longDescription: 'A comprehensive portfolio website built with Next.js 13, featuring server-side rendering, advanced animations with Framer Motion, and a fully functional admin dashboard. The site showcases clean code architecture, modern design patterns, and optimal performance.',
    quarter: 'Q2 2024',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Vercel'],
    github: 'https://github.com/dhruvpanchal/portfolio',
    live: 'https://dhruvpanchal.dev',
    metrics: {
      'Performance': '95+',
      'Accessibility': '100',
      'SEO': '100',
      'Load Time': '<1s',
    },
    features: [
      'Server-side rendering with Next.js 13 App Router',
      'Admin dashboard for content management',
      '3D animated globe showing global presence',
      'Command menu (Ctrl+K) for quick navigation',
      'Theme customization with 5 accent colors',
      'Fully responsive across all devices',
    ],
    challenges: [
      'Implementing 3D elements with React Three Fiber',
      'Optimizing animations for 60fps performance',
      'Building a scalable admin dashboard',
    ],
    learnings: [
      'Advanced Next.js 13 app router patterns',
      'Performance optimization techniques',
      'Building accessible, SEO-friendly SPAs',
    ],
  },
};

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projectsData[params.slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-4xl">
        {/* Back Button */}
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Work
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {project.type}
            </span>
            <span className="text-sm text-muted-foreground">{project.quarter}</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
            {project.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {project.description}
          </p>

          {/* Links */}
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
              >
                <Github size={18} />
                View Code
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ExternalLink size={18} />
                Visit Site
              </a>
            )}
          </div>
        </motion.div>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden mb-16"
        >
          <div className="aspect-video bg-muted flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📱</span>
              <p className="text-muted-foreground">Project Preview</p>
            </div>
          </div>
        </motion.div>

        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            {project.longDescription}
          </p>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((tech: string) => (
              <span
                key={tech}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Metrics */}
        {project.metrics && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(project.metrics).map(([key, value]) => (
                <div key={key} className="glass rounded-xl p-6 text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-2">{value}</div>
                  <div className="text-sm text-muted-foreground">{key}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Features */}
        {project.features && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Key Features</h2>
            <ul className="space-y-3">
              {project.features.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-primary">✓</span>
                  </span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* More Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Interested in working together?
          </h3>
          <p className="text-muted-foreground mb-6">
            Let's build something amazing
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
