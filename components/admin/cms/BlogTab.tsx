'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CreditCard as Edit2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BlogPostRecord } from '@/lib/types/cms';
import { emptyBlogPost, estimateReadTime, parseTagsInput, slugify } from '@/lib/cms-utils';
import { SettingsField, SettingsInput, SettingsTextarea } from '@/components/admin/settings/SettingsFormCard';
import ImageUploadField from './ImageUploadField';

type BlogFormState = Omit<BlogPostRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string };

function mapRow(row: Record<string, unknown>): BlogPostRecord {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    excerpt: String(row.excerpt || ''),
    content: String(row.content || ''),
    cover_image: String(row.cover_image || ''),
    category: String(row.category || 'general'),
    tags: (row.tags as string[]) || [],
    status: (row.status as 'published' | 'draft') || 'draft',
    featured: Boolean(row.featured),
    read_time: Number(row.read_time) || 5,
    seo_title: String(row.seo_title || ''),
    seo_description: String(row.seo_description || ''),
    og_image: String(row.og_image || ''),
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export default function BlogTab({ createTrigger = 0 }: { createTrigger?: number }) {
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BlogFormState>(emptyBlogPost());
  const [tagsInput, setTagsInput] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data || []).map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = useCallback(() => {
    setForm(emptyBlogPost());
    setTagsInput('');
    setOpen(true);
  }, []);

  useEffect(() => {
    if (createTrigger > 0) openCreate();
  }, [createTrigger, openCreate]);

  const openEdit = (p: BlogPostRecord) => {
    setForm(p);
    setTagsInput(p.tags.join(', '));
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim()) return toast.error('Title and slug are required');
    setSaving(true);
    const read_time = estimateReadTime(form.content);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      cover_image: form.cover_image,
      category: form.category,
      tags: parseTagsInput(tagsInput),
      status: form.status,
      featured: form.featured,
      read_time,
      seo_title: form.seo_title.trim() || form.title.trim(),
      seo_description: form.seo_description.trim() || form.excerpt.trim(),
      og_image: form.og_image || form.cover_image,
      published_at: form.status === 'published' ? (form.published_at || new Date().toISOString()) : form.published_at,
      updated_at: new Date().toISOString(),
    };
    const { error } = form.id
      ? await supabase.from('blog_posts').update(payload).eq('id', form.id)
      : await supabase.from('blog_posts').insert(payload);
    setSaving(false);
    if (error) return toast.error('Save failed', { description: error.message });
    toast.success(form.id ? 'Post updated' : 'Post created');
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    toast.success('Post deleted');
    load();
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published';
    await supabase.from('blog_posts').update({ status: next, published_at: next === 'published' ? new Date().toISOString() : null }).eq('id', id);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Blog Posts</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm"><Plus size={14} /> New Post</button>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="p-4 rounded-xl bg-card border border-border flex items-start justify-between gap-4">
            <div>
              <div className="font-medium text-sm">{post.title} {post.featured && <span className="text-xs text-primary ml-1">★</span>}</div>
              <div className="text-xs text-muted-foreground">/{post.slug} · {post.status}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(post.id, post.status)} className="text-xs px-2 py-1 rounded-full border">{post.status}</button>
              <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg hover:bg-muted"><Edit2 size={14} /></button>
              <button onClick={() => remove(post.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card border border-border">
            <div className="p-5 border-b flex justify-between"><h3 className="font-bold">{form.id ? 'Edit Post' : 'New Post'}</h3><button onClick={() => setOpen(false)}>Close</button></div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <SettingsField label="Title *"><SettingsInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} /></SettingsField>
              <SettingsField label="Slug *"><SettingsInput value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} /></SettingsField>
              <SettingsField label="Excerpt"><SettingsTextarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></SettingsField>
              <SettingsField label="Content"><SettingsTextarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-[200px]" /></SettingsField>
              <ImageUploadField label="Cover Image" folder="blog" value={form.cover_image} onChange={(url) => setForm({ ...form, cover_image: url })} />
              <SettingsField label="Tags (comma-separated)"><SettingsInput value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} /></SettingsField>
              <SettingsField label="SEO Title"><SettingsInput value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></SettingsField>
              <SettingsField label="SEO Description"><SettingsTextarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} /></SettingsField>
              <div className="grid grid-cols-2 gap-4">
                <SettingsField label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })} className="w-full px-3 py-2 rounded-lg bg-muted border text-sm"><option value="draft">Draft</option><option value="published">Published</option></select></SettingsField>
                <label className="flex items-center gap-2 text-sm pt-6"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured post</label>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm">{saving ? 'Saving…' : 'Save Post'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
