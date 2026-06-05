'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchPortfolioSettings, upsertPortfolioSetting } from '@/lib/portfolio-settings';
import type { SiteSettings } from '@/lib/types/portfolio-settings';
import { siteSettingsSchema } from '@/lib/validators/portfolio-settings';
import {
  SaveButton,
  SettingsField,
  SettingsFormCard,
  SettingsInput,
  SettingsTextarea,
} from './SettingsFormCard';

export default function PortfolioSiteSettingsTab() {
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPortfolioSettings().then((s) => {
      setSite(s.site);
      setLoading(false);
    });
  }, []);

  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSite((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!site) return;
    const parsed = siteSettingsSchema.safeParse(site);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }

    setSaving(true);
    const { data, error } = await upsertPortfolioSetting('site', parsed.data);
    setSaving(false);

    if (error) {
      toast.error('Save failed', { description: error });
      return;
    }

    setSite(data);
    toast.success('Portfolio settings saved', { description: 'Footer and availability updated.' });
  };

  if (loading || !site) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">Portfolio Settings</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Edit site metadata shown in the footer, hero status pill, and availability sections.
      </p>

      <div className="space-y-4">
        <SettingsFormCard title="Version & Copyright">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Current Version">
              <SettingsInput
                value={site.current_version}
                onChange={(e) => updateField('current_version', e.target.value)}
                placeholder="1.0"
              />
            </SettingsField>
            <SettingsField label="Last Updated">
              <SettingsInput
                value={site.last_updated}
                onChange={(e) => updateField('last_updated', e.target.value)}
                placeholder="July 2025"
              />
            </SettingsField>
          </div>
          <SettingsField label="Copyright Text" hint="Shown after your name in the footer.">
            <SettingsInput
              value={site.copyright_text}
              onChange={(e) => updateField('copyright_text', e.target.value)}
              placeholder="Crafted with Coffee, Playlists & Curiosity."
            />
          </SettingsField>
        </SettingsFormCard>

        <SettingsFormCard title="Footer Content">
          <SettingsField label="Footer tagline" hint="Subtitle under the main footer CTA.">
            <SettingsInput
              value={site.footer_content}
              onChange={(e) => updateField('footer_content', e.target.value)}
            />
          </SettingsField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Footer CTA title">
              <SettingsInput
                value={site.footer_cta_title || ''}
                onChange={(e) => updateField('footer_cta_title', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Footer CTA subtitle">
              <SettingsInput
                value={site.footer_cta_subtitle || ''}
                onChange={(e) => updateField('footer_cta_subtitle', e.target.value)}
              />
            </SettingsField>
          </div>
        </SettingsFormCard>

        <SettingsFormCard title="Availability & Location">
          <SettingsField label="Availability Status" hint="Shown in the hero status pill.">
            <SettingsInput
              value={site.availability_status}
              onChange={(e) => updateField('availability_status', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Current Location" hint="Shown in hero meta and quick facts.">
            <SettingsInput
              value={site.current_location}
              onChange={(e) => updateField('current_location', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Open to Work">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={site.open_to_work}
                onChange={(e) => updateField('open_to_work', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">Show as open to work</span>
            </label>
          </SettingsField>
          <SettingsField label="Open to Work Headline">
            <SettingsInput
              value={site.open_to_work_headline || ''}
              onChange={(e) => updateField('open_to_work_headline', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Open to Work Description">
            <SettingsTextarea
              value={site.open_to_work_description || ''}
              onChange={(e) => updateField('open_to_work_description', e.target.value)}
            />
          </SettingsField>
        </SettingsFormCard>

        <SaveButton onClick={handleSave} loading={saving} />
      </div>
    </div>
  );
}
