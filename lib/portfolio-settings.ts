import { supabase } from '@/lib/supabase';
import type {
  ProfileSettings,
  ResumeSettings,
  SocialSettings,
  SiteSettings,
  PortfolioSettingsMap,
} from '@/lib/types/portfolio-settings';
import {
  profileSettingsSchema,
  resumeSettingsSchema,
  socialSettingsSchema,
  siteSettingsSchema,
} from '@/lib/validators/portfolio-settings';

export const SETTINGS_KEYS = {
  profile: 'profile',
  resume: 'resume',
  social: 'social',
  site: 'site',
} as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[keyof typeof SETTINGS_KEYS];

export const DEFAULT_PROFILE: ProfileSettings = {
  image_url: '',
  image_path: '',
  name: 'Dhruv Panchal',
  updated_at: null,
};

export const DEFAULT_RESUME: ResumeSettings = {
  url: '',
  path: 'resume.pdf',
  file_name: '',
  uploaded_at: null,
  file_size: null,
};

export const DEFAULT_SOCIAL: SocialSettings = {
  github: 'https://github.com/dhruvpanchal',
  linkedin: 'https://linkedin.com/in/dhruv-panchal',
  twitter: 'https://twitter.com/dhruvpanchal',
  email: 'dhruvpanchal.dev@gmail.com',
  spotify: 'https://open.spotify.com/album/namastute',
  portfolio_url: 'https://dhruvpanchal.dev',
  custom_links: [],
};

export const DEFAULT_SITE: SiteSettings = {
  current_version: '1.0',
  last_updated: 'July 2025',
  copyright_text: 'Crafted with Coffee, Playlists & Curiosity.',
  footer_content: 'Explore, experiment && say hello',
  availability_status: 'Available for select projects · Feb 2026',
  current_location: 'Surat, IN',
  open_to_work: true,
  open_to_work_headline: "I'm available for full-time roles & freelance projects.",
  open_to_work_description:
    'I thrive on crafting dynamic web applications, and delivering seamless user experiences.',
  footer_cta_title: 'MY SITE',
  footer_cta_subtitle: 'Explore, Connect',
};

const DEFAULTS: PortfolioSettingsMap = {
  profile: DEFAULT_PROFILE,
  resume: DEFAULT_RESUME,
  social: DEFAULT_SOCIAL,
  site: DEFAULT_SITE,
};

const SCHEMAS = {
  profile: profileSettingsSchema,
  resume: resumeSettingsSchema,
  social: socialSettingsSchema,
  site: siteSettingsSchema,
} as const;

function parseSetting<K extends SettingsKey>(key: K, raw: unknown): PortfolioSettingsMap[K] {
  const result = SCHEMAS[key].safeParse(raw);
  if (result.success) return result.data as PortfolioSettingsMap[K];
  return DEFAULTS[key];
}

export async function fetchPortfolioSettings(): Promise<PortfolioSettingsMap> {
  const { data, error } = await supabase.from('portfolio_settings').select('key, value');

  if (error) {
    console.error('Failed to fetch portfolio settings:', error.message);
    return { ...DEFAULTS };
  }

  const map = new Map((data || []).map((row) => [row.key, row.value]));

  return {
    profile: parseSetting('profile', map.get(SETTINGS_KEYS.profile)),
    resume: parseSetting('resume', map.get(SETTINGS_KEYS.resume)),
    social: parseSetting('social', map.get(SETTINGS_KEYS.social)),
    site: parseSetting('site', map.get(SETTINGS_KEYS.site)),
  };
}

export async function upsertPortfolioSetting<K extends SettingsKey>(
  key: K,
  value: PortfolioSettingsMap[K]
): Promise<{ data: PortfolioSettingsMap[K] | null; error: string | null }> {
  const parsed = SCHEMAS[key].safeParse(value);
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Validation failed' };
  }

  const { data: existing } = await supabase
    .from('portfolio_settings')
    .select('id')
    .eq('key', key)
    .maybeSingle();

  const payload = {
    key,
    value: parsed.data,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase.from('portfolio_settings').update(payload).eq('key', key)
    : await supabase.from('portfolio_settings').insert(payload);

  if (error) return { data: null, error: error.message };
  return { data: parsed.data as PortfolioSettingsMap[K], error: null };
}

export function getResumeDownloadUrl(resume: ResumeSettings): string | null {
  if (!resume.url) return null;
  return resume.url;
}

export function getMailtoUrl(email: string): string {
  return email.startsWith('mailto:') ? email : `mailto:${email}`;
}
