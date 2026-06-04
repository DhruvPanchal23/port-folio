'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Mail, Twitter, MapPin, Package, Sparkles } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const CSSGlobe = dynamic(() => import('@/components/3d/CSSGlobe'), {
  ssr: false,
});

const techIcons = [
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
  { name: 'CSS', color: '#1572B6' },
  { name: 'Motion.dev', color: '#F24E1E' },
  { name: 'Bun', color: '#FBF0DF' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Prisma ORM', color: '#2D3748' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'GitHub', color: '#181717' },
  { name: 'GitHub Actions', color: '#2088FF' },
  { name: 'Vercel', color: '#000000' },
];

const uses = [
  { name: 'VS Code', icon: '💻' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Arc Browser', icon: '🌐' },
  { name: 'Notion', icon: '📝' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Pixels. Logic. Story */}
      <section className="section-padding relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 dot-grid opacity-30" />
        
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[1.1]">
                <span className="block text-foreground">Pixels.</span>
                <span className="block text-gradient">Logic.</span>
                <span className="block text-foreground">Story.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
                Full-stack developer crafting digital experiences that ship fast, scale well, and users actually love.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
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

      {/* Let's Build Together Section */}
      <section className="section-padding border-y border-border bg-muted/30">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Let's Build Together</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Clear communication, fast iterations, no surprises
            </h2>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Center profile */}
              <div className="relative z-10 w-32 h-32 mx-auto rounded-full ring-4 ring-primary/20 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-display font-bold text-4xl">
                  DP
                </div>
              </div>

              {/* Surrounding circles */}
              <div className="absolute top-0 left-0 w-full h-full">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="absolute w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center"
                    style={{
                      top: i === 0 ? '-20%' : i === 1 ? '80%' : '40%',
                      left: i === 0 ? '50%' : i === 1 ? '50%' : i === 2 ? '-10%' : '110%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <span className="text-2xl">👤</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Tech Stack</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              The stack behind everything I ship
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {techIcons.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="glass rounded-xl p-4 flex items-center gap-3 cursor-default"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${tech.color}15` }}
                >
                  <span className="text-lg font-bold" style={{ color: tech.color }}>
                    {tech.name[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="section-padding bg-muted/30 border-y border-border">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">What You Get</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
                Clean code, pixel-perfect UI, deployed & scaling
              </h2>

              <div className="space-y-6">
                {[
                  { title: 'Loads Instantly', desc: 'Fast loads, snappy users, better SEO' },
                  { title: 'Clear Communication', desc: 'Regular updates, no surprises' },
                  { title: 'Production Ready', desc: 'Tested, deployed, monitoring setup' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-64 h-64">
                <motion.div
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-full h-full glass rounded-2xl flex items-center justify-center"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Package className="w-24 h-24 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Flexible With Timezones</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Based in India, available globally
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Timezone-friendly communication, clear updates, and fast iterations—no matter where you are.
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-muted-foreground">London</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-muted-foreground">San Francisco</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <CSSGlobe />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Uses Section */}
      <section className="section-padding bg-muted/30 border-y border-border">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Uses</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Check out my favorite tools
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {uses.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="glass rounded-2xl p-6 w-32 h-32 flex flex-col items-center justify-center gap-3 cursor-default"
              >
                <span className="text-4xl">{tool.icon}</span>
                <span className="text-sm font-medium text-foreground text-center">{tool.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/engine-room"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              View all tools
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
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
