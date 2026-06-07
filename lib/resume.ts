import { supabase } from '@/lib/supabase';
import type { ResumeSection, ResumeEntry, ResumeData } from '@/lib/types/resume';

function mapSection(row: any): ResumeSection {
  return {
    id: String(row.id),
    title: String(row.title),
    type: row.type as ResumeSection['type'],
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapEntry(row: any): ResumeEntry {
  return {
    id: String(row.id),
    section_id: String(row.section_id),
    title: row.title ? String(row.title) : null,
    subtitle: row.subtitle ? String(row.subtitle) : null,
    date_range: row.date_range ? String(row.date_range) : null,
    location: row.location ? String(row.location) : null,
    description: row.description ? String(row.description) : null,
    details: Array.isArray(row.details) ? row.details.map(String) : [],
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function fetchResumeData(visibleOnly = true): Promise<ResumeData> {
  const sectionQuery = supabase.from('resume_sections').select('*').order('sort_order', { ascending: true });
  const entryQuery = supabase.from('resume_entries').select('*').order('sort_order', { ascending: true });

  if (visibleOnly) {
    sectionQuery.eq('visible', true);
    entryQuery.eq('visible', true);
  }

  const [sectionsRes, entriesRes] = await Promise.all([sectionQuery, entryQuery]);

  if (sectionsRes.error) {
    console.error('Error fetching resume sections:', sectionsRes.error);
  }
  if (entriesRes.error) {
    console.error('Error fetching resume entries:', entriesRes.error);
  }

  const sections = (sectionsRes.data || []).map(mapSection);
  const allEntries = (entriesRes.data || []).map(mapEntry);

  const visibleSectionIds = new Set(sections.map((s) => s.id));

  // If visibleOnly, filter out entries for sections that are not visible
  const entries = visibleOnly
    ? allEntries.filter((e) => visibleSectionIds.has(e.section_id))
    : allEntries;

  return { sections, entries };
}

export async function saveResumeSection(
  section: Partial<ResumeSection> & { title: string; type: string }
): Promise<{ data: ResumeSection | null; error: string | null }> {
  const payload = {
    title: section.title,
    type: section.type,
    sort_order: section.sort_order ?? 0,
    visible: section.visible ?? true,
    updated_at: new Date().toISOString(),
  };

  const query = section.id
    ? supabase.from('resume_sections').update(payload).eq('id', section.id).select().single()
    : supabase.from('resume_sections').insert([payload]).select().single();

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data: mapSection(data), error: null };
}

export async function deleteResumeSection(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('resume_sections').delete().eq('id', id);
  return { error: error ? error.message : null };
}

export async function saveResumeEntry(
  entry: Partial<ResumeEntry> & { section_id: string }
): Promise<{ data: ResumeEntry | null; error: string | null }> {
  const payload = {
    section_id: entry.section_id,
    title: entry.title || null,
    subtitle: entry.subtitle || null,
    date_range: entry.date_range || null,
    location: entry.location || null,
    description: entry.description || null,
    details: entry.details || [],
    sort_order: entry.sort_order ?? 0,
    visible: entry.visible ?? true,
    updated_at: new Date().toISOString(),
  };

  const query = entry.id
    ? supabase.from('resume_entries').update(payload).eq('id', entry.id).select().single()
    : supabase.from('resume_entries').insert([payload]).select().single();

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data: mapEntry(data), error: null };
}

export async function deleteResumeEntry(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('resume_entries').delete().eq('id', id);
  return { error: error ? error.message : null };
}

export async function reorderResumeSections(
  sections: { id: string; sort_order: number }[]
): Promise<{ error: string | null }> {
  // We can perform updates in parallel or sequentially.
  // Using single queries for each to ensure reliable execution.
  const promises = sections.map((sec) =>
    supabase.from('resume_sections').update({ sort_order: sec.sort_order }).eq('id', sec.id)
  );

  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed) return { error: failed.error?.message || 'Failed to reorder sections' };
  return { error: null };
}

export async function reorderResumeEntries(
  entries: { id: string; sort_order: number }[]
): Promise<{ error: string | null }> {
  const promises = entries.map((ent) =>
    supabase.from('resume_entries').update({ sort_order: ent.sort_order }).eq('id', ent.id)
  );

  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed) return { error: failed.error?.message || 'Failed to reorder entries' };
  return { error: null };
}
