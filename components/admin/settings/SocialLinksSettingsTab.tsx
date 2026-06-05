'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { fetchPortfolioSettings, upsertPortfolioSetting } from '@/lib/portfolio-settings';
import type { CustomLink, SocialSettings } from '@/lib/types/portfolio-settings';
import { socialSettingsSchema } from '@/lib/validators/portfolio-settings';
import { SaveButton, SettingsField, SettingsFormCard, SettingsInput } from './SettingsFormCard';

function newCustomLink(): CustomLink {
  return {
    id: crypto.randomUUID(),
    label: '',
    url: '',
    description: '',
  };
}

export default function SocialLinksSettingsTab() {
  const [social, setSocial] = useState<SocialSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPortfolioSettings().then((s) => {
      setSocial(s.social);
      setLoading(false);
    });
  }, []);

  const updateField = <K extends keyof SocialSettings>(key: K, value: SocialSettings[K]) => {
    setSocial((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateCustomLink = (id: string, patch: Partial<CustomLink>) => {
    setSocial((prev) =>
      prev
        ? {
            ...prev,
            custom_links: prev.custom_links.map((link) =>
              link.id === id ? { ...link, ...patch } : link
            ),
          }
        : prev
    );
  };

  const addCustomLink = () => {
    setSocial((prev) =>
      prev ? { ...prev, custom_links: [...prev.custom_links, newCustomLink()] } : prev
    );
  };

  const removeCustomLink = (id: string) => {
    setSocial((prev) =>
      prev ? { ...prev, custom_links: prev.custom_links.filter((l) => l.id !== id) } : prev
    );
  };

  const handleSave = async () => {
    if (!social) return;
    const parsed = socialSettingsSchema.safeParse(social);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }

    setSaving(true);
    const { data, error } = await upsertPortfolioSetting('social', parsed.data);
    setSaving(false);

    if (error) {
      toast.error('Save failed', { description: error });
      return;
    }

    setSocial(data);
    toast.success('Social links saved', { description: 'Links are live across the site.' });
  };

  if (loading || !social) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const standardFields: { key: keyof Omit<SocialSettings, 'custom_links'>; label: string; placeholder: string }[] = [
    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { key: 'twitter', label: 'X / Twitter', placeholder: 'https://twitter.com/username' },
    { key: 'email', label: 'Email', placeholder: 'you@example.com' },
    { key: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/...' },
    { key: 'portfolio_url', label: 'Portfolio URL', placeholder: 'https://yoursite.dev' },
  ];

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">Social Links</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Centralized social and contact links used across the homepage, footer, links page, and
        resume.
      </p>

      <div className="space-y-4">
        <SettingsFormCard title="Standard Links">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standardFields.map(({ key, label, placeholder }) => (
              <SettingsField key={key} label={label}>
                <SettingsInput
                  value={social[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder={placeholder}
                />
              </SettingsField>
            ))}
          </div>
        </SettingsFormCard>

        <SettingsFormCard
          title="Custom Links"
          description="Add any additional links (e.g. Dev.to, Medium, personal blog)."
          actions={
            <button
              type="button"
              onClick={addCustomLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Plus size={13} />
              Add link
            </button>
          }
        >
          {social.custom_links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom links yet.</p>
          ) : (
            <div className="space-y-3">
              {social.custom_links.map((link) => (
                <div
                  key={link.id}
                  className="p-4 rounded-lg border border-border bg-muted/30 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Custom link</span>
                    <button
                      type="button"
                      onClick={() => removeCustomLink(link.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove custom link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <SettingsField label="Label">
                      <SettingsInput
                        value={link.label}
                        onChange={(e) => updateCustomLink(link.id, { label: e.target.value })}
                        placeholder="My Blog"
                      />
                    </SettingsField>
                    <SettingsField label="URL">
                      <SettingsInput
                        value={link.url}
                        onChange={(e) => updateCustomLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                      />
                    </SettingsField>
                  </div>
                  <SettingsField label="Description (optional)">
                    <SettingsInput
                      value={link.description || ''}
                      onChange={(e) => updateCustomLink(link.id, { description: e.target.value })}
                      placeholder="Short description for links page"
                    />
                  </SettingsField>
                </div>
              ))}
            </div>
          )}
        </SettingsFormCard>

        <SaveButton onClick={handleSave} loading={saving} />
      </div>
    </div>
  );
}
