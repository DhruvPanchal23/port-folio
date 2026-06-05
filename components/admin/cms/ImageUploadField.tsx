'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadCmsImage } from '@/lib/storage/cms-upload';
import { toast } from 'sonner';

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  multiple,
  onMultiple,
  onUploaded,
}: {
  label: string;
  value?: string;
  onChange?: (url: string) => void;
  folder: 'projects' | 'blog' | 'testimonials' | 'about';
  multiple?: boolean;
  onMultiple?: (urls: string[]) => void;
  onUploaded?: (url: string, path: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    let lastPath: string | null = null;
    for (const file of Array.from(files)) {
      const { url, path, error } = await uploadCmsImage(file, folder);
      if (error) {
        toast.error('Upload failed', { description: error });
        continue;
      }
      if (url) {
        urls.push(url);
        if (path) lastPath = path;
      }
    }
    setUploading(false);
    if (multiple && onMultiple && urls.length) onMultiple(urls);
    else if (!multiple && urls[0]) {
      onChange?.(urls[0]);
      if (lastPath) onUploaded?.(urls[0], lastPath);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {value && !multiple && (
        <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      <button type="button" disabled={uploading} onClick={() => ref.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-50">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
        {uploading ? 'Uploading…' : multiple ? 'Add images' : value ? 'Replace image' : 'Upload image'}
      </button>
    </div>
  );
}
