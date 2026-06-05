'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, CreditCard as Edit2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  DEFAULT_NOW_CARD_CONFIG,
  fetchAllNowCardItems,
  fetchNowCardConfig,
  getItemStatusLabel,
  upsertNowCardConfig,
} from '@/lib/now-card';
import { NOW_CARD_STATUSES, type NowCardConfig, type NowCardItem } from '@/lib/types/now-card';
import { nowCardConfigSchema, nowCardItemSchema } from '@/lib/validators/now-card';
import {
  SaveButton,
  SettingsField,
  SettingsFormCard,
  SettingsInput,
} from '@/components/admin/settings/SettingsFormCard';

type ItemFormState = Omit<NowCardItem, 'id' | 'created_at' | 'updated_at'> & { id?: string };

function emptyItem(sortOrder: number): ItemFormState {
  return {
    title: '',
    status: 'Building',
    status_custom: null,
    timeline_label: 'Now',
    sort_order: sortOrder,
    visible: true,
    link_url: null,
    link_label: null,
    thumbnail_url: null,
    progress_percentage: null,
  };
}

function normalizeOptionalUrl(value: string | null | undefined): string | null {
  const trimmed = (value || '').trim();
  return trimmed || null;
}

export default function NowCardTab() {
  const [config, setConfig] = useState<NowCardConfig>(DEFAULT_NOW_CARD_CONFIG);
  const [items, setItems] = useState<NowCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [itemForm, setItemForm] = useState<ItemFormState>(emptyItem(0));
  const [savingItem, setSavingItem] = useState(false);

  const load = useCallback(async () => {
    const [cfg, list] = await Promise.all([fetchNowCardConfig(), fetchAllNowCardItems()]);
    setConfig(cfg);
    setItems(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveConfig = async () => {
    const parsed = nowCardConfigSchema.safeParse(config);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }

    setSavingConfig(true);
    const { data, error } = await upsertNowCardConfig(parsed.data);
    setSavingConfig(false);

    if (error) {
      toast.error('Save failed', { description: error });
      return;
    }

    setConfig(data || parsed.data);
    toast.success('Now card settings saved');
  };

  const openCreate = () => {
    setItemForm(emptyItem(items.length));
    setItemOpen(true);
  };

  const openEdit = (item: NowCardItem) => {
    setItemForm({ ...item });
    setItemOpen(true);
  };

  const saveItem = async () => {
    const payload = {
      ...itemForm,
      status_custom: itemForm.status === 'Custom' ? itemForm.status_custom?.trim() || null : null,
      link_url: normalizeOptionalUrl(itemForm.link_url),
      link_label: itemForm.link_label?.trim() || null,
      thumbnail_url: normalizeOptionalUrl(itemForm.thumbnail_url),
    };

    const parsed = nowCardItemSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }

    if (parsed.data.link_url) {
      try {
        new URL(parsed.data.link_url);
      } catch {
        toast.error('Link URL must be a valid URL');
        return;
      }
    }
    if (parsed.data.thumbnail_url) {
      try {
        new URL(parsed.data.thumbnail_url);
      } catch {
        toast.error('Thumbnail URL must be a valid URL');
        return;
      }
    }

    setSavingItem(true);
    const row = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    const { error } = itemForm.id
      ? await supabase.from('now_card_items').update(row).eq('id', itemForm.id)
      : await supabase.from('now_card_items').insert(row);

    setSavingItem(false);

    if (error) {
      toast.error('Save failed', { description: error.message });
      return;
    }

    toast.success(itemForm.id ? 'Item updated' : 'Item created');
    setItemOpen(false);
    load();
  };

  const removeItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const { error } = await supabase.from('now_card_items').delete().eq('id', id);
    if (error) {
      toast.error('Delete failed', { description: error.message });
      return;
    }
    toast.success('Item deleted');
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
      supabase.from('now_card_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('now_card_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    const error = results.find((r) => r.error)?.error;

    if (error) {
      toast.error('Reorder failed', { description: error.message });
      return;
    }
    toast.success('Order updated');
    load();
  };

  const toggleVisible = async (item: NowCardItem) => {
    const { error } = await supabase
      .from('now_card_items')
      .update({ visible: !item.visible, updated_at: new Date().toISOString() })
      .eq('id', item.id);

    if (error) {
      toast.error('Update failed', { description: error.message });
      return;
    }
    toast.success(item.visible ? 'Item hidden' : 'Item visible');
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
      <h2 className="font-display text-xl font-bold text-foreground mb-2">Now / Live Card</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Manage the /NOW card shown in the hero section on the homepage.
      </p>

      <div className="space-y-6">
        <SettingsFormCard title="Card Header" description="Section label and live status badge.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Section Label">
              <SettingsInput
                value={config.section_label}
                onChange={(e) => setConfig({ ...config, section_label: e.target.value })}
                placeholder="/now"
              />
            </SettingsField>
            <SettingsField label="Status Label">
              <SettingsInput
                value={config.status_label}
                onChange={(e) => setConfig({ ...config, status_label: e.target.value })}
                placeholder="live"
              />
            </SettingsField>
          </div>
        </SettingsFormCard>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Current Items</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Projects and milestones shown in the card.</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {sorted.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                No items yet. Add your first entry.
              </div>
            ) : (
              sorted.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <span className="inline-flex h-6 w-12 items-center justify-center rounded-md border border-border bg-muted/40 font-mono-custom text-[10px] text-muted-foreground shrink-0">
                    {item.timeline_label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{item.title}</span>
                      {!item.visible && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-primary font-mono-custom uppercase tracking-wider mt-0.5">
                      {getItemStatusLabel(item)}
                    </div>
                  </div>
                  <button
                    onClick={() => reorder(item.id, 'up')}
                    className="p-1.5 rounded-lg border border-border"
                    aria-label="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => reorder(item.id, 'down')}
                    className="p-1.5 rounded-lg border border-border"
                    aria-label="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => toggleVisible(item)}
                    className="text-xs px-2 py-1 rounded-full border border-border"
                  >
                    {item.visible ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted">
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <SettingsFormCard title="Footer" description="Next drop line at the bottom of the card.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Next Drop Text">
              <SettingsInput
                value={config.next_drop_text}
                onChange={(e) => setConfig({ ...config, next_drop_text: e.target.value })}
                placeholder="Next drop"
              />
            </SettingsField>
            <SettingsField label="Estimated Time">
              <SettingsInput
                value={config.estimated_time}
                onChange={(e) => setConfig({ ...config, estimated_time: e.target.value })}
                placeholder="~ 4 weeks"
              />
            </SettingsField>
          </div>
        </SettingsFormCard>

        <SettingsFormCard title="Technology Badges" description="Floating chips around the /NOW card.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Top Badge (top-left)">
              <SettingsInput
                value={config.tech_badge_top}
                onChange={(e) => setConfig({ ...config, tech_badge_top: e.target.value })}
                placeholder="next.js · ts"
              />
            </SettingsField>
            <SettingsField label="Bottom Badge (bottom-right)">
              <SettingsInput
                value={config.tech_badge_bottom}
                onChange={(e) => setConfig({ ...config, tech_badge_bottom: e.target.value })}
                placeholder="supabase · postgres"
              />
            </SettingsField>
          </div>
        </SettingsFormCard>

        <SaveButton onClick={saveConfig} loading={savingConfig} label="Save Card Settings" />
      </div>

      {itemOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card border border-border">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">{itemForm.id ? 'Edit Item' : 'New Item'}</h3>
              <button onClick={() => setItemOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                Close
              </button>
            </div>
            <div className="p-5 space-y-4">
              <SettingsField label="Title *">
                <SettingsInput
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                />
              </SettingsField>
              <SettingsField label="Status *">
                <select
                  value={itemForm.status}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, status: e.target.value as ItemFormState['status'] })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                >
                  {NOW_CARD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </SettingsField>
              {itemForm.status === 'Custom' && (
                <SettingsField label="Custom Status Label *">
                  <SettingsInput
                    value={itemForm.status_custom || ''}
                    onChange={(e) => setItemForm({ ...itemForm, status_custom: e.target.value })}
                  />
                </SettingsField>
              )}
              <SettingsField label="Timeline Label *">
                <SettingsInput
                  value={itemForm.timeline_label}
                  onChange={(e) => setItemForm({ ...itemForm, timeline_label: e.target.value })}
                  placeholder="Now, Q1 '26"
                />
              </SettingsField>
              <SettingsField label="Sort Order">
                <SettingsInput
                  type="number"
                  value={itemForm.sort_order}
                  onChange={(e) => setItemForm({ ...itemForm, sort_order: Number(e.target.value) })}
                />
              </SettingsField>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={itemForm.visible}
                  onChange={(e) => setItemForm({ ...itemForm, visible: e.target.checked })}
                />
                Visible on homepage
              </label>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Optional — for future expansion</p>
                <div className="space-y-4">
                  <SettingsField label="Link URL">
                    <SettingsInput
                      value={itemForm.link_url || ''}
                      onChange={(e) => setItemForm({ ...itemForm, link_url: e.target.value })}
                      placeholder="https://"
                    />
                  </SettingsField>
                  <SettingsField label="Link Label">
                    <SettingsInput
                      value={itemForm.link_label || ''}
                      onChange={(e) => setItemForm({ ...itemForm, link_label: e.target.value })}
                    />
                  </SettingsField>
                  <SettingsField label="Project Thumbnail URL">
                    <SettingsInput
                      value={itemForm.thumbnail_url || ''}
                      onChange={(e) => setItemForm({ ...itemForm, thumbnail_url: e.target.value })}
                      placeholder="https://"
                    />
                  </SettingsField>
                  <SettingsField label="Progress Percentage">
                    <SettingsInput
                      type="number"
                      min={0}
                      max={100}
                      value={itemForm.progress_percentage ?? ''}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          progress_percentage: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                    />
                  </SettingsField>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <button onClick={() => setItemOpen(false)} className="px-4 py-2 rounded-xl border text-sm">
                Cancel
              </button>
              <button
                onClick={saveItem}
                disabled={savingItem}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                {savingItem ? 'Saving…' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
