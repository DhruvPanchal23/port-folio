import { z } from 'zod';
import { ENGINE_ROOM_CTA_STYLES, ENGINE_ROOM_SECTION_TYPES } from '@/lib/types/engine-room';

export const engineRoomPageConfigSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().max(200),
  description: z.string().trim().max(1000),
  footer_message: z.string().trim().max(500),
  empty_state_title: z.string().trim().min(1).max(120),
  empty_state_message: z.string().trim().max(500),
  error_state_title: z.string().trim().min(1).max(120),
  error_state_message: z.string().trim().max(500),
});

export const engineRoomStatSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(80),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
});

export const engineRoomNavLinkSchema = z.object({
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(500),
  external: z.boolean(),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
});

export const engineRoomCtaSchema = z.object({
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(500),
  style: z.enum(ENGINE_ROOM_CTA_STYLES),
  external: z.boolean(),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
});

export const engineRoomSectionSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().max(200).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  icon: z.string().trim().min(1).max(40),
  section_type: z.enum(ENGINE_ROOM_SECTION_TYPES),
  metadata: z.record(z.unknown()).optional(),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
  featured: z.boolean(),
});

export const engineRoomSectionItemSchema = z.object({
  section_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300).nullable().optional(),
  url: z.string().trim().max(500).nullable().optional(),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
});
