'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, CreditCard as Edit2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  DEFAULT_ENGINE_ROOM_CONFIG,
  ENGINE_ROOM_ICON_OPTIONS,
  fetchAllEngineRoomCtaButtons,
  fetchAllEngineRoomNavLinks,
  fetchAllEngineRoomSectionItems,
  fetchAllEngineRoomSections,
  fetchAllEngineRoomStats,
  fetchEngineRoomConfig,
  getEngineRoomIcon,
  upsertEngineRoomConfig,
} from '@/lib/engine-room';
import {
  ENGINE_ROOM_CTA_STYLES,
  ENGINE_ROOM_SECTION_TYPES,
  type EngineRoomCtaButton,
  type EngineRoomNavLink,
  type EngineRoomPageConfig,
  type EngineRoomSection,
  type EngineRoomSectionItem,
  type EngineRoomStat,
} from '@/lib/types/engine-room';
import {
  engineRoomCtaSchema,
  engineRoomNavLinkSchema,
  engineRoomPageConfigSchema,
  engineRoomSectionItemSchema,
  engineRoomSectionSchema,
  engineRoomStatSchema,
} from '@/lib/validators/engine-room';
import {
  SaveButton,
  SettingsField,
  SettingsFormCard,
  SettingsInput,
  SettingsTextarea,
} from '@/components/admin/settings/SettingsFormCard';

type SectionForm = Omit<EngineRoomSection, 'id' | 'created_at' | 'updated_at'> & { id?: string };
type ItemForm = Omit<EngineRoomSectionItem, 'id' | 'created_at' | 'updated_at'> & { id?: string };

function emptySection(sort: number): SectionForm {
  return {
    title: '',
    subtitle: null,
    description: null,
    icon: 'Monitor',
    section_type: 'tools',
    metadata: {},
    sort_order: sort,
    visible: true,
    featured: false,
  };
}

function emptyItem(sectionId: string, sort: number): ItemForm {
  return {
    section_id: sectionId,
    name: '',
    description: null,
    url: null,
    sort_order: sort,
    visible: true,
  };
}

