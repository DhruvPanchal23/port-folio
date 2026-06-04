'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram, Mail, MapPin, ArrowUpRight, Zap } from 'lucide-react';

const socials = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Mail, href: 'mailto:hello@alexrivera.dev', label: 'Email' },
];

import { SITE_NAV } from '@/lib/nav-config';

const footerNav = SITE_NAV.filter((l) => l.href !== '/').map((l) =>
  l.href === '/tech' ? { ...l, label: 'Tech Stack' } : l
);

const services = [
  'Web Development',
  'UI/UX Design',
  'Portfolio Design',
  'Branding',
  'SEO Optimization',
  'Automation',
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Top CTA */}
        <div className="py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-mono-custom text-primary mb-4 tracking-wider uppercase">
              Available for work
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Let&apos;s build something
              <span className="text-gradient block">remarkable together.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              I&apos;m currently taking on new projects. Whether you have a clear vision or just an idea, let&apos;s talk.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Start a Project
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <a
                href="mailto:hello@alexrivera.dev"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
              >
                <Mail size={16} />
                Send an Email
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="group mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-xs font-bold text-primary-foreground ring-1 ring-white/10">
                  AR
                </div>
                <span className="font-display font-semibold">Alex Rivera</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Creative Technologist building premium digital experiences.
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={13} />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs">Available for work</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Navigation</h4>
              <ul className="space-y-2.5">
                {footerNav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2.5">
                {services.map((s) => (
                  <li key={s}>
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Connect</h4>
              <div className="flex flex-col gap-2.5">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon size={14} />
                    <span className="link-underline">{label}</span>
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {year} Alex Rivera. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Built with</span>
            <Zap size={11} className="text-primary" />
            <span>Next.js, TypeScript & Supabase</span>
          </div>
          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
