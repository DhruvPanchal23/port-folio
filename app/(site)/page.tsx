'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Download, Globe, Zap, Code2, TrendingUp, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Greeting Section */}
      <section className="section-padding relative overflow-hidden border-b border-border">
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
      </section>

      {/* Hero Section */}
      <section id="hero" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="container-max relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="block text-foreground">Pixels. Logic. Story.</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                I craft digital experiences you'll never forget.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <div className="h-full w-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
                      DP
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-display font-semibold text-foreground">Dhruv Panchal</p>
                    <p className="text-sm text-muted-foreground">Developer & Designer</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="relative overflow-hidden border-y border-border bg-muted/30 py-6">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...techStack, ...techStack].map((tech, i) => (
            <span
              key={i}
              className="mx-4 text-sm font-medium text-muted-foreground inline-flex items-center gap-2"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Let's work together</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                I prioritize client collaboration, fostering open communication and ensuring your vision comes to life through every iteration.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Always responsive
              </span>
            </motion.div>

            {/* Global Reach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">The Inside Scoop</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                I'm very flexible with time zone communications
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-center">
                  <div className="text-2xl mb-1">🇬🇧</div>
                  <div className="text-xs text-muted-foreground">UK</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🇮🇳</div>
                  <div className="text-xs text-muted-foreground">India</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🇺🇸</div>
                  <div className="text-xs text-muted-foreground">USA</div>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">Currently in India</p>
            </motion.div>

            {/* Technology */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">Technology</h3>
                  <p className="text-sm text-muted-foreground">Cutting-edge Stack</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['ReactJS', 'NextJS', 'TypeScript', 'TailwindCSS', 'NodeJS', 'ExpressJS', 'MongoDB', 'Git', 'GitHub', 'Vercel', 'Figma', 'Adobe'].map((tech) => (
                  <span key={tech} className="text-xs text-muted-foreground bg-muted/50 rounded-md px-2 py-1 text-center">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">Impact</h3>
                  <p className="text-sm text-muted-foreground">Stand Out</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Websites that make a difference and leave lasting impressions
              </p>
              <p className="text-sm font-medium text-primary">Let's work together</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/30 border-y border-border">
        <div className="container-max">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                Ready to bring your next project to life?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                dhruvpanchal.dev@gmail.com
              </p>
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
