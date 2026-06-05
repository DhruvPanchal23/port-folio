'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { FeedbackSubmission } from '@/lib/supabase';
import { SettingsInput } from '@/components/admin/settings/SettingsFormCard';

type StatusFilter = 'all' | 'unread' | 'reviewed';

export default function FeedbackSubmissionsTab() {
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load feedback', { description: error.message });
    setSubmissions(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return submissions.filter((f) => {
      const status = f.status === 'read' ? 'reviewed' : f.status;
      if (statusFilter === 'unread' && status !== 'unread') return false;
      if (statusFilter === 'reviewed' && status !== 'reviewed') return false;
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      if (!term) return true;
      return (
        (f.name || '').toLowerCase().includes(term) ||
        (f.email || '').toLowerCase().includes(term) ||
        f.message.toLowerCase().includes(term) ||
        f.category.toLowerCase().includes(term)
      );
    });
  }, [submissions, search, statusFilter, categoryFilter]);

  const markReviewed = async (id: string, current: string) => {
    const next = current === 'unread' ? 'read' : 'unread';
    const { error } = await supabase.from('feedback_submissions').update({ status: next }).eq('id', id);
    if (error) {
      toast.error('Update failed', { description: error.message });
      return;
    }
    setSubmissions((fs) => fs.map((f) => (f.id === id ? { ...f, status: next } : f)));
    toast.success(next === 'read' ? 'Marked as reviewed' : 'Marked as unread');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    const { error } = await supabase.from('feedback_submissions').delete().eq('id', id);
    if (error) {
      toast.error('Delete failed', { description: error.message });
      return;
    }
    setSubmissions((fs) => fs.filter((f) => f.id !== id));
    toast.success('Feedback deleted');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = submissions.filter((f) => f.status === 'unread').length;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">
        Feedback Submissions
        {unreadCount > 0 && (
          <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {unreadCount} unread
          </span>
        )}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Feedback from the public feedback form.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <SettingsInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback…"
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
        >
          <option value="all">All status</option>
          <option value="unread">Unread</option>
          <option value="reviewed">Reviewed</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
        >
          <option value="all">All categories</option>
          <option value="general">General</option>
          <option value="suggestion">Suggestion</option>
          <option value="bug">Bug</option>
          <option value="appreciation">Appreciation</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No feedback found.</div>
        ) : (
          filtered.map((feedback) => (
            <div
              key={feedback.id}
              className={`p-4 rounded-xl border transition-colors ${
                feedback.status === 'unread' ? 'bg-blue/3 border-blue/20' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {feedback.name && (
                      <span className="font-medium text-sm text-foreground">{feedback.name}</span>
                    )}
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {feedback.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      feedback.status === 'unread'
                        ? 'border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}>
                      {feedback.status === 'read' ? 'reviewed' : feedback.status}
                    </span>
                  </div>
                  {feedback.email && (
                    <div className="text-xs text-muted-foreground">{feedback.email}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(feedback.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => markReviewed(feedback.id, feedback.status)}
                    className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {feedback.status === 'unread' ? 'Mark reviewed' : 'Mark unread'}
                  </button>
                  <button
                    onClick={() => remove(feedback.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{feedback.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
