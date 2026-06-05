import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (val) => val === '' || /^https?:\/\/.+/i.test(val),
    'Must be a valid URL starting with http:// or https://'
  );

const emailField = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Must be a valid email address');

export const customLinkSchema = z.object({
  id: z.string().uuid(),
  label: z.string().trim().min(1, 'Label is required').max(80),
  url: z
    .string()
    .trim()
    .min(1, 'URL is required')
    .refine(
      (val) => /^https?:\/\/.+/i.test(val) || val.startsWith('mailto:') || val.startsWith('/'),
      'Must be a valid URL, mailto link, or relative path'
    ),
  description: z.string().trim().max(200).optional().default(''),
});

export const profileSettingsSchema = z.object({
  image_url: z.string(),
  image_path: z.string(),
  name: z.string().trim().min(1, 'Name is required').max(120),
  updated_at: z.string().nullable(),
});

export const resumeSettingsSchema = z.object({
  url: z.string(),
  path: z.string(),
  file_name: z.string(),
  uploaded_at: z.string().nullable(),
  file_size: z.number().nullable().optional(),
});

export const socialSettingsSchema = z.object({
  github: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  email: emailField,
  spotify: optionalUrl,
  portfolio_url: optionalUrl,
  custom_links: z.array(customLinkSchema),
});

export const siteSettingsSchema = z.object({
  current_version: z.string().trim().min(1, 'Version is required').max(20),
  last_updated: z.string().trim().min(1, 'Last updated is required').max(40),
  copyright_text: z.string().trim().min(1, 'Copyright text is required').max(200),
  footer_content: z.string().trim().min(1, 'Footer content is required').max(500),
  availability_status: z.string().trim().min(1, 'Availability status is required').max(120),
  current_location: z.string().trim().min(1, 'Location is required').max(80),
  open_to_work: z.boolean(),
  open_to_work_headline: z.string().trim().max(200).optional().default(''),
  open_to_work_description: z.string().trim().max(500).optional().default(''),
  footer_cta_title: z.string().trim().max(80).optional().default(''),
  footer_cta_subtitle: z.string().trim().max(120).optional().default(''),
});

export const RESUME_MAX_BYTES = 10 * 1024 * 1024;
export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export function validateResumeFile(file: File): string | null {
  if (file.type !== 'application/pdf') return 'Only PDF files are allowed.';
  if (file.size > RESUME_MAX_BYTES) return 'Resume must be 10 MB or smaller.';
  return null;
}

export function validateProfileImage(file: File): string | null {
  if (!PROFILE_IMAGE_TYPES.includes(file.type as (typeof PROFILE_IMAGE_TYPES)[number])) {
    return 'Only JPEG, PNG, WebP, or GIF images are allowed.';
  }
  if (file.size > PROFILE_IMAGE_MAX_BYTES) return 'Image must be 5 MB or smaller.';
  return null;
}
