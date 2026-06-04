'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink, Github, Lock } from 'lucide-react';

const categories = ['All', 'Web Dev', 'Cyber Security', 'Graphics', 'UI/UX'];

const projects = [
  {
    title: 'Personal Portfolio',
    category: 'Web Dev',
    description: 'Modern dark glassmorphism portfolio website with smooth animations and responsive design',
    tech: ['ReactJS', 'TailwindCSS', 'TypeScript', 'Framer Motion'],
    github: 'https://github.com/dhruvpanchal/portfolio',
    live: 'https://dhruvpanchal.dev',
    isPrivate: false,
  },
  {
    title: 'Hospital Management System',
    category: 'Web Dev',
    description: 'Complete hospital management solution with patient records, appointment scheduling, and PDF reporting',
    tech: ['HTML', 'JavaScript', 'MySQL', 'TCPDF', 'PHP'],
    github: null,
    live: null,
    isPrivate: true,
  },
  {
    title: 'Netflix UI Clone',
    category: 'Web Dev',
    description: 'Pixel-perfect Netflix interface clone with movie browsing, search, and user authentication',
    tech: ['React', 'Firebase', 'MovieDB API', 'CSS3'],
    github: 'https://github.com/dhruvpanchal/netflix-clone',
    live: 'https://netflix-clone-dp.vercel.app',
    isPrivate: false,
  },
  {
    title: 'ARP Spoofing Detector',
    category: 'Cyber Security',
    description: 'Network security tool to detect and prevent ARP spoofing attacks in real-time',
    tech: ['Python', 'Scapy', 'Tkinter', 'Network Security'],
    github: null,
    live: null,
    isPrivate: true,
  },
  {
    title: 'E-Commerce Dashboard',
    category: 'UI/UX',
    description: 'Modern admin dashboard design for e-commerce platforms with analytics and inventory management',
    tech: ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping'],
    github: null,
    live: 'https://figma.com/file/ecommerce-dashboard',
    isPrivate: false,
  },
  {
    title: 'Task Management App',
    category: 'Web Dev',
    description: 'Collaborative task management application with real-time updates and team features',
    tech: ['NextJS', 'MongoDB', 'Socket.io', 'TailwindCSS'],
    github: 'https://github.com/dhruvpanchal/task-manager',
    live: null,
    isPrivate: false,
  },
];

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen py-24">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            From concepts to commit
          </h1>
          <p className="text-xl text-muted-foreground">
            Here's what I've brought to life
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-primary px-2 py-1 rounded-md bg-primary/10">
                  {project.category}
                </span>
                {project.isPrivate && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock size={12} />
                    Private
                  </span>
                )}
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github size={14} />
                    Code
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink size={14} />
                    Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass rounded-2xl p-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Like what you see?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Let's collaborate on your next project
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Start a Project
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
