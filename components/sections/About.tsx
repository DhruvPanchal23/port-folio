'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code as Code2, Palette, Shield, Zap, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const skills = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP'] },
  { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'Redis', 'GraphQL'] },
  { category: 'Design', items: ['Figma', 'Design Systems', 'Prototyping', 'Motion Design', 'Brand Identity'] },
  { category: 'Security', items: ['Penetration Testing', 'OWASP', 'Security Audits', 'Auth Systems', 'Encryption'] },
];

const values = [
  { icon: Code2, title: 'Engineering Depth', desc: 'Clean architecture, scalable systems, and code that future developers will thank you for.' },
  { icon: Palette, title: 'Design Sensibility', desc: 'Every pixel matters. I obsess over details that most people never notice but always feel.' },
  { icon: Shield, title: 'Security Mindset', desc: 'Building with security as a first-class citizen, not an afterthought.' },
  { icon: Zap, title: 'Performance First', desc: 'Speed is a feature. Fast experiences win users and retain them.' },
];

const timeline = [
  { year: '2019', title: 'Started freelancing', desc: 'First client project — a SaaS dashboard that reached 5k users in 3 months.' },
  { year: '2020', title: 'Joined Series A startup', desc: 'Led frontend architecture for a fintech product serving 100k+ users.' },
  { year: '2021', title: 'Launched first SaaS', desc: 'Built and launched NeuralFlow AI — reached $50k ARR within 6 months.' },
  { year: '2023', title: 'Going independent', desc: 'Returned to freelance + building. Working with top-tier clients globally.' },
  { year: '2024', title: 'Award recognition', desc: 'Product Hunt #1 Product of the Day for Cinematica.' },
  { year: 'Now', title: 'Building in public', desc: 'Creating premium experiences, writing, and taking on select projects.' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

    // NOTE: using inline animation instead of variants to avoid framer-motion TargetResolver type issues

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-max relative z-10" ref={ref}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-16"
        >
          <span className="w-8 h-px bg-primary" />
          <span className="text-xs font-mono-custom text-primary tracking-widest uppercase">About</span>
        </motion.div>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Engineer by training.
              <br />
              <span className="text-gradient">Creator by nature.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              I craft digital experiences that sit at the intersection of engineering precision and creative vision.
              With 5+ years building products that users love, I bring both technical depth and design sensibility
              to every project.
            </p>
            <blockquote className="border-l-2 border-primary pl-6 py-1 my-6">
              <p className="text-foreground font-medium italic text-lg">
                &ldquo;Code is poetry. Design is language. Together they tell stories that move people to action.&rdquo;
              </p>
            </blockquote>
            <p className="text-muted-foreground leading-relaxed">
              When I&apos;m not shipping products, I&apos;m deep in security research, experimenting with generative design,
              or writing about the future of the web. I believe the best software feels inevitable — like it
              couldn&apos;t have been built any other way.
            </p>
          </motion.div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-5 rounded-2xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon size={18} className="text-primary" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-1.5 text-sm">{v.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display text-2xl font-bold text-foreground mb-8"
          >
            Skills & Tools
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="text-xs font-mono-custom text-primary tracking-widest uppercase mb-3">
                  {group.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-display text-2xl font-bold text-foreground mb-10"
          >
            The Journey
          </motion.h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="flex gap-8 group"
                >
                  {/* Year */}
                  <div className="hidden md:flex flex-col items-center w-14 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary border-2 border-background ring-2 ring-border group-hover:ring-primary/30 transition-all mt-1.5 relative z-10" />
                    <span className="text-xs font-mono-custom text-muted-foreground mt-2 -ml-1">{item.year}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-6 group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="md:hidden text-xs font-mono-custom text-primary">{item.year}</span>
                      <h4 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
