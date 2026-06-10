import { supabase } from '@/lib/supabase';
import type {
  EngineRoomCtaButton,
  EngineRoomData,
  EngineRoomNavLink,
  EngineRoomPageConfig,
  EngineRoomSection,
  EngineRoomSectionItem,
  EngineRoomStat,
} from '@/lib/types/engine-room';
import { engineRoomPageConfigSchema } from '@/lib/validators/engine-room';
import {
  Zap,
  Code2,
  Headphones,
  Monitor,
  Palette,
  Terminal,
  Chrome,
  Wrench,
  Cpu,
  type LucideIcon,
} from 'lucide-react';

export const DEFAULT_ENGINE_ROOM_CONFIG: EngineRoomPageConfig = {
  title: 'Engine Room',
  subtitle: 'The tools & gear that power my work',
  description: '',
  footer_message: '',
  empty_state_title: 'Nothing to show yet',
  empty_state_message: 'Check back soon — the engine room is being tuned up.',
  error_state_title: 'Could not load Engine Room',
  error_state_message: 'Please refresh the page or try again later.',
};

export const ENGINE_ROOM_ICON_OPTIONS = [
  'Zap',
  'Code2',
  'Palette',
  'Monitor',
  'Headphones',
  'Terminal',
  'Chrome',
  'Wrench',
  'Cpu',
] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Code2,
  Palette,
  Monitor,
  Headphones,
  Terminal,
  Chrome,
  Wrench,
  Cpu,
};

export function getEngineRoomIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Monitor;
}

function mapStat(row: Record<string, unknown>): EngineRoomStat {
  return {
    id: String(row.id),
    label: String(row.label),
    value: String(row.value),
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapNav(row: Record<string, unknown>): EngineRoomNavLink {
  return {
    id: String(row.id),
    label: String(row.label),
    href: String(row.href),
    external: Boolean(row.external),
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapCta(row: Record<string, unknown>): EngineRoomCtaButton {
  return {
    id: String(row.id),
    label: String(row.label),
    href: String(row.href),
    style: row.style as EngineRoomCtaButton['style'],
    external: Boolean(row.external),
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapSection(row: Record<string, unknown>): EngineRoomSection {
  return {
    id: String(row.id),
    title: String(row.title),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    description: row.description ? String(row.description) : null,
    icon: String(row.icon),
    section_type: row.section_type as EngineRoomSection['section_type'],
    metadata: (row.metadata as EngineRoomSection['metadata']) || {},
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    featured: Boolean(row.featured),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapItem(row: Record<string, unknown>): EngineRoomSectionItem {
  return {
    id: String(row.id),
    section_id: String(row.section_id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    url: row.url ? String(row.url) : null,
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function parseConfig(raw: unknown): EngineRoomPageConfig {
  const result = engineRoomPageConfigSchema.safeParse(raw);
  if (result.success) return result.data;
  return DEFAULT_ENGINE_ROOM_CONFIG;
}

export async function fetchEngineRoomConfig(): Promise<EngineRoomPageConfig> {
  const { data, error } = await supabase
    .from('portfolio_settings')
    .select('value')
    .eq('key', 'engine_room')
    .maybeSingle();

  if (error || !data?.value) return DEFAULT_ENGINE_ROOM_CONFIG;
  return parseConfig(data.value);
}

export async function upsertEngineRoomConfig(
  config: EngineRoomPageConfig
): Promise<{ data: EngineRoomPageConfig | null; error: string | null }> {
  const parsed = engineRoomPageConfigSchema.safeParse(config);
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Validation failed' };
  }

  const { data: existing } = await supabase
    .from('portfolio_settings')
    .select('id')
    .eq('key', 'engine_room')
    .maybeSingle();

  const payload = {
    key: 'engine_room',
    value: parsed.data,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase.from('portfolio_settings').update(payload).eq('key', 'engine_room')
    : await supabase.from('portfolio_settings').insert(payload);

  if (error) return { data: null, error: error.message };
  return { data: parsed.data, error: null };
}

export async function fetchEngineRoomData(visibleOnly = true): Promise<EngineRoomData> {
  const config = await fetchEngineRoomConfig();

  const sectionQuery = supabase.from('engine_room_sections').select('*').order('sort_order');
  const itemsQuery = supabase.from('engine_room_section_items').select('*').order('sort_order');
  const statsQuery = supabase.from('engine_room_stats').select('*').order('sort_order');
  const navQuery = supabase.from('engine_room_nav_links').select('*').order('sort_order');
  const ctaQuery = supabase.from('engine_room_cta_buttons').select('*').order('sort_order');

  if (visibleOnly) {
    sectionQuery.eq('visible', true);
    statsQuery.eq('visible', true);
    navQuery.eq('visible', true);
    ctaQuery.eq('visible', true);
  }

  const [sectionsRes, itemsRes, statsRes, navRes, ctaRes] = await Promise.all([
    sectionQuery,
    itemsQuery,
    statsQuery,
    navQuery,
    ctaQuery,
  ]);

  const sections = (sectionsRes.data || []).map(mapSection);
  const allItems = (itemsRes.data || []).map(mapItem);
  const visibleSectionIds = new Set(sections.map((s) => s.id));

  const sectionItems = visibleOnly
    ? allItems.filter((i) => i.visible && visibleSectionIds.has(i.section_id))
    : allItems;

  return {
    config,
    stats: (statsRes.data || []).map(mapStat),
    navLinks: (navRes.data || []).map(mapNav),
    ctaButtons: (ctaRes.data || []).map(mapCta),
    sections,
    sectionItems,
  };
}

export async function fetchAllEngineRoomStats(): Promise<EngineRoomStat[]> {
  const { data } = await supabase.from('engine_room_stats').select('*').order('sort_order');
  return (data || []).map(mapStat);
}

export async function fetchAllEngineRoomNavLinks(): Promise<EngineRoomNavLink[]> {
  const { data } = await supabase.from('engine_room_nav_links').select('*').order('sort_order');
  return (data || []).map(mapNav);
}

export async function fetchAllEngineRoomCtaButtons(): Promise<EngineRoomCtaButton[]> {
  const { data } = await supabase.from('engine_room_cta_buttons').select('*').order('sort_order');
  return (data || []).map(mapCta);
}

export async function fetchAllEngineRoomSections(): Promise<EngineRoomSection[]> {
  const { data } = await supabase.from('engine_room_sections').select('*').order('sort_order');
  return (data || []).map(mapSection);
}

export async function fetchAllEngineRoomSectionItems(): Promise<EngineRoomSectionItem[]> {
  const { data } = await supabase.from('engine_room_section_items').select('*').order('sort_order');
  return (data || []).map(mapItem);
}

export function groupItemsBySection(
  items: EngineRoomSectionItem[]
): Record<string, EngineRoomSectionItem[]> {
  return items.reduce<Record<string, EngineRoomSectionItem[]>>((acc, item) => {
    if (!acc[item.section_id]) acc[item.section_id] = [];
    acc[item.section_id].push(item);
    return acc;
  }, {});
}
