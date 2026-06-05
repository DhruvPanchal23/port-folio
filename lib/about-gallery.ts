import { supabase } from '@/lib/supabase';
import type { AboutGalleryItem } from '@/lib/types/about-gallery';

function mapRow(row: Record<string, unknown>): AboutGalleryItem {
  return {
    id: String(row.id),
    title: String(row.title),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    image_url: String(row.image_url),
    image_path: row.image_path ? String(row.image_path) : null,
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function fetchVisibleAboutGalleryItems(): Promise<AboutGalleryItem[]> {
  const { data, error } = await supabase
    .from('about_gallery_items')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data || []).map(mapRow);
}

export async function fetchAllAboutGalleryItems(): Promise<AboutGalleryItem[]> {
  const { data, error } = await supabase
    .from('about_gallery_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data || []).map(mapRow);
}
