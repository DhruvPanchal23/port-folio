'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ContactSubmission } from '@/lib/supabase';
import { SettingsInput } from '@/components/admin/settings/SettingsFormCard';

type StatusFilter = 'all' | 'unread' | 'read';

export default function ContactSubmissionsTab() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load messages', { description: error.message });
    setMessages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return messages.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (!term) return true;
      return (
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        (m.subject || '').toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
      );
    });
  }, [messages, search, statusFilter]);

  const toggleRead = async (id: string, current: string) => {
    const next = current === 'unread' ? 'read' : 'unread';
    const { error } = await supabase.from('contact_submissions').update({ status: next }).eq('id', id);
    if (error) {
      toast.error('Update failed', { description: error.message });
      return;
    }
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, status: next } : m)));
    toast.success(next === 'read' ? 'Marked as read' : 'Marked as unread');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) {
      toast.error('Delete failed', { description: error.message });
      return;
    }
    setMessages((ms) => ms.filter((m) => m.id !== id));
    toast.success('Submission deleted');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">
        Contact Submissions
        {unreadCount > 0 && (
          <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            {unreadCount} unread
          </span>
        )}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Messages from the connect form.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <SettingsInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject, message…"
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
          <option value="read">Read</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No submissions found.</div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl border transition-colors ${
                msg.status === 'unread' ? 'bg-primary/3 border-primary/20' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{msg.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      msg.status === 'unread'
                        ? 'border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{msg.email}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => toggleRead(msg.id, msg.status)}
                    className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Mark {msg.status === 'unread' ? 'read' : 'unread'}
                  </button>
                  <button
                    onClick={() => remove(msg.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {msg.subject && <div className="text-sm font-medium text-foreground mb-1">{msg.subject}</div>}
              <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
