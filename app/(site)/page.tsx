'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Download, Globe, Zap, Code2, TrendingUp, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const EarthCanvas = dynamic(() => import('@/components/3d/EarthCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>,
});

const greetings = [
  'Hello', 'Namaskar', 'Namaste', 'स्वस्थस्य स्वागतं', 'नमस्कार', 'নমস্কার', 
  'Hallo', 'Bonjour', 'Привет', 'مرحباً', 'કેમ છો?'
];

const techStack = [
  'Frontend Development', 'Backend Development', 'React', 'React Specialist', 
  'TypeScript Expert', 'Modern Web Apps', 'Responsive Design', 'API Development', 
  'Development', 'Designing', 'Full Stack', 'UI/UX', 'MongoDB', 'Node.js', 
  'Express.js', 'Next.js', 'TailwindCSS', 'Git & GitHub'
];

export default function HomePage() {
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Greeting Section with Parallax */}
      <motion.section 
        style={{ opacity, scale }}
        className="section-padding relative overflow-hidden border-b border-border"
      >
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1
              key={currentGreeting}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-display text-4xl md:text-6xl font-bold text-gradient mb-6"
            >
              {greetings[currentGreeting]}
            </motion.h1>
            <p className="text-lg text-muted-foreground">Welcome to my digital space</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Hero Section with 3D Earth */}
      <section id="hero" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"
        />

        <div className="container-max relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-foreground">Pixels. Logic. Story.</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
                I craft digital experiences you'll never forget.
              </p>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <div className="h-full w-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
                    DP
                  </div>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">Dhruv Panchal</p>
                  <p className="text-sm text-muted-foreground">Developer & Designer</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="/connect"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                >
                  Let's Connect
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
                >
                  Hire Me
                </Link>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, href: 'https://github.com/dhruvpanchal', label: 'GitHub' },
                  { icon: Twitter, href: 'https://twitter.com/dhruvpanchal', label: 'Twitter' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/dhruv-panchal', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:dhruvpanchal.dev@gmail.com', label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right: 3D Earth */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-4 md:p-8">
                <div className="mb-4">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Global Collaboration
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Working with clients worldwide
                  </p>
                </div>
                <EarthCanvas />
                <div className="mt-4 flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-muted-foreground">UK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-muted-foreground">India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-muted-foreground">USA</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="relative overflow-hidden border-y border-border bg-muted/30 py-6">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...techStack, ...techStack].map((tech, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.1, color: 'hsl(var(--primary))' }}
              className="mx-4 text-sm font-medium text-muted-foreground inline-flex items-center gap-2 cursor-default"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {tech}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Feature Cards with enhanced animations */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Code2,
                title: 'Collaboration',
                subtitle: "Let's work together",
                description: 'I prioritize client collaboration, fostering open communication and ensuring your vision comes to life through every iteration.',
                tag: 'Always responsive',
              },
              {
                icon: Globe,
                title: 'Global Reach',
                subtitle: 'The Inside Scoop',
                description: "I'm very flexible with time zone communications. Currently based in India, working with clients worldwide.",
                tag: 'Remote-ready',
              },
              {
                icon: Zap,
                title: 'Technology',
                subtitle: 'Cutting-edge Stack',
                description: 'Using the latest technologies and best practices to build scalable, performant applications.',
                tag: 'Modern tools',
              },
              {
                icon: TrendingUp,
                title: 'Impact',
                subtitle: 'Stand Out',
                description: 'Websites that make a difference and leave lasting impressions on your users.',
                tag: "Let's work together",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                  >
                    <card.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {card.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {card.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with parallax */}
      <section className="section-padding bg-muted/30 border-y border-border relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/5 to-blue-500/5 blur-3xl"
        />
        <div className="container-max relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
                whileHover={{ scale: 1.02 }}
              >
                Ready to bring your next project to life?
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                whileHover={{ scale: 1.05 }}
              >
                dhruvpanchal.dev@gmail.com
              </motion.p>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                Let's work together
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
