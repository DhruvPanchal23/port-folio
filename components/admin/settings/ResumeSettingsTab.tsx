'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Download, FileText, Upload } from 'lucide-react';
import { fetchPortfolioSettings } from '@/lib/portfolio-settings';
import { uploadResumePdf } from '@/lib/storage/upload';
import type { ResumeSettings } from '@/lib/types/portfolio-settings';
import { SettingsFormCard, SettingsField } from './SettingsFormCard';

export default function ResumeSettingsTab({ uploadTrigger = 0 }: { uploadTrigger?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<ResumeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPortfolioSettings().then((s) => {
      setResume(s.resume);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (uploadTrigger > 0) inputRef.current?.click();
  }, [uploadTrigger]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const { data, error } = await uploadResumePdf(file);
    setUploading(false);

    if (error) {
      toast.error('Upload failed', { description: error });
      return;
    }

    setResume(data);
    toast.success('Resume uploaded', {
      description: 'Download links across the site now point to the latest PDF.',
    });
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
      <h2 className="font-display text-xl font-bold text-foreground mb-2">Resume Management</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Upload a PDF resume. It is stored at a fixed path so future uploads automatically replace
        the previous file — no code changes needed.
      </p>

      <SettingsFormCard
        title="Current Resume"
        description="The latest uploaded PDF is used by all download buttons on the site."
      >
        {resume?.url ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{resume.file_name || 'resume.pdf'}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {resume.uploaded_at
                    ? `Uploaded ${new Date(resume.uploaded_at).toLocaleString()}`
                    : 'Uploaded'}
                  {resume.file_size ? ` · ${(resume.file_size / 1024).toFixed(0)} KB` : ''}
                </div>
              </div>
            </div>
            <a
              href={resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Download size={14} />
              Preview PDF
            </a>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-4 rounded-lg bg-muted/50 border border-dashed border-border">
            No resume uploaded yet. Upload a PDF to enable download buttons site-wide.
          </div>
        )}

        <SettingsField label="Upload new resume" hint="PDF only, max 10 MB. Replaces the existing file.">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <Upload size={15} />
            {uploading ? 'Uploading…' : resume?.url ? 'Replace PDF' : 'Upload PDF'}
          </button>
        </SettingsField>
      </SettingsFormCard>
    </div>
  );
}
