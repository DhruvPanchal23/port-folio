export type CustomLink = {
  id: string;
  label: string;
  url: string;
  description?: string;
};

export type ProfileSettings = {
  image_url: string;
  image_path: string;
  name: string;
  updated_at: string | null;
};

export type ResumeSettings = {
  url: string;
  path: string;
  file_name: string;
  uploaded_at: string | null;
  file_size?: number | null;
};

export type SocialSettings = {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
  spotify: string;
  portfolio_url: string;
  custom_links: CustomLink[];
};

export type SiteSettings = {
  current_version: string;
  last_updated: string;
  copyright_text: string;
  footer_content: string;
  availability_status: string;
  current_location: string;
  open_to_work: boolean;
  open_to_work_headline?: string;
  open_to_work_description?: string;
  footer_cta_title?: string;
  footer_cta_subtitle?: string;
};

export type PortfolioSettingsMap = {
  profile: ProfileSettings;
  resume: ResumeSettings;
  social: SocialSettings;
  site: SiteSettings;
};
