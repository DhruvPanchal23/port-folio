import { SITE_NAV } from '@/lib/nav-config';

export type SearchEntry = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string[];
};

/** Static index for universal search; extend with CMS or build-time data later. */
export const SEARCH_INDEX: SearchEntry[] = [
  ...SITE_NAV.map((l) => ({
    id: `nav-${l.href}`,
    title: l.label,
    subtitle: 'Page',
    href: l.href,
    keywords: [l.label.toLowerCase(), 'go', 'open', l.href.replace('/', '') || 'home'],
  })),
  {
    id: 'action-hire',
    title: 'Start a project',
    subtitle: 'Action',
    href: '/contact',
    keywords: ['hire', 'freelance', 'project', 'email', 'contact', 'work together'],
  },
  {
    id: 'anchor-home-about',
    title: 'About section on Home',
    subtitle: 'Scroll target',
    href: '/#about',
    keywords: ['about', 'story', 'home', 'scroll'],
  },
  {
    id: 'anchor-home-work',
    title: 'Work section on Home',
    subtitle: 'Scroll target',
    href: '/#work',
    keywords: ['portfolio', 'projects', 'case studies', 'home'],
  },
  {
    id: 'anchor-home-tech',
    title: 'Tech section on Home',
    subtitle: 'Scroll target',
    href: '/#tech',
    keywords: ['stack', 'tools', 'technologies', 'home'],
  },
];

export function filterSearchIndex(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX;
  return SEARCH_INDEX.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
      e.keywords.some((k) => k.includes(q))
  );
}
