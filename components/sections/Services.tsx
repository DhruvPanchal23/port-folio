'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Palette, LayoutGrid as Layout, Sparkles, TrendingUp, Zap, Lightbulb, Share2, ArrowUpRight } from 'lucide-react';
import type { Service } from '@/lib/supabase';
import Link from 'next/link';

const ICON_MAP: Record<string, React.ElementType> = {
  Code, Palette, Layout, Sparkles, TrendingUp, Zap, Lightbulb, Share2
};

const PLACEHOLDER_SERVICES: Service[] = [
  { id: '1', title: 'Web Development', description: 'End-to-end development of high-performance web applications using modern technologies and best practices.', icon: 'Code', features: ['Next.js & React', 'API Development', 'Database Architecture', 'Performance Optimization', 'Testing & QA'], status: 'published', sort_order: 1 },
  { id: '2', title: 'UI/UX Design', description: 'Crafting intuitive, beautiful interfaces that convert visitors into customers and keep them coming back.', icon: 'Palette', features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility'], status: 'published', sort_order: 2 },
  { id: '3', title: 'Portfolio Design', description: 'Premium portfolio websites that position you as a top-tier professional in your field.', icon: 'Layout', features: ['Custom Design', 'CMS Integration', 'SEO Optimized', 'Mobile First', 'Analytics'], status: 'published', sort_order: 3 },
  { id: '4', title: 'Branding', description: 'Strategic brand identity that communicates your unique value proposition with clarity and elegance.', icon: 'Sparkles', features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy', 'Asset Creation'], status: 'published', sort_order: 4 },
  { id: '5', title: 'SEO Optimization', description: 'Data-driven SEO strategies that drive organic growth and long-term visibility in search engines.', icon: 'TrendingUp', features: ['Technical SEO', 'Content Strategy', 'Link Building', 'Analytics Setup', 'Performance'], status: 'published', sort_order: 5 },
  { id: '6', title: 'Automation Solutions', description: 'Custom automation workflows that eliminate repetitive tasks and let your team focus on what matters.', icon: 'Zap', features: ['Workflow Automation', 'API Integrations', 'Data Pipelines', 'Scheduled Tasks', 'Monitoring'], status: 'published', sort_order: 6 },
  { id: '7', title: 'Creative Direction', description: 'Strategic creative leadership for campaigns, products, and brand moments that leave a lasting impression.', icon: 'Lightbulb', features: ['Campaign Strategy', 'Art Direction', 'Content Planning', 'Visual Storytelling', 'Brand Voice'], status: 'published', sort_order: 7 },
  { id: '8', title: 'Social Media Design', description: 'Scroll-stopping visual content that builds community, drives engagement, and converts followers.', icon: 'Share2', features: ['Content Templates', 'Story Designs', 'Ad Creatives', 'Brand Consistency', 'Motion Graphics'], status: 'published', sort_order: 8 },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[service.icon] || Code;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative p-6 rounded-2xl bg-card border transition-all duration-300 cursor-pointer ${
        hovered ? 'border-primary/40 shadow-xl shadow-primary/8 -translate-y-1' : 'border-border'
      }`}
    >
      {/* Glow */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
        />
      )}

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${
        hovered ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-muted-foreground'
      }`}>
        <Icon size={18} />
      </div>

      <h3 className={`font-display text-base font-bold mb-2 transition-colors ${
        hovered ? 'text-primary' : 'text-foreground'
      }`}>
        {service.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>

      <ul className="space-y-1.5 mb-4">
        {service.features.slice(0, 4).map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`w-1 h-1 rounded-full shrink-0 transition-colors ${hovered ? 'bg-primary' : 'bg-muted-foreground/50'}`} />
            {f}
          </li>
        ))}
      </ul>

      <div className={`flex items-center gap-1 text-xs font-medium transition-colors ${
        hovered ? 'text-primary' : 'text-muted-foreground'
      }`}>
        Learn more
        <ArrowUpRight size={11} className={`transition-transform ${hovered ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
      </div>
    </motion.div>
  );
}

export default function Services({ services }: { services?: Service[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const displayServices = services || PLACEHOLDER_SERVICES;

  return (
    <section id="services" className="section-padding bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-max relative z-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-primary" />
            <span className="text-xs font-mono-custom text-primary tracking-widest uppercase">Services</span>
            <span className="w-8 h-px bg-primary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
          >
            What I bring
            <span className="text-gradient block">to the table.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-lg mx-auto"
          >
            From early-stage startups to enterprise teams, I offer a full spectrum of services to help you ship great products.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {displayServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Discuss Your Project
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
