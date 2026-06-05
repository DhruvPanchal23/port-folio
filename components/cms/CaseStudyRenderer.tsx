'use client';

import { ExternalLink, Github } from 'lucide-react';
import type { CaseStudySection, PerformanceMetrics, ProjectRecord } from '@/lib/types/cms';
import { sortSections } from '@/lib/cms-utils';
import MetricsDisplay from '@/components/cms/MetricsDisplay';

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">{title}</h2>
      {children}
    </section>
  );
}

function renderSection(section: CaseStudySection, project: ProjectRecord) {
  const c = section.content;
  switch (section.type) {
    case 'overview':
    case 'problem':
    case 'challenge':
    case 'solution':
    case 'architecture':
    case 'research':
    case 'design_process':
    case 'development_process':
    case 'team_role':
    case 'results_impact':
      return <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{String(c.text || '')}</p>;
    case 'tech_stack':
    case 'key_features':
    case 'learnings':
    case 'future_roadmap': {
      const items = (c.items as string[]) || [];
      return (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-xs text-primary">✓</span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    case 'metrics':
      return <MetricsDisplay performance={project.performance_metrics} custom={project.metrics} />;
    case 'links': {
      const github = String(c.github || project.github_url || '');
      const live = String(c.live || project.live_url || '');
      return (
        <div className="flex flex-wrap gap-3">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border hover:bg-muted">
              <Github size={18} /> View Code
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground">
              <ExternalLink size={18} /> Visit Site
            </a>
          )}
        </div>
      );
    }
    case 'screenshots':
    case 'gallery': {
      const images = (c.images as string[]) || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-auto" />
            </div>
          ))}
        </div>
      );
    }
    case 'timeline': {
      const items = (c.items as { date?: string; title?: string; description?: string }[]) || [];
      return (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="border-l-2 border-primary pl-4">
              <div className="text-xs text-primary font-mono-custom mb-1">{item.date}</div>
              <div className="font-semibold text-foreground">{item.title}</div>
              {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
            </div>
          ))}
        </div>
      );
    }
    case 'custom':
      return (
        <div className="space-y-4">
          {c.text ? (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{String(c.text)}</p>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}

export default function CaseStudyRenderer({ project }: { project: ProjectRecord }) {
  const sections = sortSections(project.case_study_sections || []).filter((s) => s.visible);
  return (
    <>
      {sections.map((section) => (
        <SectionBlock key={section.id} title={section.title}>
          {renderSection(section, project)}
        </SectionBlock>
      ))}
    </>
  );
}
