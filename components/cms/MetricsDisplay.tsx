'use client';

import type { PerformanceMetrics } from '@/lib/types/cms';

function ScoreRing({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="glass rounded-xl p-5 text-center">
      <div className="relative mx-auto mb-3 h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${pct} 100`}
            className="text-primary"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-foreground">
          {value}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function MetricsDisplay({
  performance,
  custom,
}: {
  performance?: PerformanceMetrics;
  custom?: Record<string, string>;
}) {
  const scores = [
    { label: 'Performance', value: performance?.lighthouse_performance },
    { label: 'Accessibility', value: performance?.accessibility },
    { label: 'SEO', value: performance?.seo },
    { label: 'Best Practices', value: performance?.best_practices },
  ].filter((s): s is { label: string; value: number } => s.value != null && typeof s.value === 'number');

  const vitals = [
    { label: 'FCP', value: performance?.fcp },
    { label: 'LCP', value: performance?.lcp },
    { label: 'Load Time', value: performance?.load_time },
    { label: 'Bundle Size', value: performance?.bundle_size },
  ].filter((v) => v.value);

  const customEntries = Object.entries(custom || {}).filter(([, v]) => v);

  if (!scores.length && !vitals.length && !customEntries.length) return null;

  return (
    <div className="space-y-6">
      {scores.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {scores.map((s) => (
            <ScoreRing key={s.label} label={s.label} value={Number(s.value)} />
          ))}
        </div>
      )}
      {(vitals.length > 0 || customEntries.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vitals.map((v) => (
            <div key={v.label} className="glass rounded-xl p-5 text-center">
              <div className="font-display text-2xl font-bold text-primary mb-1">{v.value}</div>
              <div className="text-xs text-muted-foreground">{v.label}</div>
            </div>
          ))}
          {customEntries.map(([label, value]) => (
            <div key={label} className="glass rounded-xl p-5 text-center">
              <div className="font-display text-2xl font-bold text-primary mb-1">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
