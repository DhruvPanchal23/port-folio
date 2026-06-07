'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, MapPin } from 'lucide-react';
import { usePortfolioSettingsContext } from '@/components/providers/PortfolioSettingsProvider';
import ResumeDownloadLink from '@/components/ResumeDownloadLink';
import { getMailtoUrl } from '@/lib/portfolio-settings';
import type { ResumeData } from '@/lib/types/resume';

export default function ResumeClient({ resumeData }: { resumeData: ResumeData }) {
  const { settings } = usePortfolioSettingsContext();
  const { profile, social, site } = settings;

  const renderSectionContent = (section: any, entries: any[]) => {
    switch (section.type) {
      case 'skills':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <div key={entry.id}>
                <h4 className="text-sm font-semibold text-primary mb-3">{entry.title}</h4>
                <p className="text-muted-foreground text-sm">{entry.subtitle}</p>
              </div>
            ))}
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-8">
            {entries.map((entry) => (
              <div key={entry.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{entry.title}</h4>
                    {entry.subtitle && <p className="text-sm text-muted-foreground">{entry.subtitle}</p>}
                  </div>
                  <div className="text-right">
                    {entry.date_range && <p className="text-sm text-muted-foreground">{entry.date_range}</p>}
                    {entry.location && <p className="text-xs text-muted-foreground">{entry.location}</p>}
                  </div>
                </div>
                {entry.details && entry.details.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {entry.details.map((detail: string, idx: number) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-8">
            {entries.map((entry) => (
              <div key={entry.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{entry.title}</h4>
                    {entry.subtitle && <p className="text-sm text-muted-foreground">{entry.subtitle}</p>}
                    {entry.description && <p className="text-sm text-primary">{entry.description}</p>}
                  </div>
                  <div className="text-right">
                    {entry.date_range && <p className="text-sm text-muted-foreground">{entry.date_range}</p>}
                    {entry.location && <p className="text-xs text-muted-foreground">{entry.location}</p>}
                  </div>
                </div>
                {entry.details && entry.details.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {entry.details.join(' | ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="border-l-2 border-primary pl-4">
                <h4 className="font-semibold text-foreground mb-1">{entry.title}</h4>
                {entry.description && <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>}
                {entry.subtitle && <p className="text-xs text-primary">{entry.subtitle}</p>}
              </div>
            ))}
          </div>
        );

      case 'achievements':
        return (
          <ul className="space-y-2">
            {entries.map((entry) => {
              if (entry.details && entry.details.length > 0) {
                return entry.details.map((detail: string, idx: number) => (
                  <li key={`${entry.id}-${idx}`} className="flex items-start gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ));
              }
              return (
                <li key={entry.id} className="flex items-start gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{entry.title}</span>
                </li>
              );
            })}
          </ul>
        );

      default: // certifications or custom
        return (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="border-l-2 border-primary pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground">{entry.title}</h4>
                    {entry.subtitle && <p className="text-sm text-muted-foreground">{entry.subtitle}</p>}
                  </div>
                  <div className="text-right">
                    {entry.date_range && <p className="text-sm text-muted-foreground">{entry.date_range}</p>}
                    {entry.location && <p className="text-xs text-muted-foreground">{entry.location}</p>}
                  </div>
                </div>
                {entry.description && <p className="text-sm text-muted-foreground mt-2">{entry.description}</p>}
                {entry.details && entry.details.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                    {entry.details.map((detail: string, idx: number) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-5xl">
        {/* Header with Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-2">Resume</h1>
            <p className="text-base md:text-lg text-muted-foreground">A snapshot of what I&apos;ve built, broken & shipped.</p>
          </div>
          <ResumeDownloadLink
            asButton
            showIcon
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            Download PDF
          </ResumeDownloadLink>
        </motion.div>

        <div className="space-y-12">
          {/* Contact Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{profile.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {site.current_location}
              </span>
              {social.email && (
                <a href={getMailtoUrl(social.email)} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Mail size={14} />
                  {social.email}
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Github size={14} />
                  GitHub
                </a>
              )}
            </div>
          </motion.div>

          {resumeData?.sections && resumeData.sections.length > 0 ? (
            resumeData.sections.map((section) => {
              const entries = resumeData.entries.filter((e) => e.section_id === section.id);
              if (entries.length === 0) return null;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-2xl p-8"
                >
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">{section.title}</h3>
                  {renderSectionContent(section, entries)}
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 text-muted-foreground glass rounded-2xl">
              No resume details found. Populate them in the admin dashboard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
