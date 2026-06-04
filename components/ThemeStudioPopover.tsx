'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Laptop, Moon, Palette, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ACCENT_PRESETS,
  applyAccent,
  readStoredAccent,
  type AccentId,
} from '@/lib/theme-accent';

export default function ThemeStudioPopover() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [accent, setAccent] = useState<AccentId>('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAccent(readStoredAccent());
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Theme studio" disabled>
        <Palette size={16} />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Theme and accent"
        >
          <Palette size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 border-border/80 bg-popover/95 p-4 backdrop-blur-xl">
        <div className="mb-3 font-display text-sm font-semibold text-foreground">Appearance</div>
        <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
          Mode and accent stay in sync across the site. Hue shifts are subtle so the dark personality stays intact.
        </p>

        <div className="mb-4 grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {(
            [
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Laptop, label: 'Auto' },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md py-2 text-[11px] font-medium transition-colors',
                theme === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Accent</div>
        <div className="grid grid-cols-5 gap-2">
          {ACCENT_PRESETS.map((a) => (
            <button
              key={a.id}
              type="button"
              title={a.label}
              onClick={() => {
                setAccent(a.id);
                applyAccent(a.id);
              }}
              className={cn(
                'flex h-10 flex-col items-center justify-center rounded-lg border transition-all',
                accent === a.id
                  ? 'border-primary ring-1 ring-primary/40'
                  : 'border-border/80 hover:border-foreground/20'
              )}
            >
              <span className="h-3 w-3 rounded-full shadow-sm" style={{ background: a.swatch }} />
              <span className="mt-1 max-w-full truncate px-0.5 text-[9px] font-medium text-muted-foreground">
                {a.label}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/80">
          Resolved: <span className="font-mono-custom text-foreground/80">{resolvedTheme}</span>
        </p>
      </PopoverContent>
    </Popover>
  );
}
