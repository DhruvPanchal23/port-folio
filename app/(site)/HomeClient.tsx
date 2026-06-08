'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Clock,
  Coffee,
  Sparkles,
  Code2,
  Zap,
  Cpu,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePortfolioSettingsContext } from '@/components/providers/PortfolioSettingsProvider';
import ResumeDownloadLink from '@/components/ResumeDownloadLink';
import HeroAvailabilityBadge from '@/components/hero/HeroAvailabilityBadge';
import MultilingualWelcomeTicker from '@/components/hero/MultilingualWelcomeTicker';
import NowLiveCard from '@/components/hero/NowLiveCard';
import { getPrimarySocialLinks } from '@/lib/social-links';
import { useNowCard } from '@/hooks/useNowCard';
import Work from '@/components/sections/Work';
import type { ProjectRecord } from '@/lib/types/cms';
import type { Project } from '@/lib/supabase';

const CSSGlobe = dynamic(() => import('@/components/3d/CSSGlobe'), { ssr: false });

const TECH_STACK = [
  { name: 'Next.js', cat: 'Framework' },
  { name: 'React', cat: 'UI' },
  { name: 'TypeScript', cat: 'Lang' },
  { name: 'Tailwind', cat: 'Styling' },
  { name: 'Framer Motion', cat: 'Motion' },
  { name: 'Supabase', cat: 'Backend' },
  { name: 'PostgreSQL', cat: 'Database' },
  { name: 'Node.js', cat: 'Runtime' },
  { name: 'Figma', cat: 'Design' },
  { name: 'Vercel', cat: 'Deploy' },
  { name: 'GitHub', cat: 'VCS' },
  { name: 'Docker', cat: 'DevOps' },
];

const SERVICES = [
  {
    icon: Code2,
    title: 'Full-Stack Engineering',
    desc: 'Building scalable end-to-end web applications with modern architectures, clean code, and seamless user experiences.',
  },
  {
    icon: Cpu,
    title: 'Artificial Intelligence & Automation',
    desc: 'Designing practical AI-powered solutions, intelligent workflows, and automation systems that solve real-world problems.',
  },
  {
    icon: Sparkles,
    title: 'Visual Storytelling & Content Creation',
    desc: 'Creating cinematic content, reels, and visual narratives through videography, motion design, and creative editing.',
  },
  {
    icon: Zap,
    title: 'Creative Design & Digital Experiences',
    desc: 'Crafting intuitive interfaces, brand identities, and interactive experiences that combine aesthetics with usability.',
  },
];

