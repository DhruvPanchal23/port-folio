'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Twitter, ArrowUpRight, Download } from 'lucide-react';
import Link from 'next/link';

const ROLES = ['Developer', 'Designer', 'Creative Technologist', 'Security Enthusiast', 'Builder'];

const FLOATING_TAGS = [
  { label: 'Next.js', x: '8%', y: '25%', delay: 0 },
  { label: 'TypeScript', x: '85%', y: '20%', delay: 0.2 },
  { label: 'React', x: '75%', y: '65%', delay: 0.4 },
  { label: 'Supabase', x: '5%', y: '70%', delay: 0.6 },
  { label: 'Figma', x: '90%', y: '45%', delay: 0.8 },
  { label: 'Tailwind', x: '12%', y: '50%', delay: 1.0 },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const orbX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const orbY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX.set((e.clientX / w - 0.5));
      mouseY.set((e.clientY / h - 0.5));
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  // Typewriter effect
  useEffect(() => {
    const target = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      if (displayedRole.length < target.length) {
        timeout = setTimeout(() => setDisplayedRole(target.slice(0, displayedRole.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 1800);
      }
    } else {
      if (displayedRole.length > 0) {
        timeout = setTimeout(() => setDisplayedRole(displayedRole.slice(0, -1)), 45);
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayedRole, isTyping, roleIndex]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-background/55 dark:bg-background/45"
    >
      {/* Animated background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Gradient orbs */}
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[100px] pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(orbX, v => -v * 0.5), y: useTransform(orbY, v => -v * 0.5) }}
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-400/6 blur-[80px] pointer-events-none"
      />

      {/* Floating tech tags */}
      {FLOATING_TAGS.map((tag) => (
        <motion.div
          key={tag.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + tag.delay, duration: 0.5 }}
          className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 backdrop-blur-sm border border-border/60 text-xs font-medium text-muted-foreground animate-float"
          style={{ left: tag.x, top: tag.y, animationDelay: `${tag.delay}s` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
          {tag.label}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="container-max relative z-10 pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Available badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for freelance projects
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
              <span className="block text-foreground">Hi, I&apos;m Alex</span>
              <span className="block text-foreground/30">&mdash; a</span>
              <span className="block">
                <span className="text-gradient">{displayedRole}</span>
                <span className="text-primary animate-blink ml-0.5">|</span>
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10"
          >
            I craft premium digital experiences at the intersection of engineering precision and creative vision.
            Turning complex problems into elegant, performant solutions.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              View My Work
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3.5 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200 hover:border-foreground/30"
            >
              Get In Touch
            </Link>
            <a
              href="/resume.pdf"
              download
              className="group inline-flex items-center gap-2 px-4 py-3.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <Download size={14} />
              Resume
            </a>
          </motion.div>

          {/* Social links + Stats */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8 sm:items-center">
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            <div className="hidden sm:block w-px h-8 bg-border" />

            {/* Quick stats */}
            <div className="flex items-center gap-6">
              {[
                { value: '5+', label: 'Years' },
                { value: '50+', label: 'Projects' },
                { value: '30+', label: 'Clients' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-xl font-bold text-foreground leading-none">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs tracking-widest font-mono-custom uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
