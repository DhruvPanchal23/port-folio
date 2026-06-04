'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink, Github, Lock, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    id: 'personal-portfolio',
    number: '01',
    type: 'Web App',
    title: 'Personal Portfolio',
    description: 'Modern dark glassmorphism portfolio website with smooth animations and responsive design',
    preview: '/placeholder-portfolio.jpg',
    tech: ['ReactJS', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/dhruvpanchal/portfolio',
    live: 'https://dhruvpanchal.dev',
    isPrivate: false,
    quarter: 'Q2 2024',
    metrics: {
      performance: '95+',
      accessibility: '100',
      seo: '100',
    },
  },
  {
    id: 'hospital-management',
    number: '02',
    type: 'Web App',
    title: 'Hospital Management System',
    description: 'Complete hospital management solution with patient records, appointment scheduling, and PDF reporting',
    preview: '/placeholder-hospital.jpg',
    tech: ['HTML', 'JavaScript', 'MySQL', 'TCPDF', 'PHP'],
    github: null,
    live: null,
    isPrivate: true,
    quarter: 'Q3 2023',
    metrics: {
      users: '500+',
      appointments: '2000+',
    },
  },
  {
    id: 'netflix-clone',
    number: '03',
    type: 'Web App',
    title: 'Netflix UI Clone',
    description: 'Pixel-perfect Netflix interface clone with movie browsing, search, and user authentication',
    preview: '/placeholder-netflix.jpg',
    tech: ['React', 'Firebase', 'MovieDB API', 'CSS3'],
    github: 'https://github.com/dhruvpanchal/netflix-clone',
    live: 'https://netflix-clone-dp.vercel.app',
    isPrivate: false,
    quarter: 'Q1 2024',
  },
  {
    id: 'arp-detector',
    number: '04',
    type: 'Security Tool',
    title: 'ARP Spoofing Detector',
    description: 'Network security tool to detect and prevent ARP spoofing attacks in real-time',
    preview: '/placeholder-security.jpg',
    tech: ['Python', 'Scapy', 'Tkinter', 'Network Security'],
    github: null,
    live: null,
    isPrivate: true,
    quarter: 'Q4 2023',
  },
  {
    id: 'ecommerce-dashboard',
    number: '05',
    type: 'UI/UX',
    title: 'E-Commerce Dashboard',
    description: 'Modern admin dashboard design for e-commerce platforms with analytics and inventory management',
    preview: '/placeholder-dashboard.jpg',
    tech: ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping'],
    github: null,
    live: 'https://figma.com/file/ecommerce-dashboard',
    isPrivate: false,
    quarter: 'Q2 2024',
  },
  {
    id: 'task-manager',
    number: '06',
    type: 'Web App',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates and team features',
    preview: '/placeholder-tasks.jpg',
    tech: ['Next.js', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
    github: 'https://github.com/dhruvpanchal/task-manager',
    live: null,
    isPrivate: false,
    quarter: 'Q1 2024',
  },
];

const categories = ['All', 'Web App', 'Security Tool', 'UI/UX'];

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.type === activeCategory);

  return (
    <div className="min-h-screen py-24">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Case Studies</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Curated Work
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From concept to deployment — projects that ship fast and scale well
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-24">
          {filteredProjects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              {/* Project Number & Type */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-6xl md:text-8xl font-bold text-muted-foreground/20">
                  {project.number}
                </span>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {project.type}
                  </span>
                  {project.isPrivate && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock size={12} />
                      Private
                    </span>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <Link href={`/work/${project.id}`} className="block">
                <div className="glass rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                  {/* Project Image */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-6xl">📱</span>
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                      <div className="flex items-center gap-2 text-foreground">
                        <span className="text-sm font-medium">View Case Study</span>
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{project.quarter}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <Github size={16} />
                          Code
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center glass rounded-2xl p-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Like what you see?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's collaborate on your next project
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Start a Project
              <ArrowUpRight size={16} />
            </Link>
            <a
              href="https://github.com/dhruvpanchal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
            >
              <Github size={16} />
              View All on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
