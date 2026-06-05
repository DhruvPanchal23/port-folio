'use client';

import { motion } from 'framer-motion';
import type { NowCardConfig, NowCardItem } from '@/lib/types/now-card';
import { getItemStatusLabel } from '@/lib/now-card';

type Props = {
  config: NowCardConfig;
  items: NowCardItem[];
};

export default function NowLiveCard({ config, items }: Props) {
  return (
    <div className="relative w-full">
      <div className="relative rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-2xl shadow-primary/5">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[10px] font-mono-custom uppercase tracking-[0.18em] text-muted-foreground">
            {config.section_label}
          </div>
          <span className="text-[10px] font-mono-custom text-primary">{config.status_label}</span>
        </div>

        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="group flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-12 items-center justify-center rounded-md border border-border bg-muted/40 font-mono-custom text-[10px] text-muted-foreground">
                {item.timeline_label}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground leading-snug">{item.title}</div>
                <div className="mt-0.5 text-[11px] font-mono-custom uppercase tracking-wider text-primary">
                  {getItemStatusLabel(item)}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">{config.next_drop_text}</span>
          <span className="text-xs font-mono-custom text-foreground">{config.estimated_time}</span>
        </div>
      </div>

      {config.tech_badge_top ? (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -left-4 hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-mono-custom text-muted-foreground backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {config.tech_badge_top}
        </motion.div>
      ) : null}

      {config.tech_badge_bottom ? (
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="absolute -bottom-3 -right-2 hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-mono-custom text-muted-foreground backdrop-blur-md"
        >
          {config.tech_badge_bottom}
        </motion.div>
      ) : null}
    </div>
  );
}
