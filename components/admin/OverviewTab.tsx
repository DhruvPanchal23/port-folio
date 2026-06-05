'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  FileText,
  MessageSquare,
  Mail,
  ExternalLink,
  FileDown,
  User as UserIcon,
  BookOpen,
  FolderOpen,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export type AdminTab =
  | 'overview'
  | 'projects'
  | 'testimonials'
  | 'blog'
  | 'guestbook'
  | 'feedback'
  | 'contact'
  | 'resume'
  | 'profile'
  | 'social'
  | 'site'
  | 'settings'
  | 'commands'
  | 'now'
  | 'engine-room'
  | 'about-gallery';

export type QuickAction =
  | 'create-project'
  | 'create-blog'
  | 'create-testimonial'
  | 'upload-resume'
  | 'upload-profile'
  | 'view-guestbook';

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  created_at: string;
  tab: AdminTab;
};

function StatsCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className={`text-2xl font-display font-bold mb-1 ${color || 'text-foreground'}`}>{value}</div>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

export default function OverviewTab({
  onNavigate,
  onQuickAction,
}: {
  onNavigate: (tab: AdminTab) => void;
  onQuickAction: (action: QuickAction) => void;
}) {
  const [stats, setStats] = useState({
    projects: 0,
    testimonials: 0,
    blog: 0,
    contact: 0,
    feedback: 0,
    guestbook: 0,
    unreadContact: 0,
    unreadFeedback: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
      supabase.from('feedback_submissions').select('id', { count: 'exact', head: true }),
      supabase.from('guestbook_entries').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
      supabase.from('feedback_submissions').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
      supabase.from('contact_submissions').select('id, name, email, subject, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('feedback_submissions').select('id, name, category, message, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('guestbook_entries').select('id, name, message, created_at').order('created_at', { ascending: false }).limit(3),
    ]).then(([p, t, b, c, f, g, uc, uf, contacts, feedbacks, guestbook]) => {
      setStats({
        projects: p.count || 0,
        testimonials: t.count || 0,
        blog: b.count || 0,
        contact: c.count || 0,
        feedback: f.count || 0,
        guestbook: g.count || 0,
        unreadContact: uc.count || 0,
        unreadFeedback: uf.count || 0,
      });

      const items: ActivityItem[] = [
        ...(contacts.data || []).map((row) => ({
          id: `contact-${row.id}`,
          type: 'Contact',
          title: row.name,
          subtitle: row.subject || row.email,
          created_at: row.created_at,
          tab: 'contact' as AdminTab,
        })),
        ...(feedbacks.data || []).map((row) => ({
          id: `feedback-${row.id}`,
          type: 'Feedback',
          title: row.name || 'Anonymous',
          subtitle: `${row.category}: ${(row.message || '').slice(0, 60)}`,
          created_at: row.created_at,
          tab: 'feedback' as AdminTab,
        })),
        ...(guestbook.data || []).map((row) => ({
          id: `guestbook-${row.id}`,
          type: 'Guestbook',
          title: row.name,
          subtitle: (row.message || '').slice(0, 60),
          created_at: row.created_at,
          tab: 'guestbook' as AdminTab,
        })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setActivity(items);
    });
  }, []);

  const quickActions: {
    label: string;
    icon: typeof Plus;
    action?: QuickAction;
    tab?: AdminTab;
    href?: string;
  }[] = [
    { label: 'Create Project', icon: FolderOpen, action: 'create-project', tab: 'projects' },
    { label: 'Create Blog', icon: BookOpen, action: 'create-blog', tab: 'blog' },
    { label: 'Create Testimonial', icon: Star, action: 'create-testimonial', tab: 'testimonials' },
    { label: 'Upload Resume', icon: FileDown, action: 'upload-resume', tab: 'resume' },
    { label: 'Upload Profile', icon: UserIcon, action: 'upload-profile', tab: 'profile' },
    { label: 'View Website', icon: ExternalLink, href: '/' },
    { label: 'Open Guestbook', icon: MessageSquare, action: 'view-guestbook', tab: 'guestbook' },
  ];

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard label="Total Projects" value={stats.projects} color="text-blue-600 dark:text-blue-400" />
        <StatsCard label="Total Testimonials" value={stats.testimonials} color="text-emerald-600 dark:text-emerald-400" />
        <StatsCard label="Total Blog Posts" value={stats.blog} color="text-violet-600 dark:text-violet-400" />
        <StatsCard label="Contact Requests" value={stats.contact} sub={`${stats.unreadContact} unread`} color="text-amber-600 dark:text-amber-400" />
        <StatsCard label="Feedback Entries" value={stats.feedback} sub={`${stats.unreadFeedback} unread`} color="text-cyan-600 dark:text-cyan-400" />
        <StatsCard label="Guestbook Entries" value={stats.guestbook} color="text-rose-600 dark:text-rose-400" />
      </div>

      <div className="p-5 rounded-xl bg-card border border-border mb-8">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, action, tab, href }) =>
            href ? (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
              >
                <Icon size={14} />
                {label}
              </Link>
            ) : (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (tab) onNavigate(tab);
                  if (action) onQuickAction(action);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all text-left"
              >
                <Icon size={14} />
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Recent Activity</h3>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
        ) : (
          <div className="space-y-2">
            {activity.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.tab)}
                className="w-full flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-custom uppercase tracking-wider text-primary">{item.type}</span>
                    <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
