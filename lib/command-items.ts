import { supabase } from '@/lib/supabase';
import {
  Home,
  User,
  Briefcase,
  FileText,
  BookOpen,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Star,
  Link as LinkIcon,
  MessageSquare,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type CommandItemRecord = {
  id: string;
  slug: string;
  label: string;
  category: string;
  href: string;
  icon: string;
  hint: string;
  keywords: string[];
  external: boolean;
  enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  User,
  Briefcase,
  FileText,
  BookOpen,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Star,
  Link: LinkIcon,
  MessageSquare,
  Settings,
  Sparkles,
};

export function getCommandIcon(name: string): LucideIcon {
  return ICON_MAP[name] || LinkIcon;
}

export const COMMAND_ICON_OPTIONS = Object.keys(ICON_MAP);

function mapRow(row: Record<string, unknown>): CommandItemRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    label: String(row.label),
    category: String(row.category || 'Navigate'),
    href: String(row.href),
    icon: String(row.icon || 'Link'),
    hint: String(row.hint || ''),
    keywords: (row.keywords as string[]) || [],
    external: Boolean(row.external),
    enabled: Boolean(row.enabled),
    sort_order: Number(row.sort_order) || 0,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function fetchEnabledCommandItems(): Promise<CommandItemRecord[]> {
  const { data, error } = await supabase
    .from('command_items')
    .select('*')
    .eq('enabled', true)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch command items:', error.message);
    return [];
  }
  return (data || []).map(mapRow);
}

export async function fetchAllCommandItems(): Promise<CommandItemRecord[]> {
  const { data, error } = await supabase
    .from('command_items')
    .select('*')
    .order('sort_order');

  if (error) return [];
  return (data || []).map(mapRow);
}

export function groupCommandItems(items: CommandItemRecord[]) {
  const groups = new Map<string, CommandItemRecord[]>();
  items.forEach((item) => {
    const list = groups.get(item.category) || [];
    list.push(item);
    groups.set(item.category, list);
  });
  return Array.from(groups.entries()).map(([category, groupItems]) => ({
    category,
    items: groupItems.sort((a, b) => a.sort_order - b.sort_order),
  }));
}
