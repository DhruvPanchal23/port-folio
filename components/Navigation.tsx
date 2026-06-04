'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { SITE_NAV, MORE_NAV } from '@/lib/nav-config';
import ThemeStudioPopover from '@/components/ThemeStudioPopover';
import { useCommandMenu } from '@/components/CommandMenuProvider';
import { cn } from '@/lib/utils';

const SCROLL_SPY_IDS = ['hero', 'about', 'work', 'tech', 'services', 'blog', 'contact'];

function isNavActive(pathname: string, activeSection: string, href: string) {
  if (pathname !== '/') {
    if (href === '/') return false;
    return pathname === href;
  }
  if (href === '/') {
    return activeSection === '' || activeSection === 'hero';
  }
  const id = href.slice(1);
  return activeSection === id;
}

export default function Navigation() {
  const pathname = usePathname();
  const { setOpen } = useCommandMenu();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/i.test(navigator.platform);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-38% 0px -45% 0px' }
    );
    SCROLL_SPY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-border/60 bg-background/80 shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <div className="container-max">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                DP
              </div>
              <div className="hidden flex-col leading-none sm:flex">
                <span className="font-display text-sm font-semibold tracking-tight text-foreground">dhruv</span>
                <span className="font-mono-custom text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Developer & Designer
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-0.5 md:flex">
              {SITE_NAV.map((link) => {
                const active = isNavActive(pathname, activeSection, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 lg:px-4',
                      active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-md bg-muted"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
              
              {/* More Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                  className={cn(
                    'relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 lg:px-4',
                    MORE_NAV.some(link => pathname === link.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {MORE_NAV.some(link => pathname === link.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-muted"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">More</span>
                  <ChevronDown size={14} className={cn('relative z-10 transition-transform', moreDropdownOpen && 'rotate-180')} />
                </button>
                
                <AnimatePresence>
                  {moreDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-background/95 backdrop-blur-xl shadow-lg py-1"
                    >
                      {MORE_NAV.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={cn(
                            'block px-4 py-2 text-sm transition-colors',
                            pathname === link.href
                              ? 'text-foreground bg-muted'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative hidden h-9 items-center gap-2 rounded-lg px-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
                aria-label="Open search"
              >
                <Search size={16} />
                <span className="hidden text-xs font-mono-custom text-muted-foreground/80 lg:inline">
                  {isMac ? '⌘K' : 'Ctrl K'}
                </span>
              </button>

              <ThemeStudioPopover />

              <Link
                href="/connect"
                className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-105 hover:bg-primary/90 active:scale-95 md:flex"
              >
                Connect
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-max py-6">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mb-4 flex w-full items-center gap-3 rounded-lg border border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Search size={16} />
                Search…
                <span className="ml-auto font-mono-custom text-xs">{isMac ? '⌘K' : 'Ctrl K'}</span>
              </button>
              <nav className="flex flex-col gap-1">
                {SITE_NAV.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-muted',
                        isNavActive(pathname, activeSection, link.href)
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="my-2 border-t border-border pt-2">
                  <div className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">More</div>
                  {MORE_NAV.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (SITE_NAV.length + i) * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-muted',
                          pathname === link.href
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 border-t border-border pt-4">
                  <Link
                    href="/connect"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground"
                  >
                    Connect
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
