'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Download, Mail, MapPin, Calendar, Code2, Palette, Zap, Heart } from 'lucide-react';
import { useRef } from 'react';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  return (
    <div ref={containerRef} className="min-h-screen py-24">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y, opacity }}
          className="mb-16 text-center"
        >
          <motion.h1 
            className="font-display text-5xl md:text-7xl font-bold mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Know who I am
          </motion.h1>
          <p className="text-xl text-muted-foreground">
            Pixels, logic & soul – that's my trinity
          </p>
        </motion.div>

        {/* About Me + Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">About Me</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm Dhruv Panchal – final year B.Tech CSE student, full stack developer, 
                Graphic designer & creative technologist. I build web experiences that are 
                more about the journey than just utility.
              </p>
              <p>
                Currently diving deep into AI in Digital Forensics, blending cybersecurity 
                with intelligent systems to create innovative solutions.
              </p>
              <p>
                My work sits at the intersection of code & creativity. I'm always open to 
                collaborations or just a good conversation over coffee + code.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-72 h-72 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden">
              <div className="text-9xl font-display font-bold text-primary-foreground opacity-20">DP</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Quick Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">Quick Facts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Code2, label: 'Coding since', value: '2022' },
              { icon: MapPin, label: 'Location', value: 'Surat, India' },
              { icon: Zap, label: 'Status', value: 'Remote-ready' },
              { icon: Calendar, label: 'Currently', value: 'Final year B.Tech CSE' },
            ].map((fact, i) => (
              <div key={i} className="glass rounded-xl p-6 text-center">
                <fact.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">{fact.label}</p>
                <p className="font-semibold text-foreground">{fact.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Download size={16} />
            Download Resume
          </Link>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
          >
            <Mail size={16} />
            Say Hello
          </Link>
          <span className="inline-flex items-center gap-2 px-6 py-3 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium bg-emerald-50 dark:bg-emerald-950/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available
          </span>
        </motion.div>

        {/* Why Work With Me */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">Why Work With Me</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Proficiency',
                subtitle: 'Two freelancers in one',
                description: 'Full-stack development & UI/UX design expertise'
              },
              {
                title: 'Satisfaction',
                subtitle: '100% is the baseline',
                description: 'Exceeding expectations is the standard'
              },
              {
                title: 'Reliability',
                subtitle: 'Fast responses, no guesswork',
                description: 'Clear communication and timely delivery'
              },
              {
                title: 'Passion',
                subtitle: 'Energy in every project',
                description: 'Bringing enthusiasm to every line of code'
              },
            ].map((card, i) => (
              <div
                key={i}
                className="glass rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <h4 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  It feels like {card.subtitle}
                </p>
                <p className="text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Future Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">Future Goals</h3>
          <div className="glass rounded-xl p-8">
            <p className="text-lg text-muted-foreground mb-4">What's Next</p>
            <ul className="space-y-2">
              {[
                'Creative AI applications',
                'Micro-SaaS development',
                'AI in Digital Forensics',
                'Global collaborations',
                'Research design ethics',
              ].map((goal, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Outside Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">Outside Work</h3>
          <div className="glass rounded-xl p-8">
            <p className="text-lg text-muted-foreground mb-4">What I Love</p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: '🎬', text: 'Video editing' },
                { icon: '📷', text: 'Visual storytelling' },
                { icon: '🎧', text: 'Folk music' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
