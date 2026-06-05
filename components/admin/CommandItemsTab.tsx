'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, CreditCard as Edit2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  COMMAND_ICON_OPTIONS,
  type CommandItemRecord,
  fetchAllCommandItems,
  getCommandIcon,
} from '@/lib/command-items';
import { SettingsField, SettingsInput } from '@/components/admin/settings/SettingsFormCard';

type FormState = Omit<CommandItemRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string };

function emptyItem(): FormState {
  return {
    slug: '',
    label: '',
    category: 'Navigate',
    href: '',
    icon: 'Link',
    hint: '',
    keywords: [],
    external: false,
    enabled: true,
    sort_order: 0,
  };
}

export default function CommandItemsTab() {
  const [items, setItems] = useState<CommandItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyItem());
  const [keywordsInput, setKeywordsInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchAllCommandItems();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ ...emptyItem(), sort_order: items.length });
    setKeywordsInput('');
    setOpen(true);
  };

  const openEdit = (item: CommandItemRecord) => {
    setForm(item);
    setKeywordsInput(item.keywords.join(', '));
    setOpen(true);
  };

  const save = async () => {
    if (!form.label.trim() || !form.href.trim()) {
      return toast.error('Label and href are required');
    }
    const slug = form.slug.trim() || form.label.toLowerCase().replace(/\s+/g, '-');
    setSaving(true);
    const payload = {
      slug,
      label: form.label.trim(),
      category: form.category.trim(),
      href: form.href.trim(),
      icon: form.icon,
      hint: form.hint.trim(),
      keywords: keywordsInput.split(',').map((k) => k.trim()).filter(Boolean),
      external: form.external,
      enabled: form.enabled,
      sort_order: form.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { error } = form.id
      ? await supabase.from('command_items').update(payload).eq('id', form.id)
      : await supabase.from('command_items').insert(payload);

    setSaving(false);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(form.id ? 'Command updated' : 'Command created');
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this command item?')) return;
    const { error } = await supabase.from('command_items').delete().eq('id', id);
    if (error) return toast.error('Delete failed', { description: error.message });
    toast.success('Command deleted');
    load();
  };

  const reorder = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((i) => i.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      supabase.from('command_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('command_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    load();
  };

  const toggleEnabled = async (item: CommandItemRecord) => {
    const { error } = await supabase
      .from('command_items')
      .update({ enabled: !item.enabled, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (error) return toast.error('Update failed', { description: error.message });
    toast.success(item.enabled ? 'Command disabled' : 'Command enabled');
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
          <h2 className="font-display text-xl font-bold">Command Menu (Ctrl+K)</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage items shown in the site command palette.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm">
          <Plus size={14} /> Add Command
        </button>
      </div>

      <div className="space-y-2">
        {sorted.map((item) => {
          const Icon = getCommandIcon(item.icon);
          return (
            <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-primary shrink-0">
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.label}</span>
                  {!item.enabled && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Disabled</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {item.category} · {item.href}
                </div>
              </div>
              <button onClick={() => reorder(item.id, 'up')} className="p-1.5 rounded-lg border border-border"><ChevronUp size={14} /></button>
              <button onClick={() => reorder(item.id, 'down')} className="p-1.5 rounded-lg border border-border"><ChevronDown size={14} /></button>
              <button onClick={() => toggleEnabled(item)} className="text-xs px-2 py-1 rounded-full border">
                {item.enabled ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted"><Edit2 size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card border border-border">
            <div className="p-5 border-b flex justify-between">
              <h3 className="font-bold">{form.id ? 'Edit Command' : 'New Command'}</h3>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="p-5 space-y-4">
              <SettingsField label="Label *"><SettingsInput value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></SettingsField>
              <SettingsField label="Slug"><SettingsInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from label" /></SettingsField>
              <SettingsField label="Category"><SettingsInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></SettingsField>
              <SettingsField label="Href *"><SettingsInput value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} /></SettingsField>
              <SettingsField label="Icon">
                <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm">
                  {COMMAND_ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </SettingsField>
              <SettingsField label="Hint (keyboard shortcut label)"><SettingsInput value={form.hint} onChange={(e) => setForm({ ...form, hint: e.target.value })} /></SettingsField>
              <SettingsField label="Keywords (comma-separated)"><SettingsInput value={keywordsInput} onChange={(e) => setKeywordsInput(e.target.value)} /></SettingsField>
              <SettingsField label="Sort Order"><SettingsInput type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></SettingsField>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.external} onChange={(e) => setForm({ ...form, external: e.target.checked })} /> External link</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Enabled</label>
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
