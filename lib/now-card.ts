import { supabase } from '@/lib/supabase';
import type { NowCardConfig, NowCardData, NowCardItem } from '@/lib/types/now-card';
import { nowCardConfigSchema } from '@/lib/validators/now-card';

export const DEFAULT_NOW_CARD_CONFIG: NowCardConfig = {
  section_label: '/now',
  status_label: 'live',
  next_drop_text: 'Next drop',
  estimated_time: '~ 4 weeks',
  tech_badge_top: 'next.js · ts',
  tech_badge_bottom: 'supabase · postgres',
};

const DEFAULT_ITEMS: Omit<NowCardItem, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: 'Cinematica — invite-only film journal',
    status: 'Building',
    status_custom: null,
    timeline_label: 'Now',
    sort_order: 1,
    visible: true,
    link_url: null,
    link_label: null,
    thumbnail_url: null,
    progress_percentage: null,
  },
  {
    title: 'AI in Digital Forensics — research thesis',
    status: 'Shipping',
    status_custom: null,
    timeline_label: "Q1 '26",
    sort_order: 2,
    visible: true,
    link_url: null,
    link_label: null,
    thumbnail_url: null,
    progress_percentage: null,
  },
  {
    title: 'Personal site v3 — this one',
    status: 'Shipped',
    status_custom: null,
    timeline_label: "Q4 '25",
    sort_order: 3,
    visible: true,
    link_url: null,
    link_label: null,
    thumbnail_url: null,
    progress_percentage: null,
  },
];

function mapItem(row: Record<string, unknown>): NowCardItem {
  return {
    id: String(row.id),
    title: String(row.title),
    status: row.status as NowCardItem['status'],
    status_custom: row.status_custom ? String(row.status_custom) : null,
    timeline_label: String(row.timeline_label),
    sort_order: Number(row.sort_order),
    visible: Boolean(row.visible),
    link_url: row.link_url ? String(row.link_url) : null,
    link_label: row.link_label ? String(row.link_label) : null,
    thumbnail_url: row.thumbnail_url ? String(row.thumbnail_url) : null,
    progress_percentage:
      row.progress_percentage != null ? Number(row.progress_percentage) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function parseConfig(raw: unknown): NowCardConfig {
  const result = nowCardConfigSchema.safeParse(raw);
  if (result.success) return result.data;
  return DEFAULT_NOW_CARD_CONFIG;
}

export function getItemStatusLabel(item: Pick<NowCardItem, 'status' | 'status_custom'>): string {
  if (item.status === 'Custom' && item.status_custom?.trim()) {
    return item.status_custom.trim();
  }
  return item.status;
}

export async function fetchNowCardConfig(): Promise<NowCardConfig> {
  const { data, error } = await supabase
    .from('portfolio_settings')
    .select('value')
    .eq('key', 'now')
    .maybeSingle();

  if (error || !data?.value) return DEFAULT_NOW_CARD_CONFIG;
  return parseConfig(data.value);
}

export async function upsertNowCardConfig(
  config: NowCardConfig
): Promise<{ data: NowCardConfig | null; error: string | null }> {
  const parsed = nowCardConfigSchema.safeParse(config);
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Validation failed' };
  }

  const { data: existing } = await supabase
    .from('portfolio_settings')
    .select('id')
    .eq('key', 'now')
    .maybeSingle();

  const payload = {
    key: 'now',
    value: parsed.data,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase.from('portfolio_settings').update(payload).eq('key', 'now')
    : await supabase.from('portfolio_settings').insert(payload);

  if (error) return { data: null, error: error.message };
  return { data: parsed.data, error: null };
}

export async function fetchVisibleNowCardItems(): Promise<NowCardItem[]> {
  const { data, error } = await supabase
    .from('now_card_items')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error || !data?.length) {
    return DEFAULT_ITEMS.map((item, i) => ({
      ...item,
      id: `fallback-${i}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  return data.map(mapItem);
}

export async function fetchAllNowCardItems(): Promise<NowCardItem[]> {
  const { data, error } = await supabase
    .from('now_card_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data || []).map(mapItem);
}

export async function fetchNowCardData(): Promise<NowCardData> {
  const [config, items] = await Promise.all([fetchNowCardConfig(), fetchVisibleNowCardItems()]);
  return { config, items };
}
