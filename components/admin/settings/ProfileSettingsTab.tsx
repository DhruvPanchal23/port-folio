'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, Trash2, User } from 'lucide-react';
import { fetchPortfolioSettings, upsertPortfolioSetting } from '@/lib/portfolio-settings';
import { removeProfileImage, uploadProfileImage } from '@/lib/storage/upload';
import type { ProfileSettings } from '@/lib/types/portfolio-settings';
import { profileSettingsSchema } from '@/lib/validators/portfolio-settings';
import { SaveButton, SettingsField, SettingsFormCard, SettingsInput } from './SettingsFormCard';

export default function ProfileSettingsTab({ uploadTrigger = 0 }: { uploadTrigger?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPortfolioSettings().then((s) => {
      setProfile(s.profile);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (uploadTrigger > 0) inputRef.current?.click();
  }, [uploadTrigger]);

  const handleUpload = async (file: File) => {
    if (!profile) return;
    setUploading(true);
    const { data, error } = await uploadProfileImage(file, profile);
    setUploading(false);

    if (error) {
      toast.error('Upload failed', { description: error });
      return;
    }

    setProfile(data);
    toast.success('Profile image updated', { description: 'The site will show your new photo.' });
  };

  const handleRemove = async () => {
    if (!profile?.image_url) return;
    if (!confirm('Remove profile image? The site will show the default placeholder.')) return;

    setUploading(true);
    const { data, error } = await removeProfileImage(profile);
    setUploading(false);

    if (error) {
      toast.error('Remove failed', { description: error });
      return;
    }

    setProfile(data);
    toast.success('Profile image removed');
  };

  const handleSaveName = async () => {
    if (!profile) return;
    const parsed = profileSettingsSchema.safeParse(profile);
    if (!parsed.success) {
      toast.error('Validation failed', { description: parsed.error.errors[0]?.message });
      return;
    }

    setSaving(true);
    const { data, error } = await upsertPortfolioSetting('profile', parsed.data);
    setSaving(false);

    if (error) {
      toast.error('Save failed', { description: error });
      return;
    }

    setProfile(data);
    toast.success('Profile saved');
  };

  if (loading || !profile) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">Profile Management</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Upload or change your profile image. It is stored in Supabase Storage and shown on the About
        page.
      </p>

      <div className="space-y-4">
        <SettingsFormCard title="Profile Image">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
              {profile.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.image_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <ImagePlus size={15} />
                {uploading ? 'Uploading…' : profile.image_url ? 'Change image' : 'Upload image'}
              </button>
              {profile.image_url && (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleRemove}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              )}
            </div>
          </div>
        </SettingsFormCard>

        <SettingsFormCard title="Display Name">
          <SettingsField label="Name" hint="Shown on the About page and resume header.">
            <SettingsInput
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
            />
          </SettingsField>
          <div className="pt-2">
            <SaveButton onClick={handleSaveName} loading={saving} />
          </div>
        </SettingsFormCard>
      </div>
    </div>
  );
}
