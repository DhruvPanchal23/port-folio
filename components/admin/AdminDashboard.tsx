'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  FileText,
  Mail,
  LogOut,
  Settings,
  Eye,
  Trash2,
  FileDown,
  User as UserIcon,
  Link2,
  Globe,
  Command,
  Radio,
  Wrench,
  Images,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import ResumeSettingsTab from '@/components/admin/settings/ResumeSettingsTab';
import ProfileSettingsTab from '@/components/admin/settings/ProfileSettingsTab';
import SocialLinksSettingsTab from '@/components/admin/settings/SocialLinksSettingsTab';
import PortfolioSiteSettingsTab from '@/components/admin/settings/PortfolioSiteSettingsTab';
import AccountSettingsTab from '@/components/admin/settings/AccountSettingsTab';
import ProjectsTab from '@/components/admin/cms/ProjectsTab';
import BlogTab from '@/components/admin/cms/BlogTab';
import TestimonialsTab from '@/components/admin/cms/TestimonialsTab';
import OverviewTab, { type AdminTab, type QuickAction } from '@/components/admin/OverviewTab';
import ContactSubmissionsTab from '@/components/admin/communications/ContactSubmissionsTab';
import FeedbackSubmissionsTab from '@/components/admin/communications/FeedbackSubmissionsTab';
import CommandItemsTab from '@/components/admin/CommandItemsTab';
import NowCardTab from '@/components/admin/now/NowCardTab';
import EngineRoomTab from '@/components/admin/engine-room/EngineRoomTab';
import AboutGalleryTab from '@/components/admin/about/AboutGalleryTab';

type Tab = AdminTab;

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'guestbook', label: 'Guestbook', icon: MessageSquare },
  { id: 'feedback', label: 'Feedback', icon: Mail },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'commands', label: 'Command Menu', icon: Command },
  { id: 'now', label: 'Now / Live Card', icon: Radio },
  { id: 'engine-room', label: 'Engine Room', icon: Wrench },
  { id: 'about-gallery', label: 'About Gallery', icon: Images },
  { id: 'resume', label: 'Resume', icon: FileDown },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'social', label: 'Social Links', icon: Link2 },
  { id: 'site', label: 'Site Settings', icon: Globe },
  { id: 'settings', label: 'Account', icon: Settings },
];

function GuestbookTab() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error('Failed to load guestbook', { description: error.message });
        setEntries(data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'approved' ? 'hidden' : 'approved';
    const { error } = await supabase.from('guestbook_entries').update({ status: next }).eq('id', id);
    if (error) {
      toast.error('Update failed', { description: error.message });
      return;
    }
    setEntries((es) => es.map((e) => (e.id === id ? { ...e, status: next } : e)));
    toast.success(next === 'approved' ? 'Entry approved' : 'Entry hidden');
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    const { error } = await supabase.from('guestbook_entries').delete().eq('id', id);
    if (error) {
      toast.error('Delete failed', { description: error.message });
      return;
    }
    setEntries((es) => es.filter((e) => e.id !== id));
    toast.success('Entry deleted');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">
        Guestbook Entries
        {entries.filter((e) => e.status === 'pending').length > 0 && (
          <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            {entries.filter((e) => e.status === 'pending').length} pending
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

export default function AdminDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [createProjectTrigger, setCreateProjectTrigger] = useState(0);
  const [createBlogTrigger, setCreateBlogTrigger] = useState(0);
  const [createTestimonialTrigger, setCreateTestimonialTrigger] = useState(0);
  const [uploadResumeTrigger, setUploadResumeTrigger] = useState(0);
  const [uploadProfileTrigger, setUploadProfileTrigger] = useState(0);

  const handleSignOut = () => supabase.auth.signOut();

  const handleQuickAction = (action: QuickAction) => {
    switch (action) {
      case 'create-project':
        setCreateProjectTrigger((n) => n + 1);
        break;
      case 'create-blog':
        setCreateBlogTrigger((n) => n + 1);
        break;
      case 'create-testimonial':
        setCreateTestimonialTrigger((n) => n + 1);
        break;
      case 'upload-resume':
        setUploadResumeTrigger((n) => n + 1);
        break;
      case 'upload-profile':
        setUploadProfileTrigger((n) => n + 1);
        break;
      case 'view-guestbook':
        break;
    }
  };

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return <OverviewTab onNavigate={setTab} onQuickAction={handleQuickAction} />;
      case 'projects':
        return <ProjectsTab createTrigger={createProjectTrigger} />;
      case 'testimonials':
        return <TestimonialsTab createTrigger={createTestimonialTrigger} />;
      case 'blog':
        return <BlogTab createTrigger={createBlogTrigger} />;
      case 'guestbook':
        return <GuestbookTab />;
      case 'feedback':
        return <FeedbackSubmissionsTab />;
      case 'contact':
        return <ContactSubmissionsTab />;
      case 'commands':
        return <CommandItemsTab />;
      case 'now':
        return <NowCardTab />;
      case 'engine-room':
        return <EngineRoomTab />;
      case 'about-gallery':
        return <AboutGalleryTab />;
      case 'resume':
        return <ResumeSettingsTab uploadTrigger={uploadResumeTrigger} />;
      case 'profile':
        return <ProfileSettingsTab uploadTrigger={uploadProfileTrigger} />;
      case 'social':
        return <SocialLinksSettingsTab />;
      case 'site':
        return <PortfolioSiteSettingsTab />;
      case 'settings':
        return <AccountSettingsTab user={user} />;
      default:
        return (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Section coming soon. Use Supabase dashboard for full control.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster position="top-right" richColors closeButton />
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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

      <main className="flex-1 overflow-auto">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
              DP
            </div>
            <span className="font-display font-bold text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as Tab)}
              className="text-sm bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
            >
              {NAV_ITEMS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSignOut}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-5xl">
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
