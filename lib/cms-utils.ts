import type {
  BlogPostRecord,
  CaseStudySection,
  CaseStudySectionType,
  PerformanceMetrics,
  ProjectRecord,
  TestimonialRecord,
} from '@/lib/types/cms';
import { CASE_STUDY_SECTION_LABELS, CORE_SECTION_TYPES } from '@/lib/types/cms';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createSection(type: CaseStudySectionType, order: number, title?: string): CaseStudySection {
  return {
    id: crypto.randomUUID(),
    type,
    title: title || CASE_STUDY_SECTION_LABELS[type],
    visible: true,
    order,
    content: defaultSectionContent(type),
  };
}

function defaultSectionContent(type: CaseStudySectionType): Record<string, unknown> {
  switch (type) {
    case 'tech_stack':
    case 'key_features':
    case 'learnings':
    case 'future_roadmap':
      return { items: [] };
    case 'screenshots':
    case 'gallery':
      return { images: [] };
    case 'timeline':
      return { items: [] };
    case 'team_role':
      return { text: '', team: [] };
    case 'results_impact':
      return { text: '', stats: [] };
    case 'links':
      return { github: '', live: '' };
    case 'metrics':
      return {};
    case 'testimonials':
      return { quotes: [] };
    default:
      return { text: '' };
  }
}

export function getDefaultCaseStudySections(project?: Partial<ProjectRecord>): CaseStudySection[] {
  return CORE_SECTION_TYPES.map((type, i) => {
    const section = createSection(type, i);
    if (type === 'overview' && project?.long_description) {
      section.content = { text: project.long_description };
    }
    if (type === 'tech_stack' && project?.tech_stack?.length) {
      section.content = { items: project.tech_stack };
    }
    if (type === 'links') {
      section.content = { github: project?.github_url || '', live: project?.live_url || '' };
    }
    return section;
  });
}

export function sortSections(sections: CaseStudySection[]): CaseStudySection[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

export function reorderSections(sections: CaseStudySection[], id: string, direction: 'up' | 'down'): CaseStudySection[] {
  const sorted = sortSections(sections);
  const idx = sorted.findIndex((s) => s.id === id);
  if (idx < 0) return sections;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= sorted.length) return sections;
  const next = [...sorted];
  [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
  return next.map((s, i) => ({ ...s, order: i }));
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function parseTechInput(value: string): string[] {
  return parseTagsInput(value);
}

export function emptyProject(): Omit<ProjectRecord, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: '',
    slug: '',
    description: '',
    long_description: '',
    tagline: '',
    cover_image: '',
    images: [],
    tech_stack: [],
    category: 'Web App',
    status: 'draft',
    display_status: 'Shipped',
    featured: false,
    is_private: false,
    year: new Date().getFullYear().toString(),
    github_url: '',
    live_url: '',
    metrics: {},
    performance_metrics: {},
    case_study_sections: getDefaultCaseStudySections(),
    sort_order: 0,
  };
}

export function emptyBlogPost(): Omit<BlogPostForm, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'general',
    tags: [],
    status: 'draft',
    featured: false,
    read_time: 5,
    seo_title: '',
    seo_description: '',
    og_image: '',
    published_at: null,
  };
}

export type BlogPostForm = Omit<BlogPostRecord, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export function emptyTestimonial(): Omit<TestimonialRecord, 'id' | 'created_at'> {
  return {
    name: '',
    role: '',
    company: '',
    location: '',
    avatar: '',
    content: '',
    rating: 5,
    skills_tags: [],
    featured: false,
    status: 'draft',
    sort_order: 0,
  };
}

export type TestimonialForm = TestimonialRecord;

export function metricsToCardItems(
  metrics: Record<string, string>,
  performance: PerformanceMetrics
): { label: string; value: string }[] {
  const items: { label: string; value: string }[] = [];
  Object.entries(metrics || {}).forEach(([label, value]) => {
    if (value) items.push({ label, value });
  });
  if (performance.lighthouse_performance != null) {
    items.push({ label: 'Lighthouse', value: String(performance.lighthouse_performance) });
  }
  if (performance.load_time) items.push({ label: 'Load Time', value: performance.load_time });
  return items.slice(0, 3);
}
