export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string[];
};

export const SEARCH_INDEX: SearchItem[] = [
  { id: 'home', title: 'Home', href: '/', keywords: ['home', 'landing', 'hero'] },
  { id: 'about', title: 'About', subtitle: 'Know who I am', href: '/about', keywords: ['about', 'bio', 'profile', 'story'] },
  { id: 'work', title: 'Work', subtitle: 'My projects', href: '/work', keywords: ['work', 'projects', 'portfolio', 'case studies'] },
  { id: 'resume', title: 'Resume', subtitle: 'Experience & skills', href: '/resume', keywords: ['resume', 'cv', 'experience', 'skills', 'education'] },
  { id: 'blog', title: 'Blog', subtitle: 'Coming soon', href: '/blog', keywords: ['blog', 'articles', 'writing', 'posts'] },
  { id: 'connect', title: 'Connect', subtitle: 'Get in touch', href: '/connect', keywords: ['connect', 'contact', 'email', 'hire', 'collaborate'] },
  { id: 'guestbook', title: 'Guestbook', subtitle: 'Leave your mark', href: '/guestbook', keywords: ['guestbook', 'sign', 'message', 'comments'] },
  { id: 'testimonials', title: 'Testimonials', subtitle: 'What people say', href: '/testimonials', keywords: ['testimonials', 'reviews', 'feedback', 'recommendations'] },
  { id: 'links', title: 'Links', subtitle: 'Find me online', href: '/links', keywords: ['links', 'social', 'profiles', 'urls'] },
  { id: 'feedback', title: 'Feedback', subtitle: 'Share your thoughts', href: '/feedback', keywords: ['feedback', 'suggestions', 'contact', 'report'] },
  { id: 'engine-room', title: 'Engine Room', subtitle: 'Behind the scenes', href: '/engine-room', keywords: ['engine', 'tech', 'stack', 'tools', 'uses'] },
  { id: 'admin', title: 'Admin', subtitle: 'Dashboard', href: '/admin', keywords: ['admin', 'dashboard', 'manage', 'login'] },
];

export function filterSearchIndex(query: string): SearchItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return SEARCH_INDEX;
  return SEARCH_INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
  );
}
