'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { filterSearchIndex } from '@/lib/search-index';
import { useCommandMenu } from '@/components/CommandMenuProvider';
import { ArrowRight, Laptop, Moon, Sun } from 'lucide-react';

export default function SiteCommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => filterSearchIndex(query), [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [setOpen]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith('/#')) {
      router.push('/');
      setTimeout(() => {
        const id = href.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 320);
      return;
    }
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
      <CommandInput
        placeholder="Search pages, actions, anchors…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[min(420px,60vh)]">
        <CommandEmpty>No matches. Try “work”, “contact”, or “admin”.</CommandEmpty>

        <CommandGroup heading="Results">
          {filtered.map((item) => (
            <CommandItem key={item.id} value={`${item.title} ${item.keywords.join(' ')}`} onSelect={() => go(item.href)}>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-medium">{item.title}</span>
                {item.subtitle ? (
                  <span className="truncate text-xs text-muted-foreground">{item.subtitle}</span>
                ) : null}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Appearance">
          <CommandItem
            onSelect={() => {
              setTheme('light');
              setOpen(false);
            }}
          >
            <Sun className="h-4 w-4" />
            Light mode
            {resolvedTheme === 'light' ? <CommandShortcut>active</CommandShortcut> : null}
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme('dark');
              setOpen(false);
            }}
          >
            <Moon className="h-4 w-4" />
            Dark mode
            {resolvedTheme === 'dark' ? <CommandShortcut>active</CommandShortcut> : null}
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme('system');
              setOpen(false);
            }}
          >
            <Laptop className="h-4 w-4" />
            System theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
