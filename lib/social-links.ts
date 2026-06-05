import type { LucideIcon } from 'lucide-react';
import { Github, Globe, Linkedin, Mail, Music, Twitter } from 'lucide-react';
import type { SocialSettings } from '@/lib/types/portfolio-settings';
import { getMailtoUrl } from '@/lib/portfolio-settings';

export type SocialLinkItem = {
  icon: LucideIcon;
  href: string;
  label: string;
  handle?: string;
  description?: string;
};

export function getPrimarySocialLinks(social: SocialSettings): SocialLinkItem[] {
  const links: SocialLinkItem[] = [];

  if (social.github) {
    links.push({ icon: Github, href: social.github, label: 'GitHub' });
  }
  if (social.twitter) {
    links.push({ icon: Twitter, href: social.twitter, label: 'X (Twitter)' });
  }
  if (social.linkedin) {
    links.push({ icon: Linkedin, href: social.linkedin, label: 'LinkedIn' });
  }
  if (social.email) {
    links.push({
      icon: Mail,
      href: getMailtoUrl(social.email),
      label: 'Email',
    });
  }

  return links;
}

export function getFooterSocialLinks(social: SocialSettings): SocialLinkItem[] {
  const links: SocialLinkItem[] = [];

  if (social.linkedin) links.push({ icon: Linkedin, href: social.linkedin, label: 'LinkedIn' });
  if (social.github) links.push({ icon: Github, href: social.github, label: 'GitHub' });
  if (social.email) {
    links.push({ icon: Mail, href: getMailtoUrl(social.email), label: 'Mail' });
  }
  if (social.twitter) links.push({ icon: Twitter, href: social.twitter, label: 'X (Twitter)' });

  return links;
}

export function getFeaturedLinks(social: SocialSettings): SocialLinkItem[] {
  const items: SocialLinkItem[] = [];

  if (social.github) {
    items.push({
      icon: Github,
      href: social.github,
      label: 'GitHub',
      handle: social.github.replace(/^https?:\/\/(www\.)?github\.com\//i, '@'),
      description: 'Open source, side quests, and the occasional dotfile.',
    });
  }
  if (social.linkedin) {
    items.push({
      icon: Linkedin,
      href: social.linkedin,
      label: 'LinkedIn',
      handle: social.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//i, ''),
      description: 'The polished, recruiter-friendly version of me.',
    });
  }
  if (social.email) {
    items.push({
      icon: Mail,
      href: getMailtoUrl(social.email),
      label: 'Email',
      handle: social.email,
      description: 'Best for project work, collaborations, or just a hi.',
    });
  }

  return items;
}

export function getSecondarySocialLinks(social: SocialSettings): SocialLinkItem[] {
  const items: SocialLinkItem[] = [];

  if (social.twitter) {
    items.push({
      icon: Twitter,
      href: social.twitter,
      label: 'Twitter / X',
      handle: social.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, '@'),
      description: 'Half-formed thoughts and ship logs.',
    });
  }
  if (social.portfolio_url) {
    items.push({
      icon: Globe,
      href: social.portfolio_url,
      label: 'Personal Site',
      handle: social.portfolio_url.replace(/^https?:\/\//i, ''),
      description: 'You are here. Hi.',
    });
  }
  if (social.spotify) {
    items.push({
      icon: Music,
      href: social.spotify,
      label: 'Spotify',
      handle: 'Spotify',
      description: 'What I am listening to lately.',
    });
  }

  social.custom_links.forEach((link) => {
    if (link.label && link.url) {
      items.push({
        icon: Globe,
        href: link.url,
        label: link.label,
        handle: link.url.replace(/^https?:\/\//i, ''),
        description: link.description || '',
      });
    }
  });

  return items;
}
