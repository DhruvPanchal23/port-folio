'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, CreditCard as Edit2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchAllAboutGalleryItems } from '@/lib/about-gallery';
import type { AboutGalleryItem } from '@/lib/types/about-gallery';
import { aboutGalleryItemSchema } from '@/lib/validators/about-gallery';
import { deleteCmsImage } from '@/lib/storage/cms-upload';
import ImageUploadField from '@/components/admin/cms/ImageUploadField';
import { SettingsField, SettingsInput } from '@/components/admin/settings/SettingsFormCard';

type FormState = Omit<AboutGalleryItem, 'id' | 'created_at' | 'updated_at'> & { id?: string };

function emptyItem(sort: number): FormState {
  return {
    title: '',
    subtitle: null,
    image_url: '',
    image_path: null,
    sort_order: sort,
    visible: true,
  };
}

export default function AboutGalleryTab() {
  const [items, setItems] = useState<AboutGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyItem(0));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchAllAboutGalleryItems();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(emptyItem(items.length));
    setOpen(true);
  };

  const openEdit = (item: AboutGalleryItem) => {
    setForm({ ...item });
    setOpen(true);
  };

  const save = async () => {
    const parsed = aboutGalleryItemSchema.safeParse(form);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }

    setSaving(true);
    const row = { ...parsed.data, updated_at: new Date().toISOString() };
    const { error } = form.id
      ? await supabase.from('about_gallery_items').update(row).eq('id', form.id)
      : await supabase.from('about_gallery_items').insert(row);

    setSaving(false);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(form.id ? 'Card updated' : 'Card created');
    setOpen(false);
    load();
  };

  const remove = async (item: AboutGalleryItem) => {
    if (!confirm('Delete this gallery card?')) return;
    const { error } = await supabase.from('about_gallery_items').delete().eq('id', item.id);
    if (error) return toast.error('Delete failed', { description: error.message });
    if (item.image_path) await deleteCmsImage(item.image_path);
    toast.success('Card deleted');
    load();
  };

  const reorder = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((i) => i.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    const results = await Promise.all([
      supabase.from('about_gallery_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('about_gallery_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    const error = results.find((r) => r.error)?.error;
    if (error) return toast.error('Reorder failed', { description: error.message });
    toast.success('Order updated');
    load();
  };

  const toggleVisible = async (item: AboutGalleryItem) => {
    const { error } = await supabase
      .from('about_gallery_items')
      .update({ visible: !item.visible, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (error) return toast.error('Update failed', { description: error.message });
    toast.success(item.visible ? 'Card hidden' : 'Card visible');
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold">About Gallery</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage stacked identity cards on the About page carousel.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm"
        >
          <Plus size={14} /> Add Card
        </button>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            No gallery cards yet. Add cards or the About page will fall back to the profile image.
          </div>
        ) : (
          sorted.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="w-14 h-[4.5rem] rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{item.title}</span>
                  {!item.visible && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
                {item.subtitle ? (
                  <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                ) : null}
              </div>
              <button onClick={() => reorder(item.id, 'up')} className="p-1.5 rounded-lg border border-border">
                <ChevronUp size={14} />
              </button>
              <button onClick={() => reorder(item.id, 'down')} className="p-1.5 rounded-lg border border-border">
                <ChevronDown size={14} />
              </button>
              <button onClick={() => toggleVisible(item)} className="text-xs px-2 py-1 rounded-full border">
                {item.visible ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted">
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => remove(item)}
                className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card border border-border">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-bold">{form.id ? 'Edit Card' : 'New Card'}</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
                Close
              </button>
            </div>
            <div className="p-5 space-y-4">
              <SettingsField label="Title *">
                <SettingsInput
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="I Code"
                />
              </SettingsField>
              <SettingsField label="Subtitle">
                <SettingsInput
                  value={form.subtitle || ''}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value || null })}
                  placeholder="Optional"
                />
              </SettingsField>
              <ImageUploadField
                label="Image *"
                folder="about"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                onUploaded={(_url, path) => setForm((f) => ({ ...f, image_path: path }))}
              />
              <SettingsField label="Sort Order">
                <SettingsInput
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
              </SettingsField>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                />
                Visible on About page
              </label>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border text-sm">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
