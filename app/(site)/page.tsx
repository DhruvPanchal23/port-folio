'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Mail, Twitter, MapPin, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const CSSGlobe = dynamic(() => import('@/components/3d/CSSGlobe'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>,
});

const techStack = {
  frontend: [
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'nextjs' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'Tailwind CSS', icon: 'tailwindcss' },
    { name: 'Framer Motion', icon: 'motion' },
  ],
  backend: [
    { name: 'Node.js', icon: 'nodejs' },
    { name: 'Express.js', icon: 'expressjs' },
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'MySQL', icon: 'mysql' },
    { name: 'REST APIs', icon: 'api' },
  ],
  tools: [
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Figma', icon: 'figma' },
    { name: 'VS Code', icon: 'vscode' },
    { name: 'Docker', icon: 'docker' },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
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

        <div className="container-max relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1]">
                <span className="block text-foreground">Code with</span>
                <span className="block text-gradient">Purpose. Design with</span>
                <span className="block text-foreground">Precision.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Full-stack developer crafting digital experiences that ship fast, scale well, and users actually love.
              </p>

              {/* Profile info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <div className="h-full w-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                      DP
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-display text-lg font-bold text-foreground">Dhruv Panchal</p>
                    <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <Link
                  href="/connect"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                >
                  Let's Connect
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
                >
                  View Projects
                </Link>
              </div>

              {/* Social links */}
              <div className="flex items-center justify-center gap-3">
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
                    className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section-padding bg-muted/30 border-y border-border">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tech Stack
            </h2>
            <p className="text-lg text-muted-foreground">
              The tools behind everything I build
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(techStack).map(([category, technologies], i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-4 capitalize">
                  {category}
                </h3>
                <div className="space-y-3">
                  {technologies.map((tech) => (
                    <div key={tech.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {tech.name[0]}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Globe Section - Global Collaboration */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
                Built for Global Collaboration
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Based in India, working with clients worldwide. Flexible with timezones, 
                clear communication, and fast iterations — no matter where you are.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Remote-Ready</p>
                    <p className="text-sm text-muted-foreground">Available for remote work globally</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Flexible Schedule</p>
                    <p className="text-sm text-muted-foreground">Timezone-friendly communication</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <CSSGlobe />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What I Bring Section */}
      <section className="section-padding bg-muted/30 border-y border-border">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              What You Get
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Clean code, pixel-perfect UI, deployed & scaling
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Fast Iterations',
                description: 'Scoped, estimated, delivered on time',
              },
              {
                title: 'Clean Code',
                description: 'Maintainable, scalable, well-documented',
              },
              {
                title: 'Clear Communication',
                description: 'Regular updates, no surprises',
              },
              {
                title: 'Production Ready',
                description: 'Tested, deployed, monitoring setup',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6 text-center"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
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
          <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open to Work
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                Let's Build Something Great
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Available for full-time roles & freelance projects
              </p>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                Get in Touch
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
