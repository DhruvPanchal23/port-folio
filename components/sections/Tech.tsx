'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const TECH_GROUPS = [
  {
    label: 'Frontend',
    color: 'blue',
    techs: [
      { name: 'React', level: 98 },
      { name: 'Next.js', level: 96 },
      { name: 'TypeScript', level: 94 },
      { name: 'Tailwind CSS', level: 96 },
      { name: 'Framer Motion', level: 90 },
      { name: 'GSAP', level: 82 },
    ],
  },
  {
    label: 'Backend',
    color: 'emerald',
    techs: [
      { name: 'Node.js', level: 90 },
      { name: 'Python', level: 85 },
      { name: 'PostgreSQL', level: 88 },
      { name: 'Supabase', level: 92 },
      { name: 'Redis', level: 78 },
      { name: 'GraphQL', level: 80 },
    ],
  },
  {
    label: 'Design & Creative',
    color: 'amber',
    techs: [
      { name: 'Figma', level: 95 },
      { name: 'Design Systems', level: 92 },
      { name: 'Motion Design', level: 85 },
      { name: 'Brand Identity', level: 82 },
      { name: 'Prototyping', level: 90 },
      { name: 'Illustration', level: 70 },
    ],
  },
  {
    label: 'Security',
    color: 'rose',
    techs: [
      { name: 'OWASP', level: 85 },
      { name: 'Pen Testing', level: 80 },
      { name: 'Auth Systems', level: 92 },
      { name: 'Encryption', level: 86 },
      { name: 'Security Audits', level: 82 },
    ],
  },
];

const TOOLS = [
  'VS Code', 'Git', 'Docker', 'Vercel', 'AWS', 'Cloudflare',
  'Storybook', 'Jest', 'Cypress', 'Prisma', 'Stripe', 'OpenAI',
  'Sanity', 'Notion', 'Linear', 'Slack', 'Figma', 'Adobe CC',
];

const COLOR_MAP: Record<string, { bar: string; text: string; bg: string }> = {
  blue: { bar: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  rose: { bar: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
};

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const colors = COLOR_MAP[color];

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-foreground font-medium">{name}</span>
        <span className={`text-xs font-mono-custom ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
          {level}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors.bar}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function Tech() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <section id="tech" className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max relative z-10" ref={ref}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="w-8 h-px bg-primary"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-mono-custom text-primary tracking-widest uppercase"
          >
            Tech Stack
          </motion.span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight"
          >
            Tools of the
            <span className="text-gradient block">craft.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xs text-sm leading-relaxed md:text-right"
          >
            A curated ecosystem of technologies I use to build fast, accessible, and beautiful products.
          </motion.p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TECH_GROUPS.map((group, i) => {
            const colors = COLOR_MAP[group.color];
            return (
              <motion.button
                key={group.label}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => setActiveGroup(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  activeGroup === i
                    ? `${colors.bg} ${colors.text} border-current/20`
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {group.label}
              </motion.button>
            );
          })}
        </div>

        {/* Skills grid */}
        <motion.div
          key={activeGroup}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-16 p-6 rounded-2xl bg-muted/30 border border-border"
        >
          {TECH_GROUPS[activeGroup].techs.map((tech, i) => (
            <SkillBar
              key={tech.name}
              name={tech.name}
              level={tech.level}
              color={TECH_GROUPS[activeGroup].color}
              delay={i * 0.08}
            />
          ))}
        </motion.div>

        {/* Tools marquee */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-mono-custom text-muted-foreground tracking-widest uppercase mb-6"
          >
            Also proficient with
          </motion.p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div className="flex gap-3 animate-marquee-slow">
              {[...TOOLS, ...TOOLS].map((tool, i) => (
                <span
                  key={`${tool}-${i}`}
                  className="shrink-0 px-4 py-2 rounded-xl bg-muted border border-border text-sm text-muted-foreground whitespace-nowrap hover:text-foreground hover:border-foreground/20 transition-colors cursor-default"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
