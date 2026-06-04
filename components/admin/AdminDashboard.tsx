'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { LayoutDashboard, FolderOpen, MessageSquare, Briefcase, FileText, Mail, LogOut, Settings, ChartBar as BarChart3, Eye, Plus, Trash2, CreditCard as Edit2, CircleCheck as CheckCircle, Circle, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Tab = 'overview' | 'projects' | 'testimonials' | 'blog' | 'guestbook' | 'feedback' | 'contact' | 'settings';

interface NavItem {
  id: Tab;
  label: string;
  icon: any;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'guestbook', label: 'Guestbook', icon: MessageSquare },
  { id: 'feedback', label: 'Feedback', icon: Mail },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function StatsCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className={`text-2xl font-display font-bold mb-1 ${color || 'text-foreground'}`}>{value}</div>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState({ projects: 0, testimonials: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
    ]).then(([p, t, c, u]) => {
      setStats({
        projects: p.count || 0,
        testimonials: t.count || 0,
        messages: c.count || 0,
        unread: u.count || 0,
      });
    });
  }, []);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Projects" value={stats.projects} sub="Published" color="text-blue-600 dark:text-blue-400" />
        <StatsCard label="Testimonials" value={stats.testimonials} sub="Active" color="text-emerald-600 dark:text-emerald-400" />
        <StatsCard label="Messages" value={stats.messages} sub="Total received" color="text-amber-600 dark:text-amber-400" />
        <StatsCard label="Unread" value={stats.unread} sub="Need reply" color="text-rose-600 dark:text-rose-400" />
      </div>

      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Project', icon: Plus, tab: 'projects' },
            { label: 'New Blog Post', icon: FileText, tab: 'blog' },
            { label: 'View Messages', icon: Mail, tab: 'contact' },
            { label: 'View Site', icon: ExternalLink, href: '/' },
          ].map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href || '#'}
              target={href ? '_blank' : undefined}
              rel={href ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, []);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published';
    await supabase.from('projects').update({ status: next }).eq('id', id);
    setProjects(ps => ps.map(p => p.id === id ? { ...p, status: next } : p));
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    setProjects(ps => ps.filter(p => p.id !== id));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Projects</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={14} />
          Add Project
        </button>
      </div>
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-sm text-foreground truncate">{project.title}</span>
                {project.featured && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{project.category}</span>
                <span>·</span>
                <span className="capitalize">{project.tech_stack?.slice(0, 3).join(', ')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleStatus(project.id, project.status)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  project.status === 'published'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                    : 'border-border bg-muted text-muted-foreground'
                }`}
              >
                {project.status === 'published' ? <CheckCircle size={10} /> : <Circle size={10} />}
                {project.status}
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setMessages(data || []);
      setLoading(false);
    });
  }, []);

  const markRead = async (id: string) => {
    await supabase.from('contact_submissions').update({ status: 'read' }).eq('id', id);
    setMessages(ms => ms.map(m => m.id === id ? { ...m, status: 'read' } : m));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">
        Messages
        {messages.filter(m => m.status === 'unread').length > 0 && (
          <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            {messages.filter(m => m.status === 'unread').length} unread
          </span>
        )}
      </h2>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No messages yet.</div>
        ) : (
          messages.map((msg) => (
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
                    {msg.status === 'unread' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{msg.email}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  {msg.status === 'unread' && (
                    <button
                      onClick={() => markRead(msg.id)}
                      className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
              {msg.subject && <div className="text-sm font-medium text-foreground mb-1">{msg.subject}</div>}
              <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
              {(msg.project_type || msg.budget) && (
                <div className="flex gap-3 mt-2">
                  {msg.project_type && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      {msg.project_type}
                    </span>
                  )}
                  {msg.budget && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      {msg.budget}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('testimonials').select('*').order('sort_order').then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published';
    await supabase.from('testimonials').update({ status: next }).eq('id', id);
    setItems(ts => ts.map(t => t.id === id ? { ...t, status: next } : t));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Testimonials</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{item.role}, {item.company}</div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
              </div>
              <button
                onClick={() => toggleStatus(item.id, item.status)}
                className={`shrink-0 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  item.status === 'published'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                    : 'border-border bg-muted text-muted-foreground'
                }`}
              >
                {item.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ user }: { user: User }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Settings</h2>
      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-sm text-foreground mb-4">Account</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Email</div>
              <div className="text-sm text-foreground font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">User ID</div>
              <div className="text-xs font-mono-custom text-muted-foreground">{user.id}</div>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-sm text-foreground mb-3">Portfolio Content</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage hero text, about section, and site settings directly in the Supabase dashboard under the <code className="text-xs bg-muted px-1 py-0.5 rounded">portfolio_settings</code> table.
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Open Supabase Dashboard
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

function BlogTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').order('published_at', { ascending: false }).then(({ data }) => {
      setPosts(data || []);
      setLoading(false);
    });
  }, []);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published';
    await supabase.from('blog_posts').update({ status: next }).eq('id', id);
    setPosts(ps => ps.map(p => p.id === id ? { ...p, status: next } : p));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Blog Posts</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={14} />
          New Post
        </button>
      </div>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No blog posts yet.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground mb-0.5">{post.title}</div>
                  <div className="text-xs text-muted-foreground mb-2">{post.excerpt}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.read_time} min read</span>
                    <span>·</span>
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(post.id, post.status)}
                  className={`shrink-0 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    post.status === 'published'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  {post.status}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GuestbookTab() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('guestbook_entries').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setEntries(data || []);
      setLoading(false);
    });
  }, []);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'approved' ? 'hidden' : 'approved';
    await supabase.from('guestbook_entries').update({ status: next }).eq('id', id);
    setEntries(es => es.map(e => e.id === id ? { ...e, status: next } : e));
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await supabase.from('guestbook_entries').delete().eq('id', id);
    setEntries(es => es.filter(e => e.id !== id));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">
        Guestbook Entries
        {entries.filter(e => e.status === 'pending').length > 0 && (
          <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            {entries.filter(e => e.status === 'pending').length} pending
          </span>
        )}
      </h2>
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No guestbook entries yet.</div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-xl border transition-colors ${
                entry.status === 'pending' ? 'bg-amber/3 border-amber/20' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{entry.name}</span>
                    {entry.status === 'pending' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{entry.email}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toggleStatus(entry.id, entry.status)}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      entry.status === 'approved'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {entry.status === 'approved' ? 'Approved' : 'Approve'}
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FeedbackTab() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('feedback_submissions').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setSubmissions(data || []);
      setLoading(false);
    });
  }, []);

  const markRead = async (id: string) => {
    await supabase.from('feedback_submissions').update({ status: 'read' }).eq('id', id);
    setSubmissions(fs => fs.map(f => f.id === id ? { ...f, status: 'read' } : f));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">
        Feedback Submissions
        {submissions.filter(f => f.status === 'unread').length > 0 && (
          <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {submissions.filter(f => f.status === 'unread').length} unread
          </span>
        )}
      </h2>
      <div className="space-y-3">
        {submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No feedback yet.</div>
        ) : (
          submissions.map((feedback) => (
            <div
              key={feedback.id}
              className={`p-4 rounded-xl border transition-colors ${
                feedback.status === 'unread' ? 'bg-blue/3 border-blue/20' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {feedback.name && (
                      <span className="font-medium text-sm text-foreground">{feedback.name}</span>
                    )}
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {feedback.category}
                    </span>
                    {feedback.status === 'unread' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  {feedback.email && (
                    <div className="text-xs text-muted-foreground">{feedback.email}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </span>
                  {feedback.status === 'unread' && (
                    <button
                      onClick={() => markRead(feedback.id)}
                      className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Mark read
                    </button>
                  )}
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

export default function AdminDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = () => supabase.auth.signOut();

  const renderTab = () => {
    switch (tab) {
      case 'overview': return <OverviewTab />;
      case 'projects': return <ProjectsTab />;
      case 'testimonials': return <TestimonialsTab />;
      case 'blog': return <BlogTab />;
      case 'guestbook': return <GuestbookTab />;
      case 'feedback': return <FeedbackTab />;
      case 'contact': return <ContactTab />;
      case 'settings': return <SettingsTab user={user} />;
      default: return (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Section coming soon. Use Supabase dashboard for full control.
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0 hidden md:flex">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
              DP
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground">Admin Panel</div>
              <div className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all mb-1"
          >
            <Eye size={15} />
            View Portfolio
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">DP</div>
            <span className="font-display font-bold text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as Tab)}
              className="text-sm bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
            >
              {NAV_ITEMS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
            </select>
            <button onClick={handleSignOut} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-4xl">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
