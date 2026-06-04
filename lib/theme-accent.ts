export const ACCENT_STORAGE_KEY = 'portfolio-accent';

export const ACCENT_PRESETS = [
  { id: 'default', label: 'Cyan', swatch: 'hsl(187 92% 58%)' },
  { id: 'ocean', label: 'Ocean', swatch: 'hsl(190 85% 48%)' },
  { id: 'violet', label: 'Violet', swatch: 'hsl(262 83% 58%)' },
  { id: 'ember', label: 'Ember', swatch: 'hsl(18 88% 55%)' },
  { id: 'aurora', label: 'Aurora', swatch: 'hsl(165 70% 42%)' },
] as const;

export type AccentId = (typeof ACCENT_PRESETS)[number]['id'];

export function readStoredAccent(): AccentId {
  if (typeof window === 'undefined') return 'default';
  const v = localStorage.getItem(ACCENT_STORAGE_KEY);
  if (v && ACCENT_PRESETS.some((a) => a.id === v)) return v as AccentId;
  return 'default';
}

export function applyAccent(id: AccentId) {
  if (id === 'default') {
    delete document.documentElement.dataset.accent;
  } else {
    document.documentElement.dataset.accent = id;
  }
  localStorage.setItem(ACCENT_STORAGE_KEY, id);
}
