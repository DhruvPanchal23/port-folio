'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Coffee, Headphones } from 'lucide-react';
import { useEngineRoom } from '@/hooks/useEngineRoom';
import {
  getEngineRoomIcon,
  groupItemsBySection,
} from '@/lib/engine-room';
import type {
  EngineRoomCoffeeMeta,
  EngineRoomListeningMeta,
  EngineRoomSection,
} from '@/lib/types/engine-room';

function ListeningBlock({ section }: { section: EngineRoomSection }) {
  const meta = section.metadata as EngineRoomListeningMeta;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-8 mb-12 max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <Headphones className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{section.title}</p>
          <p className="font-display text-xl font-bold text-foreground">{meta.track}</p>
          <p className="text-sm text-muted-foreground">
            {meta.artist}
            {meta.album ? (
              <>
                {' '}
                •{' '}
                {meta.url ? (
                  <a
                    href={meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {meta.album}
                  </a>
                ) : (
                  meta.album
                )}
              </>
            ) : null}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ToolsSection({
  section,
  sectionIndex,
  items,
}: {
  section: EngineRoomSection;
  sectionIndex: number;
  items: { name: string; description: string | null; url: string | null }[];
}) {
  const Icon = getEngineRoomIcon(section.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: sectionIndex * 0.1 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">{section.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            {tool.url ? (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-xl p-6 block hover:border-primary/50 transition-all duration-300 group"
              >
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </a>
            ) : (
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CoffeeBlock({ section }: { section: EngineRoomSection }) {
  const meta = section.metadata as EngineRoomCoffeeMeta;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 glass rounded-2xl p-12 text-center"
    >
      <Coffee className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
      <h2 className="font-display text-3xl font-bold text-foreground mb-4">{section.title}</h2>
      {meta.line1 ? (
        <p className="text-lg text-muted-foreground mb-2">{meta.line1}</p>
      ) : null}
      {meta.line2 ? <p className="text-sm text-muted-foreground">{meta.line2}</p> : null}
    </motion.div>
  );
}

export default function EngineRoomClient() {
  const { config, stats, navLinks, ctaButtons, sections, sectionItems, loading, error } =
    useEngineRoom();

  const itemsBySection = groupItemsBySection(sectionItems);
  const sortedSections = [...sections].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sort_order - b.sort_order;
  });

  const toolSections = sortedSections.filter((s) => s.section_type === 'tools');
  const listeningSections = sortedSections.filter((s) => s.section_type === 'listening');
  const coffeeSections = sortedSections.filter((s) => s.section_type === 'coffee');
  const contentSections = sortedSections.filter((s) => s.section_type === 'content');

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-24">
        <div className="container-max text-center">
          <h1 className="font-display text-3xl font-bold mb-4">{config.error_state_title}</h1>
          <p className="text-muted-foreground">{config.error_state_message}</p>
        </div>
      </div>
    );
  }

  const hasContent =
    listeningSections.length > 0 ||
    toolSections.length > 0 ||
    coffeeSections.length > 0 ||
    contentSections.length > 0;

  return (
    <div className="min-h-screen py-24">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">{config.title}</h1>
          <p className="text-xl text-muted-foreground">{config.subtitle}</p>
          {config.description ? (
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">{config.description}</p>
          ) : null}
        </motion.div>

        {navLinks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono-custom text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-sm font-mono-custom text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </motion.div>
        ) : null}

        {stats.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.id} className="glass rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs font-mono-custom text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        ) : null}

        {ctaButtons.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {ctaButtons.map((cta) => {
              const className =
                cta.style === 'primary'
                  ? 'inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20'
                  : 'inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm';
              return cta.external ? (
                <a key={cta.id} href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {cta.label}
                </a>
              ) : (
                <Link key={cta.id} href={cta.href} className={className}>
                  {cta.label}
                </Link>
              );
            })}
          </motion.div>
        ) : null}

        {!hasContent ? (
          <div className="text-center py-16 glass rounded-2xl max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-2">{config.empty_state_title}</h2>
            <p className="text-muted-foreground">{config.empty_state_message}</p>
          </div>
        ) : (
          <>
            {listeningSections.map((section) => (
              <ListeningBlock key={section.id} section={section} />
            ))}

            <div className="space-y-12">
              {toolSections.map((section, sectionIndex) => (
                <ToolsSection
                  key={section.id}
                  section={section}
                  sectionIndex={sectionIndex}
                  items={(itemsBySection[section.id] || []).map((i) => ({
                    name: i.name,
                    description: i.description,
                    url: i.url,
                  }))}
                />
              ))}

              {contentSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="glass rounded-2xl p-8"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">{section.title}</h2>
                  {section.subtitle ? (
                    <p className="text-muted-foreground mb-4">{section.subtitle}</p>
                  ) : null}
                  {section.description ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
                  ) : null}
                </motion.div>
              ))}
            </div>

            {coffeeSections.map((section) => (
              <CoffeeBlock key={section.id} section={section} />
            ))}
          </>
        )}

        {config.footer_message ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">{config.footer_message}</p>
        ) : null}
      </div>
    </div>
  );
}
