export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dhruv Panchal',
  url: 'https://dhruvpanchal.dev',
  email: 'dhruvpanchal.dev@gmail.com',
  jobTitle: 'Full Stack Developer & Designer',
  description: 'Full-stack developer, graphic designer & creative technologist. I craft digital experiences you\'ll never forget.',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Sardar Vallabhbhai National Institute of Technology',
  },
  knowsAbout: [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'UI/UX Design',
    'Full Stack Development',
    'Graphic Design',
    'Web Development',
  ],
  sameAs: [
    'https://github.com/dhruvpanchal',
    'https://linkedin.com/in/dhruv-panchal',
    'https://twitter.com/dhruvpanchal',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dhruv Panchal - Portfolio',
  url: 'https://dhruvpanchal.dev',
  description: 'Portfolio website of Dhruv Panchal - Full Stack Developer & Designer',
  author: {
    '@type': 'Person',
    name: 'Dhruv Panchal',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://dhruvpanchal.dev/?s={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  dateCreated: '2024-01-01T00:00:00+00:00',
  dateModified: '2026-06-07T12:00:00+00:00',
  mainEntity: personSchema,
};

import type { BlogPostRecord, ProjectRecord } from '@/lib/types/cms';

export function getBlogPostSchema(post: BlogPostRecord) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 150),
    image: post.cover_image || 'https://dhruvpanchal.dev/og-image.png',
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: 'Dhruv Panchal',
      url: 'https://dhruvpanchal.dev',
    },
    publisher: {
      '@type': 'Person',
      name: 'Dhruv Panchal',
      url: 'https://dhruvpanchal.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dhruvpanchal.dev/blog/${post.slug}`,
    },
  };
}

export function getProjectSchema(project: ProjectRecord) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.cover_image || 'https://dhruvpanchal.dev/og-image.png',
    url: `https://dhruvpanchal.dev/work/${project.slug}`,
    creator: {
      '@type': 'Person',
      name: 'Dhruv Panchal',
      url: 'https://dhruvpanchal.dev',
    },
    publisher: {
      '@type': 'Person',
      name: 'Dhruv Panchal',
      url: 'https://dhruvpanchal.dev',
    },
  };
}

