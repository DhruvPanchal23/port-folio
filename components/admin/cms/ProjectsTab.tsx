'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CreditCard as Edit2, Plus, Trash2, CircleCheck as CheckCircle, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DisplayStatus, PerformanceMetrics, ProjectRecord } from '@/lib/types/cms';
import { emptyProject, getDefaultCaseStudySections, parseTechInput, slugify, sortSections } from '@/lib/cms-utils';
import { SettingsField, SettingsInput, SettingsTextarea } from '@/components/admin/settings/SettingsFormCard';
import ImageUploadField from './ImageUploadField';
import CaseStudyBuilder from './CaseStudyBuilder';

type FormState = Omit<ProjectRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string };

const DISPLAY_STATUSES: DisplayStatus[] = ['Live', 'Shipped', 'Building', 'Archived'];
const CATEGORIES = ['Web App', 'Security Tool', 'UI/UX', 'SaaS', 'Design System', 'Mobile'];

function mapRow(row: Record<string, unknown>): ProjectRecord {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    description: String(row.description || ''),
    long_description: String(row.long_description || ''),
    tagline: String(row.tagline || ''),
    cover_image: String(row.cover_image || ''),
    images: (row.images as string[]) || [],
    tech_stack: (row.tech_stack as string[]) || [],
    category: String(row.category || 'Web App'),
    status: (row.status as 'published' | 'draft') || 'draft',
    display_status: (row.display_status as DisplayStatus) || 'Shipped',
    featured: Boolean(row.featured),
    is_private: Boolean(row.is_private),
    year: String(row.year || ''),
    github_url: String(row.github_url || ''),
    live_url: String(row.live_url || ''),
    metrics: (row.metrics as Record<string, string>) || {},
    performance_metrics: (row.performance_metrics as PerformanceMetrics) || {},
    case_study_sections: (row.case_study_sections as ProjectRecord['case_study_sections']) || [],
    sort_order: Number(row.sort_order) || 0,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export default function ProjectsTab({ createTrigger = 0 }: { createTrigger?: number }) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyProject());
  const [tab, setTab] = useState<'details' | 'case-study' | 'metrics'>('details');
  const [metricsRows, setMetricsRows] = useState<{ label: string; value: string }[]>([]);
  const [techInput, setTechInput] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').order('sort_order');
    if (error) toast.error('Failed to load projects', { description: error.message });
    setProjects((data || []).map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = useCallback(() => {
    const base = emptyProject();
    setForm(base);
    setTechInput('');
    setMetricsRows([]);
    setTab('details');
    setOpen(true);
  }, []);

  useEffect(() => {
    if (createTrigger > 0) openCreate();
  }, [createTrigger, openCreate]);

  const openEdit = (p: ProjectRecord) => {
    setForm({ ...p });
    setTechInput(p.tech_stack.join(', '));
    setMetricsRows(Object.entries(p.metrics || {}).map(([label, value]) => ({ label, value })));
    setTab('details');
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.slug.trim()) return toast.error('Slug is required');
    if (!form.description.trim()) return toast.error('Short description is required');

    setSaving(true);
    const metrics: Record<string, string> = {};
    metricsRows.forEach(({ label, value }) => { if (label && value) metrics[label] = value; });

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      long_description: form.long_description.trim(),
      tagline: form.tagline.trim(),
      cover_image: form.cover_image,
      images: form.images,
      tech_stack: parseTechInput(techInput),
      category: form.category,
      status: form.status,
      display_status: form.display_status,
      featured: form.featured,
      is_private: form.is_private,
      year: form.year,
      github_url: form.github_url.trim(),
      live_url: form.live_url.trim(),
      metrics,
      performance_metrics: form.performance_metrics,
      case_study_sections: sortSections(form.case_study_sections?.length ? form.case_study_sections : getDefaultCaseStudySections(form)),
      sort_order: form.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { error } = form.id
      ? await supabase.from('projects').update(payload).eq('id', form.id)
      : await supabase.from('projects').insert(payload);

    setSaving(false);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(form.id ? 'Project updated' : 'Project created');
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) toast.error('Delete failed', { description: error.message });
    else { toast.success('Project deleted'); load(); }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published';
    await supabase.from('projects').update({ status: next }).eq('id', id);
    load();
  };

  const setPerf = (key: keyof PerformanceMetrics, value: string) => {
    const numKeys: (keyof PerformanceMetrics)[] = ['lighthouse_performance', 'accessibility', 'seo', 'best_practices'];
    setForm((f) => ({
      ...f,
      performance_metrics: {
        ...f.performance_metrics,
        [key]: numKeys.includes(key) ? (value === '' ? null : Number(value)) : value || null,
      },
    }));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Projects</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
          <Plus size={14} /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{project.title}</span>
                {project.featured && <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>}
              </div>
              <div className="text-xs text-muted-foreground">{project.category} · /work/{project.slug}</div>
            </div>
            <button onClick={() => toggleStatus(project.id, project.status)} className="text-xs px-2.5 py-1 rounded-full border">{project.status}</button>
            <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-muted"><Edit2 size={14} /></button>
            <button onClick={() => remove(project.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-2xl bg-card border border-border shadow-xl">
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10 rounded-t-2xl">
              <h3 className="font-display font-bold">{form.id ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
            </div>
            <div className="flex gap-1 p-3 border-b border-border">
              {(['details', 'case-study', 'metrics'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm capitalize ${tab === t ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>{t.replace('-', ' ')}</button>
              ))}
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {tab === 'details' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsField label="Title *"><SettingsInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} /></SettingsField>
                    <SettingsField label="Slug *"><SettingsInput value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} /></SettingsField>
                    <SettingsField label="Category"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></SettingsField>
                    <SettingsField label="Display Status"><select value={form.display_status} onChange={(e) => setForm({ ...form, display_status: e.target.value as DisplayStatus })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm">{DISPLAY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></SettingsField>
                    <SettingsField label="Publish Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"><option value="draft">Draft</option><option value="published">Published</option></select></SettingsField>
                    <SettingsField label="Year"><SettingsInput value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></SettingsField>
                    <SettingsField label="Sort Order"><SettingsInput type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></SettingsField>
                  </div>
                  <SettingsField label="Tagline"><SettingsInput value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></SettingsField>
                  <SettingsField label="Short Description *"><SettingsTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></SettingsField>
                  <SettingsField label="Full Description"><SettingsTextarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} className="min-h-[120px]" /></SettingsField>
                  <SettingsField label="Technologies (comma-separated)"><SettingsInput value={techInput} onChange={(e) => setTechInput(e.target.value)} /></SettingsField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsField label="GitHub URL"><SettingsInput value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} /></SettingsField>
                    <SettingsField label="Live URL"><SettingsInput value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} /></SettingsField>
                  </div>
                  <ImageUploadField label="Cover Image" folder="projects" value={form.cover_image} onChange={(url) => setForm({ ...form, cover_image: url })} />
                  <ImageUploadField label="Gallery Images" folder="projects" multiple onMultiple={(urls) => setForm({ ...form, images: [...form.images, ...urls] })} />
                  {form.images.length > 0 && <div className="flex flex-wrap gap-2">{form.images.map((src, i) => (<div key={i} className="w-16 h-16 rounded border overflow-hidden"><img src={src} alt="" className="w-full h-full object-cover" /></div>))}</div>}
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_private} onChange={(e) => setForm({ ...form, is_private: e.target.checked })} /> Private repo</label>
                  </div>
                </>
              )}
              {tab === 'case-study' && (
                <CaseStudyBuilder sections={form.case_study_sections || []} onChange={(case_study_sections) => setForm({ ...form, case_study_sections })} />
              )}
              {tab === 'metrics' && (
                <>
                  <p className="text-xs text-muted-foreground">Lighthouse & web vitals (0–100 for scores)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['lighthouse_performance', 'accessibility', 'seo', 'best_practices'] as const).map((k) => (
                      <SettingsField key={k} label={k.replace(/_/g, ' ')}>
                        <SettingsInput type="number" min={0} max={100} value={form.performance_metrics[k] ?? ''} onChange={(e) => setPerf(k, e.target.value)} />
                      </SettingsField>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(['fcp', 'lcp', 'load_time', 'bundle_size'] as const).map((k) => (
                      <SettingsField key={k} label={k.toUpperCase()}>
                        <SettingsInput value={form.performance_metrics[k] ?? ''} onChange={(e) => setPerf(k, e.target.value)} />
                      </SettingsField>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Card metrics (label / value)</span>
                      <button type="button" onClick={() => setMetricsRows([...metricsRows, { label: '', value: '' }])} className="text-xs text-primary">+ Add</button>
                    </div>
                    {metricsRows.map((row, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <SettingsInput placeholder="Label" value={row.label} onChange={(e) => { const n = [...metricsRows]; n[i].label = e.target.value; setMetricsRows(n); }} />
                        <SettingsInput placeholder="Value" value={row.value} onChange={(e) => { const n = [...metricsRows]; n[i].value = e.target.value; setMetricsRows(n); }} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm disabled:opacity-50">{saving ? 'Saving…' : 'Save Project'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
