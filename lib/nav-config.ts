export const SITE_NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Resume', href: '/resume' },
  { label: 'Blog', href: '/blog' },
] as const;

export const MORE_NAV = [
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Links', href: '/links' },
  { label: 'Feed', href: '/feedback' },
  { label: 'Engine Room', href: '/engine-room' },
] as const;

export type SiteNavItem = (typeof SITE_NAV)[number];
export type MoreNavItem = (typeof MORE_NAV)[number];
