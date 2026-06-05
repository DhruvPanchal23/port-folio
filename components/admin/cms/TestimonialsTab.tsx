'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CreditCard as Edit2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { TestimonialRecord } from '@/lib/types/cms';
import { emptyTestimonial, parseTagsInput } from '@/lib/cms-utils';
import { SettingsField, SettingsInput, SettingsTextarea } from '@/components/admin/settings/SettingsFormCard';
import ImageUploadField from './ImageUploadField';

type TestimonialFormState = Omit<TestimonialRecord, 'id' | 'created_at'> & { id?: string };

function mapRow(row: Record<string, unknown>): TestimonialRecord {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    role: String(row.role || ''),
    company: String(row.company || ''),
    location: String(row.location || ''),
    avatar: String(row.avatar || ''),
    content: String(row.content || ''),
    rating: Number(row.rating) || 5,
    skills_tags: (row.skills_tags as string[]) || [],
    featured: Boolean(row.featured),
    status: (row.status as 'published' | 'draft') || 'draft',
    sort_order: Number(row.sort_order) || 0,
    created_at: String(row.created_at),
  };
}

export default function TestimonialsTab({ createTrigger = 0 }: { createTrigger?: number }) {
  const [items, setItems] = useState<TestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TestimonialFormState>(emptyTestimonial());
  const [skillsInput, setSkillsInput] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setItems((data || []).map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = useCallback(() => {
    setForm(emptyTestimonial());
    setSkillsInput('');
    setOpen(true);
  }, []);

  useEffect(() => {
    if (createTrigger > 0) openCreate();
  }, [createTrigger, openCreate]);
  const openEdit = (t: TestimonialRecord) => { setForm(t); setSkillsInput(t.skills_tags.join(', ')); setOpen(true); };

  const save = async () => {
    if (!form.name.trim() || !form.content.trim()) return toast.error('Name and testimonial are required');
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      avatar: form.avatar,
      content: form.content.trim(),
      rating: Math.min(5, Math.max(1, form.rating)),
      skills_tags: parseTagsInput(skillsInput),
      featured: form.featured,
      status: form.status,
      sort_order: form.sort_order,
    };
    const { error } = form.id
      ? await supabase.from('testimonials').update(payload).eq('id', form.id)
      : await supabase.from('testimonials').insert(payload);
    setSaving(false);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(form.id ? 'Testimonial updated' : 'Testimonial created');
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    toast.success('Deleted');
    load();
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published';
    await supabase.from('testimonials').update({ status: next }).eq('id', id);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Testimonials</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm"><Plus size={14} /> Add Testimonial</button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-card border border-border flex justify-between gap-4">
            <div>
              <div className="font-medium text-sm">{item.name} {item.featured && '★'}</div>
              <div className="text-xs text-muted-foreground">{item.role}, {item.company}</div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.content}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleStatus(item.id, item.status)} className="text-xs px-2 py-1 rounded-full border">{item.status}</button>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted"><Edit2 size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card border border-border">
            <div className="p-5 border-b flex justify-between"><h3 className="font-bold">{form.id ? 'Edit' : 'New'} Testimonial</h3><button onClick={() => setOpen(false)}>Close</button></div>
            <div className="p-5 space-y-4">
              <SettingsField label="Name *"><SettingsInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></SettingsField>
              <SettingsField label="Designation"><SettingsInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></SettingsField>
              <SettingsField label="Company"><SettingsInput value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></SettingsField>
              <SettingsField label="Location"><SettingsInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></SettingsField>
              <ImageUploadField label="Photo" folder="testimonials" value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} />
              <SettingsField label="Rating (1-5)"><SettingsInput type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></SettingsField>
              <SettingsField label="Testimonial *"><SettingsTextarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></SettingsField>
              <SettingsField label="Skills tags (comma-separated)"><SettingsInput value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} /></SettingsField>
              <SettingsField label="Sort Order"><SettingsInput type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></SettingsField>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                <SettingsField label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })} className="px-3 py-2 rounded-lg bg-muted border text-sm"><option value="draft">Draft</option><option value="published">Published</option></select></SettingsField>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