export default function HomeClient({ featuredProjects }: { featuredProjects: ProjectRecord[] }) {
  const { settings } = usePortfolioSettingsContext();
  const { site, social, profile } = settings;
  const { config: nowConfig, items: nowItems } = useNowCard();
  const socialLinks = getPrimarySocialLinks(social);

  // Subtle parallax for hero accent
  const heroRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 30, damping: 18 });
  const sy = useSpring(my, { stiffness: 30, damping: 18 });
  const blobX = useTransform(sx, [-0.5, 0.5], [-40, 40]);
  const blobY = useTransform(sy, [-0.5, 0.5], [-30, 30]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mx, my]);

  return (
    <div className="min-h-screen">
      {/* ====================== HERO ====================== */}
      <section
        ref={heroRef}
        id="hero"
        className="relative overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32"
      >
        {/* Parallax accent blobs */}
        <motion.div
          style={{ x: blobX, y: blobY }}
          className="pointer-events-none absolute top-[15%] right-[8%] h-[420px] w-[420px] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          style={{ x: useTransform(blobX, (v) => -v * 0.6), y: useTransform(blobY, (v) => -v * 0.6) }}
          className="pointer-events-none absolute bottom-[10%] left-[5%] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[100px] dark:bg-cyan-400/10"
        />

        <div className="container-max relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center">
            {/* LEFT — Headline & meta */}
            <div>
              <MultilingualWelcomeTicker variant="inline" />

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="font-display text-[2.75rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.02] tracking-tight"
              >
                <span className="block">Pixels.</span>
                <span className="block text-gradient">Logic.</span>
                <span className="block">Story.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                I&apos;m <span className="text-foreground font-medium">{profile.name}</span> — a Full-Stack Developer, Graphics Designer, and Creative Technology Explorer building thoughtful digital experiences through code, design, and visual storytelling.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/work"
                  data-testid="hero-view-work-cta"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>View selected work</span>
                  <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/connect"
                  data-testid="hero-connect-cta"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-foreground/40 hover:bg-muted/60"
                >
                  Start a conversation
                </Link>
                <ResumeDownloadLink
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-3 text-sm text-muted-foreground link-underline hover:text-foreground transition-colors"
                  data-testid="hero-resume-link"
                >
                  Resume ↓
                </ResumeDownloadLink>
              </motion.div>

              {/* Meta strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono-custom text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-primary" /> {site.current_location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-primary" /> GMT+5:30
                </span>
                <span className="flex items-center gap-1.5">
                  <Coffee size={12} className="text-primary" /> Powered by filter coffee
                </span>
              </motion.div>

              {/* Socials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 flex items-center gap-2"
              >
                {socialLinks.map(({ icon: Icon, href, label, target, rel }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={target || '_blank'}
                    rel={rel || 'noopener noreferrer'}
                    data-testid={`hero-social-${label.toLowerCase()}`}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/40 text-muted-foreground backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon size={16} className="transition-transform group-hover:scale-110" />
                  </a>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — Now-playing card */}
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative lg:justify-self-end w-full max-w-md"
              data-testid="hero-now-card"
            >
              <HeroAvailabilityBadge status={site.availability_status} variant="floating" />
              <NowLiveCard config={nowConfig} items={nowItems} />
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ====================== MARQUEE: principles ====================== */}
      <section className="relative border-y border-border bg-muted/20 py-6 overflow-hidden">
        <div className="flex animate-marquee gap-12 whitespace-nowrap font-display text-xl md:text-2xl font-bold tracking-tight text-muted-foreground/70">
          {Array(2)
            .fill(0)
            .map((_, di) => (
              <div key={di} className="flex shrink-0 gap-12">
                {[
                  'Ship fast.',
                  '— Type everything.',
                  'Design with intent.',
                  '— Measure what matters.',
                  'Refactor without ego.',
                  '— Ship again.',
                  'Stay curious.',
                  '— Document the journey.',
                ].map((t, i) => (
                  <span key={`${di}-${i}`} className="flex items-center gap-12">
                    <span className={i % 2 === 0 ? 'text-foreground' : ''}>{t}</span>
                  </span>
                ))}
              </div>
            ))}
        </div>
      </section>

      {/* ====================== SERVICES ====================== */}
      <section id="services" className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mb-16">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />
                <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-primary">
                  What I do
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Four things,<br /> done properly.
              </h2>
            </div>
            <p className="text-muted-foreground md:text-lg max-w-2xl self-end leading-relaxed">
              I intentionally keep my focus narrow and go deep into the things I&apos;m genuinely passionate about. These are the areas where I invest my time, creativity, and obsession for quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl border border-border bg-border overflow-hidden">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.07 }}
                className="group relative bg-background p-8 md:p-10 transition-colors hover:bg-muted/30"
                data-testid={`service-card-${i}`}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/40 text-primary transition-all group-hover:border-primary/40 group-hover:bg-primary/10">
                  <s.icon size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

                <span className="absolute top-8 right-8 font-mono-custom text-xs text-muted-foreground/60">
                  0{i + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FEATURED PROJECTS ====================== */}
      <Work projects={featuredProjects as unknown as Project[]} />

      {/* ====================== TECH STACK ====================== */}
      <section id="tech" className="section-padding border-y border-border bg-muted/20">
        <div className="container-max">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-primary">
                Stack
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-3">
              The toolkit behind every ship.
            </h2>
            <p className="text-muted-foreground md:text-lg leading-relaxed">
              Battle-tested, type-safe, opinionated where it matters. I pick boring tech on
              purpose so the product can be the interesting part.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TECH_STACK.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                data-testid={`tech-${t.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="mb-2 font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.cat}
                </div>
                <div className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {t.name}
                </div>
                <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== GLOBE / TIMEZONE ====================== */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />
                <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-primary">
                  Where & when
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
                Based in India.<br /> Comfortable shipping anywhere.
              </h2>
              <p className="text-muted-foreground md:text-lg leading-relaxed mb-8">
                Async-first, status updates on rails, end-of-day demos. Used to working
                with teams across London, SF, Berlin, and Singapore.
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-md">
                {[
                  { city: 'BLR', tz: 'GMT+5:30', dot: 'bg-primary' },
                  { city: 'LON', tz: 'GMT+0', dot: 'bg-amber-400' },
                  { city: 'SFO', tz: 'GMT-8', dot: 'bg-rose-400' },
                ].map((c) => (
                  <div
                    key={c.city}
                    className="rounded-lg border border-border bg-card/40 p-3 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                      <span className="font-mono-custom text-xs text-muted-foreground">{c.tz}</span>
                    </div>
                    <div className="font-display text-base font-bold text-foreground">{c.city}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <CSSGlobe />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="relative section-padding overflow-hidden">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-card p-10 md:p-16"
          >
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative max-w-3xl">
              {site.open_to_work && (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono-custom uppercase tracking-wider text-muted-foreground">
                    Open to opportunities
                  </span>
                </div>
              )}
              <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-6">
                Let&apos;s make<br /> something memorable.
              </h2>
              <p className="text-muted-foreground md:text-lg leading-relaxed mb-10 max-w-xl">
                Whether you&apos;re a founder with a half-formed idea, a recruiter scouting talent,
                or a friend who just wants to chat — I&apos;m one click away.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/connect"
                  data-testid="cta-primary"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <Mail size={15} /> Start a conversation
                </Link>
                <Link
                  href="/guestbook"
                  data-testid="cta-guestbook"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted/50"
                >
                  Sign the guestbook
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
