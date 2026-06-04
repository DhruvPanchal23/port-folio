'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCommandMenu } from './CommandMenuProvider';
import { 
  Search, 
  Home, 
  User, 
  Briefcase, 
  FileText, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter,
  BookOpen,
  Star,
  Link as LinkIcon,
  MessageSquare,
  Settings,
  ArrowRight,
} from 'lucide-react';

const commands = [
  {
    category: 'Pages',
    items: [
      { id: 'home', label: 'Home', icon: Home, href: '/', keywords: ['home', 'landing'] },
      { id: 'about', label: 'About', icon: User, href: '/about', keywords: ['about', 'bio', 'profile'] },
      { id: 'work', label: 'Work', icon: Briefcase, href: '/work', keywords: ['work', 'projects', 'portfolio'] },
      { id: 'resume', label: 'Resume', icon: FileText, href: '/resume', keywords: ['resume', 'cv', 'experience'] },
      { id: 'blog', label: 'Blog', icon: BookOpen, href: '/blog', keywords: ['blog', 'articles', 'writing'] },
    ],
  },
  {
    category: 'Connect',
    items: [
      { id: 'contact', label: 'Get in Touch', icon: Mail, href: '/connect', keywords: ['contact', 'email', 'connect'] },
      { id: 'guestbook', label: 'Guestbook', icon: MessageSquare, href: '/guestbook', keywords: ['guestbook', 'sign', 'message'] },
      { id: 'testimonials', label: 'Testimonials', icon: Star, href: '/testimonials', keywords: ['testimonials', 'reviews'] },
      { id: 'feedback', label: 'Send Feedback', icon: MessageSquare, href: '/feedback', keywords: ['feedback', 'suggest'] },
    ],
  },
  {
    category: 'Links',
    items: [
      { id: 'github', label: 'GitHub', icon: Github, href: 'https://github.com/dhruvpanchal', external: true },
      { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/dhruv-panchal', external: true },
      { id: 'twitter', label: 'Twitter', icon: Twitter, href: 'https://twitter.com/dhruvpanchal', external: true },
      { id: 'all-links', label: 'All Links', icon: LinkIcon, href: '/links', keywords: ['links', 'social'] },
    ],
  },
  {
    category: 'More',
    items: [
      { id: 'engine-room', label: 'Engine Room', icon: Settings, href: '/engine-room', keywords: ['uses', 'tools', 'setup'] },
      { id: 'admin', label: 'Admin', icon: Settings, href: '/admin', keywords: ['admin', 'dashboard', 'manage'] },
    ],
  },
];

export default function SiteCommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filteredCommands = commands.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const searchLower = search.toLowerCase();
      return (
        item.label.toLowerCase().includes(searchLower) ||
        item.keywords?.some(k => k.includes(searchLower))
      );
    }),
  })).filter(category => category.items.length > 0);

  const allItems = filteredCommands.flatMap(c => c.items);

  const handleSelect = useCallback((item: any) => {
    setOpen(false);
    setSearch('');
    setSelectedIndex(0);

    if (item.external) {
      window.open(item.href, '_blank');
    } else {
      router.push(item.href);
    }
  }, [router, setOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }

      if (!open) return;

      if (e.key === 'Escape') {
        setOpen(false);
        setSearch('');
        setSelectedIndex(0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter' && allItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(allItems[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen, allItems, selectedIndex, handleSelect]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Command Menu */}
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 md:p-16 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for pages, links, or actions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono text-muted-foreground bg-muted rounded border border-border">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No results found for "{search}"
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredCommands.map((category, categoryIndex) => (
                      <div key={category.category} className={categoryIndex > 0 ? 'mt-3' : ''}>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category.category}
                        </div>
                        {category.items.map((item, itemIndex) => {
                          const globalIndex = filteredCommands
                            .slice(0, categoryIndex)
                            .reduce((acc, cat) => acc + cat.items.length, 0) + itemIndex;
                          const isSelected = globalIndex === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                isSelected
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-foreground hover:bg-muted'
                              }`}
                            >
                              <Icon size={18} className="flex-shrink-0" />
                              <span className="flex-1 text-left font-medium">{item.label}</span>
                              {isSelected && (
                                <ArrowRight size={16} className="text-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↵</kbd>
                      <span>Select</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">ESC</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
