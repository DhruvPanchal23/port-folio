export type DisplayStatus = 'Live' | 'Shipped' | 'Building' | 'Archived';

export type PerformanceMetrics = {
  lighthouse_performance?: number | null;
  accessibility?: number | null;
  seo?: number | null;
  best_practices?: number | null;
  fcp?: string | null;
  lcp?: string | null;
  load_time?: string | null;
  bundle_size?: string | null;
};

export type CaseStudySectionType =
  | 'overview'
  | 'tech_stack'
  | 'key_features'
  | 'metrics'
  | 'links'
  | 'problem'
  | 'challenge'
  | 'solution'
  | 'architecture'
  | 'research'
  | 'design_process'
  | 'development_process'
  | 'screenshots'
  | 'gallery'
  | 'timeline'
  | 'team_role'
  | 'results_impact'
  | 'learnings'
  | 'future_roadmap'
  | 'testimonials'
  | 'custom';

export type CaseStudySection = {
  id: string;
  type: CaseStudySectionType;
  title: string;
  visible: boolean;
  order: number;
  content: Record<string, unknown>;
};

export type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  tagline: string;
  cover_image: string;
  images: string[];
  tech_stack: string[];
  category: string;
  status: 'published' | 'draft';
  display_status: DisplayStatus;
  featured: boolean;
  is_private: boolean;
  year: string;
  github_url: string;
  live_url: string;
  metrics: Record<string, string>;
  performance_metrics: PerformanceMetrics;
  case_study_sections: CaseStudySection[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  skills_tags: string[];
  featured: boolean;
  status: 'published' | 'draft';
  sort_order: number;
  created_at: string;
};

export type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft';
  featured: boolean;
  read_time: number;
  seo_title: string;
  seo_description: string;
  og_image: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const CASE_STUDY_SECTION_LABELS: Record<CaseStudySectionType, string> = {
  overview: 'Overview',
  tech_stack: 'Tech Stack',
  key_features: 'Key Features',
  metrics: 'Metrics',
  links: 'Links',
  problem: 'Problem',
  challenge: 'Challenge',
  solution: 'Solution',
  architecture: 'Architecture',
  research: 'Research',
  design_process: 'Design Process',
  development_process: 'Development Process',
  screenshots: 'Screenshots',
  gallery: 'Gallery',
  timeline: 'Timeline',
  team_role: 'Team & Role',
  results_impact: 'Results & Impact',
  learnings: 'Learnings',
  future_roadmap: 'Future Roadmap',
  testimonials: 'Testimonials',
  custom: 'Custom Section',
};

export const CORE_SECTION_TYPES: CaseStudySectionType[] = [
  'overview',
  'tech_stack',
  'key_features',
  'metrics',
  'links',
];

export const OPTIONAL_SECTION_TYPES: CaseStudySectionType[] = [
  'problem',
  'challenge',
  'solution',
  'architecture',
  'research',
  'design_process',
  'development_process',
  'screenshots',
  'gallery',
  'timeline',
  'team_role',
  'results_impact',
  'learnings',
  'future_roadmap',
  'testimonials',
  'custom',
];
