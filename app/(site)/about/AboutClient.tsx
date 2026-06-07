'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Mail, MapPin, Calendar, Code2, Zap } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { usePortfolioSettingsContext } from '@/components/providers/PortfolioSettingsProvider';
import ResumeDownloadLink from '@/components/ResumeDownloadLink';
import AboutGalleryCarousel from '@/components/about/AboutGalleryCarousel';
import { useAboutGallery } from '@/hooks/useAboutGallery';

export default function AboutClient() {
  const { settings } = usePortfolioSettingsContext();
  const { profile, site } = settings;
  const { items: galleryItems, loading: galleryLoading } = useAboutGallery();

  const carouselItems = useMemo(() => {
    if (galleryItems.length > 0) {
      return galleryItems.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        image_url: item.image_url,
      }));
    }
    if (profile.image_url) {
      return [{ id: 'profile-fallback', title: 'I Create', subtitle: null, image_url: profile.image_url }];
    }
    return [];
  }, [galleryItems, profile.image_url]);

  const fallbackInitials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Know who I am
          </motion.h1>
          <p className="text-base md:text-xl text-muted-foreground">
            Pixels, logic & soul – that&apos;s my trinity
          </p>
        </motion.div>

        {/* About Me + Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">Introduction</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Technology is my foundation, creativity is my language. I&apos;m <span className="text-foreground font-medium">{profile.name}</span>, a Computer Science student and multidisciplinary creator passionate about building at the intersection of technology, design, and storytelling.
              </p>
              <p>
                From scalable web applications and AI-powered solutions to visual content and digital experiences, I enjoy transforming ideas into products that are both meaningful and memorable. I believe the best experiences are created when logic meets creativity, turning ideas into purposeful, impactful, and unforgettable products.
              </p>
              <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-foreground mt-6">
                <span className="inline-flex items-center gap-1.5 font-mono-custom text-[10px] uppercase tracking-wider text-primary mb-2">
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  Currently Building
                </span>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li><span className="text-foreground font-medium">Aureon</span> — an AI-powered Enterprise Operating System.</li>
                  <li>Research on <span className="text-foreground font-medium">AI Applications in Digital Forensics</span>.</li>
                  <li>Modern AI-driven SaaS products and automation workflows.</li>
                  <li>Personal branding and creative technology projects.</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center"
          >
            {galleryLoading ? (
              <div className="flex h-72 w-72 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
            ) : carouselItems.length > 1 ? (
              <AboutGalleryCarousel items={carouselItems} fallbackInitials={fallbackInitials} />
            ) : (
              <div className="relative w-72 h-72 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden">
                {carouselItems[0]?.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={carouselItems[0].image_url}
                    alt={carouselItems[0].title || "Profile"}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  <div className="text-9xl font-display font-bold text-primary-foreground opacity-20 select-none">
                    {fallbackInitials}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
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
              { icon: MapPin, label: 'Location', value: site.current_location },
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
          <ResumeDownloadLink
            asButton
            showIcon
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Download Resume
          </ResumeDownloadLink>
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
            <p className="text-lg text-muted-foreground mb-4">What&apos;s Next</p>
            <ul className="space-y-2">
              {[
                'Building AI-native software products',
                'Launching Micro-SaaS ventures',
                'Advancing AI in Digital Forensics research',
                'Collaborating on global technology and creative projects',
                'Exploring ethical AI and human-centered product design',
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
                { icon: '🎬', text: 'Video Editing' },
                { icon: '📷', text: 'Visual Storytelling' },
                { icon: '🎧', text: 'Folk Music' },
                { icon: '🎥', text: 'Cinematography' },
                { icon: '✈️', text: 'Exploring New Places & Cultures' },
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
