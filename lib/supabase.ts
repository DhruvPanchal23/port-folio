import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
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
  status: string;
  display_status: string;
  featured: boolean;
  is_private: boolean;
  year: string;
  github_url: string;
  live_url: string;
  metrics: Record<string, string>;
  performance_metrics: Record<string, unknown>;
  case_study_sections: unknown[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
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
  status: string;
  sort_order: number;
  created_at: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  status: string;
  sort_order: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  status: string;
  featured: boolean;
  read_time: number;
  seo_title: string;
  seo_description: string;
  og_image: string;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  budget: string;
  project_type: string;
  status: string;
  created_at: string;
};

export type GuestbookEntry = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  message: string;
  avatar_url: string;
  status: string;
  created_at: string;
};

export type FeedbackSubmission = {
  id: string;
  name: string | null;
  email: string | null;
  category: string;
  message: string;
  status: string;
  created_at: string;
};

export type PortfolioSettingRow = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};
