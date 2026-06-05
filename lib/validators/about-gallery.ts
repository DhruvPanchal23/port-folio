import { z } from 'zod';

export const aboutGalleryItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(80),
  subtitle: z.string().trim().max(120).nullable().optional(),
  image_url: z.string().trim().min(1, 'Image is required'),
  image_path: z.string().trim().nullable().optional(),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
});
