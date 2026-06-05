import { supabase } from '@/lib/supabase';

const CMS_BUCKET = 'cms-images';
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function extFromFile(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromName)) return fromName;
  if (file.type === 'image/jpeg') return 'jpg';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

export async function uploadCmsImage(
  file: File,
  folder: 'projects' | 'blog' | 'testimonials' | 'about'
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  if (!ALLOWED.includes(file.type)) {
    return { url: null, path: null, error: 'Only JPEG, PNG, WebP, or GIF images are allowed.' };
  }
  if (file.size > MAX_BYTES) {
    return { url: null, path: null, error: 'Image must be 10 MB or smaller.' };
  }

  const path = `${folder}/${crypto.randomUUID()}.${extFromFile(file)}`;
  const { error } = await supabase.storage.from(CMS_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) return { url: null, path: null, error: error.message };

  const { data } = supabase.storage.from(CMS_BUCKET).getPublicUrl(path);
  return { url: `${data.publicUrl}?v=${Date.now()}`, path, error: null };
}

export async function deleteCmsImage(path: string): Promise<void> {
  if (!path) return;
  await supabase.storage.from(CMS_BUCKET).remove([path]);
}
