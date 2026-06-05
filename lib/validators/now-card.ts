import { z } from 'zod';
import { NOW_CARD_STATUSES } from '@/lib/types/now-card';

export const nowCardConfigSchema = z.object({
  section_label: z.string().trim().min(1).max(40),
  status_label: z.string().trim().min(1).max(40),
  next_drop_text: z.string().trim().min(1).max(80),
  estimated_time: z.string().trim().min(1).max(80),
  tech_badge_top: z.string().trim().max(120),
  tech_badge_bottom: z.string().trim().max(120),
});

export const nowCardItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  status: z.enum(NOW_CARD_STATUSES),
  status_custom: z.string().trim().max(60).nullable().optional(),
  timeline_label: z.string().trim().min(1, 'Timeline label is required').max(40),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
  link_url: z.string().trim().max(500).nullable().optional(),
  link_label: z.string().trim().max(80).nullable().optional(),
  thumbnail_url: z.string().trim().max(500).nullable().optional(),
  progress_percentage: z
    .number()
    .int()
    .min(0)
    .max(100)
    .nullable()
    .optional(),
});
