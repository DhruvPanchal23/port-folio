import { supabase } from '@/lib/supabase';
import type { ProfileSettings, ResumeSettings } from '@/lib/types/portfolio-settings';
import { upsertPortfolioSetting } from '@/lib/portfolio-settings';
import { validateProfileImage, validateResumeFile } from '@/lib/validators/portfolio-settings';

const RESUME_BUCKET = 'resumes';
const PROFILE_BUCKET = 'profile-images';
const RESUME_PATH = 'resume.pdf';

function getExtension(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromName)) return fromName;
  if (file.type === 'image/jpeg') return 'jpg';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/gif') return 'gif';
  return 'jpg';
}

export async function uploadResumePdf(file: File): Promise<{ data: ResumeSettings | null; error: string | null }> {
  const validationError = validateResumeFile(file);
  if (validationError) return { data: null, error: validationError };

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(RESUME_PATH, file, { upsert: true, contentType: 'application/pdf' });

  if (uploadError) return { data: null, error: uploadError.message };

  const { data: urlData } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(RESUME_PATH);
  const cacheBustedUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  const resume: ResumeSettings = {
    url: cacheBustedUrl,
    path: RESUME_PATH,
    file_name: file.name,
    uploaded_at: new Date().toISOString(),
    file_size: file.size,
  };

  const { data, error } = await upsertPortfolioSetting('resume', resume);
  return { data, error };
}

export async function uploadProfileImage(
  file: File,
  current: ProfileSettings
): Promise<{ data: ProfileSettings | null; error: string | null }> {
  const validationError = validateProfileImage(file);
  if (validationError) return { data: null, error: validationError };

  const ext = getExtension(file);
  const path = `avatar.${ext}`;

  if (current.image_path && current.image_path !== path) {
    await supabase.storage.from(PROFILE_BUCKET).remove([current.image_path]);
  }

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { data: null, error: uploadError.message };

  const { data: urlData } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
  const cacheBustedUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  const profile: ProfileSettings = {
    ...current,
    image_url: cacheBustedUrl,
    image_path: path,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await upsertPortfolioSetting('profile', profile);
  return { data, error };
}

export async function removeProfileImage(
  current: ProfileSettings
): Promise<{ data: ProfileSettings | null; error: string | null }> {
  if (current.image_path) {
    await supabase.storage.from(PROFILE_BUCKET).remove([current.image_path]);
  }

  const profile: ProfileSettings = {
    ...current,
    image_url: '',
    image_path: '',
    updated_at: new Date().toISOString(),
  };

  return upsertPortfolioSetting('profile', profile);
}
