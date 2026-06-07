'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import type { ProjectRecord } from '@/lib/types/cms';
import CaseStudyRenderer from '@/components/cms/CaseStudyRenderer';

export default function ProjectDetailClient({ project }: { project: ProjectRecord }) {
  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-4xl">
        <Link href="/work" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} /> Back to Work
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {project.category}
            </span>
            <span className="text-sm text-muted-foreground">{project.year}</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {project.tagline || project.description}
          </p>
          <div className="flex gap-3">
            {project.github_url && !project.is_private && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border hover:bg-muted"
              >
                <Github size={18} /> View Code
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground"
              >
                <ExternalLink size={18} /> Visit Site
              </a>
            )}
          </div>
        </motion.div>

        {project.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl overflow-hidden mb-16"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.cover_image} alt={project.title} className="w-full aspect-video object-cover" />
          </motion.div>
        )}

        <CaseStudyRenderer project={project} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 text-center mt-12">
          <h3 className="font-display text-2xl font-bold mb-4">Interested in working together?</h3>
          <Link href="/connect" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium">
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