export default function EngineRoomTab() {
  const [config, setConfig] = useState<EngineRoomPageConfig>(DEFAULT_ENGINE_ROOM_CONFIG);
  const [stats, setStats] = useState<EngineRoomStat[]>([]);
  const [navLinks, setNavLinks] = useState<EngineRoomNavLink[]>([]);
  const [ctaButtons, setCtaButtons] = useState<EngineRoomCtaButton[]>([]);
  const [sections, setSections] = useState<EngineRoomSection[]>([]);
  const [items, setItems] = useState<EngineRoomSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  const [sectionOpen, setSectionOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState<SectionForm>(emptySection(0));
  const [savingSection, setSavingSection] = useState(false);

  const [itemOpen, setItemOpen] = useState(false);
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItem('', 0));
  const [savingItem, setSavingItem] = useState(false);

  const [statForm, setStatForm] = useState<{ id?: string; label: string; value: string }>({
    label: '',
    value: '',
  });
  const [navForm, setNavForm] = useState<{ id?: string; label: string; href: string; external: boolean }>({
    label: '',
    href: '',
    external: false,
  });
  const [ctaForm, setCtaForm] = useState<{
    id?: string;
    label: string;
    href: string;
    style: 'primary' | 'secondary';
    external: boolean;
  }>({ label: '', href: '', style: 'primary', external: false });

  const load = useCallback(async () => {
    const [cfg, st, nav, cta, secs, its] = await Promise.all([
      fetchEngineRoomConfig(),
      fetchAllEngineRoomStats(),
      fetchAllEngineRoomNavLinks(),
      fetchAllEngineRoomCtaButtons(),
      fetchAllEngineRoomSections(),
      fetchAllEngineRoomSectionItems(),
    ]);
    setConfig(cfg);
    setStats(st);
    setNavLinks(nav);
    setCtaButtons(cta);
    setSections(secs);
    setItems(its);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const itemsBySection = useMemo(() => {
    return items.reduce<Record<string, EngineRoomSectionItem[]>>((acc, item) => {
      if (!acc[item.section_id]) acc[item.section_id] = [];
      acc[item.section_id].push(item);
      return acc;
    }, {});
  }, [items]);

  const saveConfig = async () => {
    const parsed = engineRoomPageConfigSchema.safeParse(config);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }
    setSavingConfig(true);
    const { error } = await upsertEngineRoomConfig(parsed.data);
    setSavingConfig(false);
    if (error) return toast.error('Save failed', { description: error });
    toast.success('Page settings saved');
    load();
  };

  const saveSection = async () => {
    const parsed = engineRoomSectionSchema.safeParse(sectionForm);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }
    setSavingSection(true);
    const row = { ...parsed.data, updated_at: new Date().toISOString() };
    const { error } = sectionForm.id
      ? await supabase.from('engine_room_sections').update(row).eq('id', sectionForm.id)
      : await supabase.from('engine_room_sections').insert(row);
    setSavingSection(false);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(sectionForm.id ? 'Section updated' : 'Section created');
    setSectionOpen(false);
    load();
  };

  const saveItem = async () => {
    const parsed = engineRoomSectionItemSchema.safeParse(itemForm);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }
    setSavingItem(true);
    const row = {
      ...parsed.data,
      url: parsed.data.url?.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = itemForm.id
      ? await supabase.from('engine_room_section_items').update(row).eq('id', itemForm.id)
      : await supabase.from('engine_room_section_items').insert(row);
    setSavingItem(false);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(itemForm.id ? 'Item updated' : 'Item created');
    setItemOpen(false);
    load();
  };

  const removeSection = async (id: string) => {
    if (!confirm('Delete this section and all its items?')) return;
    const { error } = await supabase.from('engine_room_sections').delete().eq('id', id);
    if (error) return toast.error('Delete failed', { description: error.message });
    toast.success('Section deleted');
    load();
  };

  const removeItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const { error } = await supabase.from('engine_room_section_items').delete().eq('id', id);
    if (error) return toast.error('Delete failed', { description: error.message });
    toast.success('Item deleted');
    load();
  };

  const reorderSection = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    const results = await Promise.all([
      supabase.from('engine_room_sections').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('engine_room_sections').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    const error = results.find((r) => r.error)?.error;
    if (error) return toast.error('Reorder failed', { description: error.message });
    toast.success('Order updated');
    load();
  };

  const toggleSectionVisible = async (section: EngineRoomSection) => {
    const { error } = await supabase
      .from('engine_room_sections')
      .update({ visible: !section.visible, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (error) return toast.error('Update failed', { description: error.message });
    toast.success(section.visible ? 'Section hidden' : 'Section visible');
    load();
  };

  const saveStat = async () => {
    const parsed = engineRoomStatSchema.safeParse({
      ...statForm,
      sort_order: statForm.id ? stats.find((s) => s.id === statForm.id)?.sort_order ?? stats.length : stats.length,
      visible: true,
    });
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }
    const row = { ...parsed.data, updated_at: new Date().toISOString() };
    const { error } = statForm.id
      ? await supabase.from('engine_room_stats').update(row).eq('id', statForm.id)
      : await supabase.from('engine_room_stats').insert(row);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(statForm.id ? 'Statistic updated' : 'Statistic added');
    setStatForm({ label: '', value: '' });
    load();
  };

  const removeStat = async (id: string) => {
    const { error } = await supabase.from('engine_room_stats').delete().eq('id', id);
    if (error) return toast.error('Delete failed', { description: error.message });
    toast.success('Statistic deleted');
    load();
  };

  const saveNav = async () => {
    const parsed = engineRoomNavLinkSchema.safeParse({
      ...navForm,
      sort_order: navForm.id ? navLinks.find((n) => n.id === navForm.id)?.sort_order ?? navLinks.length : navLinks.length,
      visible: true,
    });
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }
    const row = { ...parsed.data, updated_at: new Date().toISOString() };
    const { error } = navForm.id
      ? await supabase.from('engine_room_nav_links').update(row).eq('id', navForm.id)
      : await supabase.from('engine_room_nav_links').insert(row);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(navForm.id ? 'Link updated' : 'Link added');
    setNavForm({ label: '', href: '', external: false });
    load();
  };

  const removeNav = async (id: string) => {
    const { error } = await supabase.from('engine_room_nav_links').delete().eq('id', id);
    if (error) return toast.error('Delete failed', { description: error.message });
    toast.success('Link deleted');
    load();
  };

  const saveCta = async () => {
    const parsed = engineRoomCtaSchema.safeParse({
      ...ctaForm,
      sort_order: ctaForm.id
        ? ctaButtons.find((c) => c.id === ctaForm.id)?.sort_order ?? ctaButtons.length
        : ctaButtons.length,
      visible: true,
    });
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }
    const row = { ...parsed.data, updated_at: new Date().toISOString() };
    const { error } = ctaForm.id
      ? await supabase.from('engine_room_cta_buttons').update(row).eq('id', ctaForm.id)
      : await supabase.from('engine_room_cta_buttons').insert(row);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(ctaForm.id ? 'CTA updated' : 'CTA added');
    setCtaForm({ label: '', href: '', style: 'primary', external: false });
    load();
  };

  const removeCta = async (id: string) => {
    const { error } = await supabase.from('engine_room_cta_buttons').delete().eq('id', id);
    if (error) return toast.error('Delete failed', { description: error.message });
    toast.success('CTA deleted');
    load();
  };

  const metaField = (key: string, label: string, placeholder?: string) => (
    <SettingsField label={label}>
      <SettingsInput
        value={String((sectionForm.metadata as Record<string, string>)?.[key] || '')}
        onChange={(e) =>
          setSectionForm({
            ...sectionForm,
            metadata: { ...sectionForm.metadata, [key]: e.target.value },
          })
        }
        placeholder={placeholder}
      />
    </SettingsField>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">Engine Room</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Manage the Engine Room page — tools, sections, stats, and navigation.
      </p>

      <div className="space-y-6">
        <SettingsFormCard title="Page Header" description="Title, subtitle, and description.">
          <SettingsField label="Title">
            <SettingsInput value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })} />
          </SettingsField>
          <SettingsField label="Subtitle">
            <SettingsInput
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            />
          </SettingsField>
          <SettingsField label="Description">
            <SettingsTextarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              rows={3}
            />
          </SettingsField>
        </SettingsFormCard>

        <SettingsFormCard title="Statistics" description="Optional stats row below the header.">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <SettingsInput
              value={statForm.label}
              onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
              placeholder="Label"
            />
            <SettingsInput
              value={statForm.value}
              onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
              placeholder="Value"
            />
            <button onClick={saveStat} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm shrink-0">
              {statForm.id ? 'Update' : 'Add'} Stat
            </button>
          </div>
          <div className="space-y-2">
            {stats.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border text-sm">
                <span>
                  <strong>{s.value}</strong> — {s.label}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatForm({ id: s.id, label: s.label, value: s.value })}
                    className="text-xs px-2 py-1 rounded border"
                  >
                    Edit
                  </button>
                  <button onClick={() => removeStat(s.id)} className="text-xs text-destructive">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SettingsFormCard>

        <SettingsFormCard title="Navigation Links" description="Optional links below the header.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <SettingsInput
              value={navForm.label}
              onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
              placeholder="Label"
            />
            <SettingsInput
              value={navForm.href}
              onChange={(e) => setNavForm({ ...navForm, href: e.target.value })}
              placeholder="/path or URL"
            />
            <button onClick={saveNav} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm">
              {navForm.id ? 'Update' : 'Add'} Link
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm mb-4">
            <input
              type="checkbox"
              checked={navForm.external}
              onChange={(e) => setNavForm({ ...navForm, external: e.target.checked })}
            />
            External link
          </label>
          <div className="space-y-2">
            {navLinks.map((n) => (
              <div key={n.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border text-sm">
                <span>
                  {n.label} → {n.href}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setNavForm({ id: n.id, label: n.label, href: n.href, external: n.external })
                    }
                    className="text-xs px-2 py-1 rounded border"
                  >
                    Edit
                  </button>
                  <button onClick={() => removeNav(n.id)} className="text-xs text-destructive">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SettingsFormCard>

        <SettingsFormCard title="CTA Buttons" description="Optional call-to-action buttons.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <SettingsInput
              value={ctaForm.label}
              onChange={(e) => setCtaForm({ ...ctaForm, label: e.target.value })}
              placeholder="Label"
            />
            <SettingsInput
              value={ctaForm.href}
              onChange={(e) => setCtaForm({ ...ctaForm, href: e.target.value })}
              placeholder="/path or URL"
            />
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={ctaForm.style}
              onChange={(e) =>
                setCtaForm({ ...ctaForm, style: e.target.value as 'primary' | 'secondary' })
              }
              className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            >
              {ENGINE_ROOM_CTA_STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ctaForm.external}
                onChange={(e) => setCtaForm({ ...ctaForm, external: e.target.checked })}
              />
              External
            </label>
            <button onClick={saveCta} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm">
              {ctaForm.id ? 'Update' : 'Add'} CTA
            </button>
          </div>
          <div className="space-y-2">
            {ctaButtons.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border text-sm">
                <span>
                  {c.label} ({c.style}) → {c.href}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCtaForm({
                        id: c.id,
                        label: c.label,
                        href: c.href,
                        style: c.style,
                        external: c.external,
                      })
                    }
                    className="text-xs px-2 py-1 rounded border"
                  >
                    Edit
                  </button>
                  <button onClick={() => removeCta(c.id)} className="text-xs text-destructive">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SettingsFormCard>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Sections</h3>
              <p className="text-xs text-muted-foreground">Tool categories, listening block, coffee section, and more.</p>
            </div>
            <button
              onClick={() => {
                setSectionForm(emptySection(sections.length));
                setSectionOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm"
            >
              <Plus size={14} /> Add Section
            </button>
          </div>

          <div className="space-y-3">
            {sortedSections.map((section) => {
              const Icon = getEngineRoomIcon(section.icon);
              const sectionItems = (itemsBySection[section.id] || []).sort(
                (a, b) => a.sort_order - b.sort_order
              );
              return (
                <div key={section.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-primary">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{section.title}</span>
                        <span className="text-xs text-muted-foreground capitalize">{section.section_type}</span>
                        {section.featured && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            Featured
                          </span>
                        )}
                        {!section.visible && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => reorderSection(section.id, 'up')} className="p-1.5 rounded-lg border">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => reorderSection(section.id, 'down')} className="p-1.5 rounded-lg border">
                      <ChevronDown size={14} />
                    </button>
                    <button onClick={() => toggleSectionVisible(section)} className="text-xs px-2 py-1 rounded-full border">
                      {section.visible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => {
                        setSectionForm(section);
                        setSectionOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-muted"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => removeSection(section.id)}
                      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {section.section_type === 'tools' && (
                    <div className="mt-2 pl-12 space-y-2">
                      {sectionItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setItemForm(item);
                                setItemOpen(true);
                              }}
                              className="hover:text-foreground"
                            >
                              Edit
                            </button>
                            <button onClick={() => removeItem(item.id)} className="text-destructive">
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setItemForm(emptyItem(section.id, sectionItems.length));
                          setItemOpen(true);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        + Add item
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <SettingsFormCard title="Footer Message" description="Optional text at the bottom of the page.">
          <SettingsTextarea
            value={config.footer_message}
            onChange={(e) => setConfig({ ...config, footer_message: e.target.value })}
            rows={2}
          />
        </SettingsFormCard>

        <SettingsFormCard title="Empty & Error States" description="Shown when content is missing or fails to load.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Empty State Title">
              <SettingsInput
                value={config.empty_state_title}
                onChange={(e) => setConfig({ ...config, empty_state_title: e.target.value })}
              />
            </SettingsField>
            <SettingsField label="Error State Title">
              <SettingsInput
                value={config.error_state_title}
                onChange={(e) => setConfig({ ...config, error_state_title: e.target.value })}
              />
            </SettingsField>
            <SettingsField label="Empty State Message">
              <SettingsTextarea
                value={config.empty_state_message}
                onChange={(e) => setConfig({ ...config, empty_state_message: e.target.value })}
                rows={2}
              />
            </SettingsField>
            <SettingsField label="Error State Message">
              <SettingsTextarea
                value={config.error_state_message}
                onChange={(e) => setConfig({ ...config, error_state_message: e.target.value })}
                rows={2}
              />
            </SettingsField>
          </div>
        </SettingsFormCard>

        <SaveButton onClick={saveConfig} loading={savingConfig} label="Save Page Settings" />
      </div>

      {sectionOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card border border-border">
            <div className="p-5 border-b flex justify-between">
              <h3 className="font-bold">{sectionForm.id ? 'Edit Section' : 'New Section'}</h3>
              <button onClick={() => setSectionOpen(false)}>Close</button>
            </div>
            <div className="p-5 space-y-4">
              <SettingsField label="Title *">
                <SettingsInput
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                />
              </SettingsField>
              <SettingsField label="Type">
                <select
                  value={sectionForm.section_type}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      section_type: e.target.value as SectionForm['section_type'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                >
                  {ENGINE_ROOM_SECTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </SettingsField>
              <SettingsField label="Icon">
                <select
                  value={sectionForm.icon}
                  onChange={(e) => setSectionForm({ ...sectionForm, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                >
                  {ENGINE_ROOM_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </SettingsField>
              <SettingsField label="Sort Order">
                <SettingsInput
                  type="number"
                  value={sectionForm.sort_order}
                  onChange={(e) => setSectionForm({ ...sectionForm, sort_order: Number(e.target.value) })}
                />
              </SettingsField>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sectionForm.visible}
                    onChange={(e) => setSectionForm({ ...sectionForm, visible: e.target.checked })}
                  />
                  Visible
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sectionForm.featured}
                    onChange={(e) => setSectionForm({ ...sectionForm, featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>

              {sectionForm.section_type === 'listening' && (
                <>
                  {metaField('track', 'Track')}
                  {metaField('artist', 'Artist')}
                  {metaField('album', 'Album')}
                  {metaField('url', 'Album URL', 'https://')}
                </>
              )}
              {sectionForm.section_type === 'coffee' && (
                <>
                  {metaField('line1', 'Line 1')}
                  {metaField('line2', 'Line 2')}
                </>
              )}
              {sectionForm.section_type === 'content' && (
                <>
                  <SettingsField label="Subtitle">
                    <SettingsInput
                      value={sectionForm.subtitle || ''}
                      onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                    />
                  </SettingsField>
                  <SettingsField label="Description">
                    <SettingsTextarea
                      value={sectionForm.description || ''}
                      onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                      rows={4}
                    />
                  </SettingsField>
                </>
              )}
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setSectionOpen(false)} className="px-4 py-2 rounded-xl border text-sm">
                Cancel
              </button>
              <button
                onClick={saveSection}
                disabled={savingSection}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                {savingSection ? 'Saving…' : 'Save Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      {itemOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card border border-border">
            <div className="p-5 border-b flex justify-between">
              <h3 className="font-bold">{itemForm.id ? 'Edit Item' : 'New Item'}</h3>
              <button onClick={() => setItemOpen(false)}>Close</button>
            </div>
            <div className="p-5 space-y-4">
              <SettingsField label="Name *">
                <SettingsInput
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                />
              </SettingsField>
              <SettingsField label="Description">
                <SettingsInput
                  value={itemForm.description || ''}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                />
              </SettingsField>
              <SettingsField label="URL (optional)">
                <SettingsInput
                  value={itemForm.url || ''}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  placeholder="https://"
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
                Visible
              </label>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
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
