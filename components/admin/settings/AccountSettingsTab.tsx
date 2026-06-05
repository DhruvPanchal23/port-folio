'use client';

import type { User } from '@supabase/supabase-js';
import { ExternalLink } from 'lucide-react';
import { SettingsFormCard } from './SettingsFormCard';

export default function AccountSettingsTab({ user }: { user: User }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Account</h2>
      <div className="space-y-4">
        <SettingsFormCard title="Signed in as">
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
        </SettingsFormCard>
        <SettingsFormCard
          title="Supabase Dashboard"
          description="Manage database tables, auth users, and storage buckets directly."
        >
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Open Supabase Dashboard
            <ExternalLink size={13} />
          </a>
        </SettingsFormCard>
      </div>
    </div>
  );
}
