'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { TestimonialRecord } from '@/lib/types/cms';

function TestimonialCard({ t, large = false }: { t: TestimonialRecord; large?: boolean }) {
  const initials = t.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div className={`glass rounded-2xl ${large ? 'p-8 md:p-12 mb-12' : 'p-6'}`}>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={large ? 20 : 16} className="text-primary fill-primary" />
        ))}
      </div>
      <p className={`text-foreground leading-relaxed mb-6 ${large ? 'text-xl md:text-2xl italic' : ''}`}>
        &quot;{t.content}&quot;
      </p>
      {t.skills_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {t.skills_tags.map((skill) => (
            <span key={skill} className={`px-3 py-1 rounded-full text-sm font-medium ${large ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{skill}</span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3">
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">{initials}</div>
        )}
        <div>
          <p className="font-display font-bold">{t.name}</p>
          <p className="text-sm text-muted-foreground">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
          {t.location && <p className="text-xs text-muted-foreground mt-0.5">{t.location}</p>}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsClient({ testimonials }: { testimonials: TestimonialRecord[] }) {
  const featured = testimonials.find((t) => t.featured) || testimonials[0];
  const rest = testimonials.filter((t) => t.id !== featured?.id);

  return (
    <div className="min-h-screen py-24">
      <div className="container-max">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">Testimonials</h1>
          <p className="text-xl text-muted-foreground">What people say about working with me</p>
        </motion.div>

        {testimonials.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground glass rounded-2xl">No published testimonials yet.</div>
        ) : (
          <>
            {featured && <TestimonialCard t={featured} large />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <TestimonialCard t={t} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center glass rounded-2xl p-12">
          <h2 className="font-display text-3xl font-bold mb-4">Want to work together?</h2>
          <Link href="/connect" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium">Get in Touch</Link>
        </motion.div>
      </div>
    </div>
  );
}
