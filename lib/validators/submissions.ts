import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
});

export const feedbackFormSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal('')),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Enter a valid email'),
  category: z.enum(['general', 'suggestion', 'bug', 'appreciation']),
  message: z.string().trim().min(10, 'Feedback must be at least 10 characters').max(5000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;
