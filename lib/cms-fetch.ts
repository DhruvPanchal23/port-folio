import { supabase } from '@/lib/supabase';
import type { BlogPostRecord, PerformanceMetrics, ProjectRecord, TestimonialRecord } from '@/lib/types/cms';

export function mapProject(row: Record<string, unknown>): ProjectRecord {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    description: String(row.description || ''),
    long_description: String(row.long_description || ''),
    tagline: String(row.tagline || ''),
    cover_image: String(row.cover_image || ''),
    images: (row.images as string[]) || [],
    tech_stack: (row.tech_stack as string[]) || [],
    category: String(row.category || 'Web App'),
    status: (row.status as 'published' | 'draft') || 'draft',
    display_status: (row.display_status as ProjectRecord['display_status']) || 'Shipped',
    featured: Boolean(row.featured),
    is_private: Boolean(row.is_private),
    year: String(row.year || ''),
    github_url: String(row.github_url || ''),
    live_url: String(row.live_url || ''),
    metrics: (row.metrics as Record<string, string>) || {},
    performance_metrics: (row.performance_metrics as PerformanceMetrics) || {},
    case_study_sections: (row.case_study_sections as ProjectRecord['case_study_sections']) || [],
    sort_order: Number(row.sort_order) || 0,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapTestimonial(row: Record<string, unknown>): TestimonialRecord {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    role: String(row.role || ''),
    company: String(row.company || ''),
    location: String(row.location || ''),
    avatar: String(row.avatar || ''),
    content: String(row.content || ''),
    rating: Number(row.rating) || 5,
    skills_tags: (row.skills_tags as string[]) || [],
    featured: Boolean(row.featured),
    status: (row.status as 'published' | 'draft') || 'draft',
    sort_order: Number(row.sort_order) || 0,
    created_at: String(row.created_at),
  };
}

export function mapBlogPost(row: Record<string, unknown>): BlogPostRecord {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    excerpt: String(row.excerpt || ''),
    content: String(row.content || ''),
    cover_image: String(row.cover_image || ''),
    category: String(row.category || 'general'),
    tags: (row.tags as string[]) || [],
    status: (row.status as 'published' | 'draft') || 'draft',
    featured: Boolean(row.featured),
    read_time: Number(row.read_time) || 5,
    seo_title: String(row.seo_title || ''),
    seo_description: String(row.seo_description || ''),
    og_image: String(row.og_image || ''),
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function fetchPublishedProjects(): Promise<ProjectRecord[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('sort_order');
  if (error) {
    console.error(error.message);
    return [];
  }
  return (data || []).map(mapProject);
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error || !data) return null;
  return mapProject(data);
}

export async function fetchPublishedTestimonials(): Promise<TestimonialRecord[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'published')
    .order('sort_order');
  if (error) return [];
  return (data || []).map(mapTestimonial);
}

export async function fetchPublishedBlogPosts(): Promise<BlogPostRecord[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) return [];
  return (data || []).map(mapBlogPost);
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error || !data) return null;
  return mapBlogPost(data);
}
