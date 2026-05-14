'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Testimonial } from '@/lib/supabase';

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Sarah Chen', role: 'CTO', company: 'TechVentures Inc.', avatar: '', content: 'Working with Alex was transformative. The attention to detail, the clean code, and the ability to translate our vision into reality exceeded all expectations. The product launched ahead of schedule and users love it.', rating: 5, status: 'published', sort_order: 1, created_at: '' },
  { id: '2', name: 'Marcus Rodriguez', role: 'Founder', company: 'Launchpad Studio', avatar: '', content: 'Alex doesn\'t just build websites — he builds experiences. Our conversion rate tripled after the redesign, and the codebase is so clean our new developers can onboard in days. Exceptional.', rating: 5, status: 'published', sort_order: 2, created_at: '' },
  { id: '3', name: 'Priya Sharma', role: 'Product Lead', company: 'Finova', avatar: '', content: 'The level of craft and professionalism is rare to find. Alex delivered a complex fintech dashboard that our compliance team, design team, and users all celebrate. I\'d hire him again without hesitation.', rating: 5, status: 'published', sort_order: 3, created_at: '' },
  { id: '4', name: 'James Whitfield', role: 'CEO', company: 'CreativeHQ', avatar: '', content: 'From concept to launch in 6 weeks. The speed, quality, and communication were all A+. Alex is the definition of a 10x engineer. We\'ll be working together on all future projects.', rating: 5, status: 'published', sort_order: 4, created_at: '' },
  { id: '5', name: 'Nina Patel', role: 'Design Director', company: 'Horizon Labs', avatar: '', content: 'I\'ve worked with many developers, but Alex is the rare combination of brilliant engineer and design-conscious builder. He asks the right questions and delivers beyond what you imagined.', rating: 5, status: 'published', sort_order: 5, created_at: '' },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name.split(' ').map(n => n[0]).join('');
  return (
    <div className="shrink-0 w-80 md:w-96 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      <Quote size={20} className="text-primary/20 mb-3" />

      <p className="text-sm text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground/80 transition-colors">
        {testimonial.content}
      </p>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials }: { testimonials?: Testimonial[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const items = testimonials || PLACEHOLDER_TESTIMONIALS;

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <section id="testimonials" className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10" ref={ref}>
        <div className="container-max mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                className="flex items-center gap-3 mb-4"
              >
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs font-mono-custom text-primary tracking-widest uppercase">Testimonials</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight"
              >
                What clients
                <span className="text-gradient block">say about working with me.</span>
              </motion.h2>
            </div>

            {/* Nav buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scrollable track */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            ref={trackRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar px-6 md:px-12 lg:px-24 pb-2"
          >
            {[...items, ...items].map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="container-max mt-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '5.0', label: 'Average rating', sub: 'across all projects' },
              { value: '30+', label: 'Happy clients', sub: 'globally' },
              { value: '100%', label: 'Project completion', sub: 'on time or ahead' },
              { value: '0', label: 'Client churn', sub: 'they all come back' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-xl bg-muted/40 border border-border">
                <div className="font-display text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
