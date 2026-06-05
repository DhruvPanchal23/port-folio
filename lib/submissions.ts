import { supabase } from '@/lib/supabase';
import {
  contactFormSchema,
  feedbackFormSchema,
  type ContactFormData,
  type FeedbackFormData,
} from '@/lib/validators/submissions';

export async function submitContactForm(
  data: ContactFormData & { project_type?: string; budget?: string }
) {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Validation failed' };
  }

  const { error } = await supabase.from('contact_submissions').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    project_type: data.project_type || null,
    budget: data.budget || null,
    status: 'unread',
  });

  if (error) return { error: error.message };
  return { error: null };
}

export async function submitFeedbackForm(data: FeedbackFormData) {
  const parsed = feedbackFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Validation failed' };
  }

  const { error } = await supabase.from('feedback_submissions').insert({
    name: parsed.data.name || null,
    email: parsed.data.email || null,
    category: parsed.data.category,
    message: parsed.data.message,
    status: 'unread',
  });

  if (error) return { error: error.message };
  return { error: null };
}
