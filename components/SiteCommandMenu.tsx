'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCommandMenu } from './CommandMenuProvider';
import { Search, CornerDownLeft, Sparkles, type LucideIcon } from 'lucide-react';
import {
  fetchEnabledCommandItems,
  getCommandIcon,
  groupCommandItems,
  type CommandItemRecord,
} from '@/lib/command-items';

type CommandItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  hint?: string;
  external?: boolean;
  keywords?: string[];
};

type CommandCategory = {
  category: string;
  items: CommandItem[];
};

function highlight(text: string, term: string) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-primary font-semibold">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

function toCommandItem(record: CommandItemRecord): CommandItem {
  return {
    id: record.slug,
    label: record.label,
    icon: getCommandIcon(record.icon),
    href: record.href,
    hint: record.hint || undefined,
    external: record.external,
    keywords: record.keywords,
  };
}

export default function SiteCommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [commands, setCommands] = useState<CommandCategory[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPod|iPad/i.test(navigator.platform));
  }, []);

  useEffect(() => {
    fetchEnabledCommandItems().then((items) => {
      const grouped = groupCommandItems(items).map((g) => ({
        category: g.category,
        items: g.items.map(toCommandItem),
      }));
      setCommands(grouped);
    });
  }, [open]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return commands
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            it.label.toLowerCase().includes(term) ||
            it.keywords?.some((k) => k.includes(term))
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [search, commands]);

  const allItems = useMemo(() => filtered.flatMap((c) => c.items), [filtered]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      setSearch('');
      setSelectedIndex(0);
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(item.href);
      }
    },
    [router, setOpen]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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
        setSelectedIndex((p) => (p + 1) % Math.max(allItems.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((p) => (p - 1 + allItems.length) % Math.max(allItems.length, 1));
      } else if (e.key === 'Enter' && allItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(allItems[selectedIndex]);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen, allItems, selectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-background/40 backdrop-blur-md"
            data-testid="cmdk-backdrop"
          />

          <div className="fixed inset-0 z-[81] flex items-start justify-center p-4 sm:p-8 md:pt-[14vh] overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl shadow-black/40 backdrop-blur-2xl"
              data-testid="cmdk-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-2/3 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative flex items-center gap-3 border-b border-border px-5 py-4">
                <Search size={16} className="text-primary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command, page, or just vibe…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/70 font-mono-custom"
                  data-testid="cmdk-input"
                />
                <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-border bg-muted/60 px-1.5 font-mono-custom text-[10px] text-muted-foreground">
                  esc
                </kbd>
              </div>

              <div className="relative max-h-[58vh] overflow-y-auto scrollbar-thin py-2">
                {filtered.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <Sparkles size={20} className="mx-auto mb-3 text-primary/70" />
                    <p className="text-sm font-medium text-foreground">No matches.</p>
                  </div>
                ) : (
                  filtered.map((category, catIdx) => (
                    <div key={category.category} className={catIdx > 0 ? 'mt-2' : ''}>
                      <div className="flex items-center gap-2 px-5 py-1.5">
                        <span className="font-mono-custom text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {category.category}
                        </span>
                        <span className="h-px flex-1 bg-border/60" />
                        <span className="font-mono-custom text-[10px] text-muted-foreground/60">
                          {String(category.items.length).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="px-2">
                        {category.items.map((item, itemIndex) => {
                          const globalIndex = filtered
                            .slice(0, catIdx)
                            .reduce((acc, cat) => acc + cat.items.length, 0) + itemIndex;
                          const isSelected = globalIndex === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              data-testid={`cmdk-item-${item.id}`}
                              data-selected={isSelected || undefined}
                              aria-selected={isSelected}
                              role="option"
                              className={`group relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                                isSelected
                                  ? 'bg-primary/10 text-foreground'
                                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                              }`}
                            >
                              {isSelected && (
                                <motion.span
                                  layoutId="cmdk-indicator"
                                  className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                                />
                              )}

                              <span
                                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                  isSelected
                                    ? 'border-primary/40 bg-primary/10 text-primary'
                                    : 'border-border bg-background/40 text-muted-foreground'
                                }`}
                              >
                                <Icon size={15} />
                              </span>

                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium leading-tight truncate">
                                  {highlight(item.label, search)}
                                </div>
                                <div className="mt-0.5 font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground/70 truncate">
                                  {item.external ? new URL(item.href).hostname : item.href}
                                </div>
                              </div>

                              {item.hint && (
                                <kbd
                                  className={`hidden sm:inline-flex h-6 items-center justify-center rounded-md border px-2 font-mono-custom text-[10px] tracking-wider ${
                                    isSelected
                                      ? 'border-primary/40 bg-primary/10 text-primary'
                                      : 'border-border bg-muted/40 text-muted-foreground'
                                  }`}
                                >
                                  {item.hint}
                                </kbd>
                              )}
                              {isSelected && !item.hint && (
                                <CornerDownLeft size={13} className="text-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/20 px-5 py-2.5">
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-background/60 px-1 font-mono-custom text-[10px]">↑</kbd>
                    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-background/60 px-1 font-mono-custom text-[10px]">↓</kbd>
                    move
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-background/60 px-1.5 font-mono-custom text-[10px]">↵</kbd>
                    open
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                  <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-background/60 px-1.5 font-mono-custom text-[10px]">
                    {isMac ? '⌘' : 'Ctrl'} K
                  </kbd>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
