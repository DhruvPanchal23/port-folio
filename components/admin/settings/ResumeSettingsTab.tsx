'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Download, FileText, Upload, ChevronUp, ChevronDown, Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import { fetchPortfolioSettings } from '@/lib/portfolio-settings';
import { uploadResumePdf } from '@/lib/storage/upload';
import type { ResumeSettings } from '@/lib/types/portfolio-settings';
import { SettingsFormCard, SettingsField, SettingsInput, SettingsTextarea } from './SettingsFormCard';
import { fetchResumeData, saveResumeSection, deleteResumeSection, saveResumeEntry, deleteResumeEntry, reorderResumeSections, reorderResumeEntries } from '@/lib/resume';
import type { ResumeSection, ResumeEntry, ResumeData, ResumeSectionType } from '@/lib/types/resume';
import { RESUME_SECTION_TYPES } from '@/lib/types/resume';

type SectionFormState = Omit<ResumeSection, 'id' | 'created_at' | 'updated_at'> & { id?: string };
type EntryFormState = Omit<ResumeEntry, 'id' | 'created_at' | 'updated_at'> & { id?: string };

const emptySection = (sort: number): SectionFormState => ({
  title: '',
  type: 'experience',
  sort_order: sort,
  visible: true,
});

const emptyEntry = (sectionId: string, sort: number): EntryFormState => ({
  section_id: sectionId,
  title: '',
  subtitle: '',
  date_range: '',
  location: '',
  description: '',
  details: [],
  sort_order: sort,
  visible: true,
});

export default function ResumeSettingsTab({ uploadTrigger = 0 }: { uploadTrigger?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<ResumeSettings | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Resume CMS State
  const [cmsData, setCmsData] = useState<ResumeData | null>(null);
  const [loadingCms, setLoadingCms] = useState(true);

  // Section Modal/Form
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState<SectionFormState>(emptySection(0));
  const [savingSection, setSavingSection] = useState(false);

  // Entry Modal/Form
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entryForm, setEntryForm] = useState<EntryFormState>(emptyEntry('', 0));
  const [detailInput, setDetailInput] = useState('');
  const [savingEntry, setSavingEntry] = useState(false);

  const loadSettings = () => {
    fetchPortfolioSettings().then((s) => {
      setResume(s.resume);
      setLoadingPdf(false);
    });
  };

  const loadCmsData = () => {
    setLoadingCms(true);
    fetchResumeData(false).then((data) => {
      setCmsData(data);
      setLoadingCms(false);
    });
  };

  useEffect(() => {
    loadSettings();
    loadCmsData();
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

  // Section CRUD
  const handleOpenAddSection = () => {
    const nextSort = cmsData?.sections ? cmsData.sections.length + 1 : 1;
    setSectionForm(emptySection(nextSort));
    setSectionModalOpen(true);
  };

  const handleOpenEditSection = (section: ResumeSection) => {
    setSectionForm({
      id: section.id,
      title: section.title,
      type: section.type,
      sort_order: section.sort_order,
      visible: section.visible,
    });
    setSectionModalOpen(true);
  };

  const handleSaveSection = async () => {
    if (!sectionForm.title.trim()) {
      toast.error('Validation error', { description: 'Section title is required.' });
      return;
    }
    setSavingSection(true);
    const { data, error } = await saveResumeSection(sectionForm);
    setSavingSection(false);

    if (error) {
      toast.error('Failed to save section', { description: error });
      return;
    }

    toast.success(sectionForm.id ? 'Section updated' : 'Section created');
    setSectionModalOpen(false);
    loadCmsData();
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section and all its entries?')) return;
    const { error } = await deleteResumeSection(id);
    if (error) {
      toast.error('Failed to delete section', { description: error });
      return;
    }
    toast.success('Section deleted');
    loadCmsData();
  };

  const handleToggleSectionVisible = async (section: ResumeSection) => {
    const { error } = await saveResumeSection({
      ...section,
      visible: !section.visible,
    });
    if (error) {
      toast.error('Update failed', { description: error });
      return;
    }
    toast.success(section.visible ? 'Section hidden' : 'Section visible');
    loadCmsData();
  };

  const handleReorderSection = async (id: string, direction: 'up' | 'down') => {
    if (!cmsData?.sections) return;
    const sorted = [...cmsData.sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];

    const tempOrder = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = tempOrder;

    const { error } = await reorderResumeSections([
      { id: a.id, sort_order: a.sort_order },
      { id: b.id, sort_order: b.sort_order },
    ]);

    if (error) {
      toast.error('Reordering failed', { description: error });
      return;
    }
    loadCmsData();
  };

  // Entry CRUD
  const handleOpenAddEntry = (sectionId: string) => {
    const sectionEntries = cmsData?.entries ? cmsData.entries.filter((e) => e.section_id === sectionId) : [];
    const nextSort = sectionEntries.length + 1;
    setEntryForm(emptyEntry(sectionId, nextSort));
    setEntryModalOpen(true);
  };

  const handleOpenEditEntry = (entry: ResumeEntry) => {
    setEntryForm({
      id: entry.id,
      section_id: entry.section_id,
      title: entry.title || '',
      subtitle: entry.subtitle || '',
      date_range: entry.date_range || '',
      location: entry.location || '',
      description: entry.description || '',
      details: entry.details || [],
      sort_order: entry.sort_order,
      visible: entry.visible,
    });
    setEntryModalOpen(true);
  };

  const handleSaveEntry = async () => {
    setSavingEntry(true);
    const { data, error } = await saveResumeEntry(entryForm);
    setSavingEntry(false);

    if (error) {
      toast.error('Failed to save entry', { description: error });
      return;
    }

    toast.success(entryForm.id ? 'Entry updated' : 'Entry created');
    setEntryModalOpen(false);
    loadCmsData();
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    const { error } = await deleteResumeEntry(id);
    if (error) {
      toast.error('Failed to delete entry', { description: error });
      return;
    }
    toast.success('Entry deleted');
    loadCmsData();
  };

  const handleToggleEntryVisible = async (entry: ResumeEntry) => {
    const { error } = await saveResumeEntry({
      ...entry,
      visible: !entry.visible,
    });
    if (error) {
      toast.error('Update failed', { description: error });
      return;
    }
    toast.success(entry.visible ? 'Entry hidden' : 'Entry visible');
    loadCmsData();
  };

  const handleReorderEntry = async (id: string, direction: 'up' | 'down', sectionId: string) => {
    if (!cmsData?.entries) return;
    const sectionEntries = [...cmsData.entries]
      .filter((e) => e.section_id === sectionId)
      .sort((a, b) => a.sort_order - b.sort_order);
    const idx = sectionEntries.findIndex((e) => e.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sectionEntries.length) return;

    const a = sectionEntries[idx];
    const b = sectionEntries[swapIdx];

    const tempOrder = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = tempOrder;

    const { error } = await reorderResumeEntries([
      { id: a.id, sort_order: a.sort_order },
      { id: b.id, sort_order: b.sort_order },
    ]);

    if (error) {
      toast.error('Reordering failed', { description: error });
      return;
    }
    loadCmsData();
  };

  const addDetailBullet = () => {
    if (!detailInput.trim()) return;
    setEntryForm({
      ...entryForm,
      details: [...entryForm.details, detailInput.trim()],
    });
    setDetailInput('');
  };

  const removeDetailBullet = (idx: number) => {
    setEntryForm({
      ...entryForm,
      details: entryForm.details.filter((_, i) => i !== idx),
    });
  };

  if (loadingPdf || loadingCms) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const sortedSections = cmsData?.sections ? [...cmsData.sections].sort((a, b) => a.sort_order - b.sort_order) : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Resume Management</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upload a PDF resume and manage dynamic timeline details (Experience, Education, Skills, etc.) for the Resume page.
        </p>
      </div>

      {/* PDF Upload Card */}
      <SettingsFormCard
        title="PDF Resume File"
        description="The latest uploaded PDF is used by download buttons site-wide."
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

      {/* Sections Manager Card */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Resume Sections</h3>
            <p className="text-xs text-muted-foreground">Manage and order the visual segments shown on the resume page.</p>
          </div>
          <button
            onClick={handleOpenAddSection}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm"
          >
            <Plus size={14} /> Add Section
          </button>
        </div>

        <div className="space-y-4">
          {sortedSections.map((section) => {
            const sectionEntries = cmsData?.entries
              ? cmsData.entries.filter((e) => e.section_id === section.id).sort((a, b) => a.sort_order - b.sort_order)
              : [];

            return (
              <div key={section.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-sm text-foreground">{section.title}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {section.type}
                    </span>
                    {!section.visible && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorderSection(section.id, 'up')}
                      title="Move section up"
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleReorderSection(section.id, 'down')}
                      title="Move section down"
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={() => handleToggleSectionVisible(section)}
                      title={section.visible ? 'Hide section' : 'Show section'}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => handleOpenEditSection(section)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Section Entries List */}
                <div className="pl-0 sm:pl-4 space-y-3">
                  {sectionEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border text-xs transition-colors ${
                        entry.visible ? 'bg-muted/30 border-border' : 'bg-muted/10 border-border/50 opacity-60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{entry.title || 'Untitled Entry'}</span>
                          {entry.subtitle && <span className="text-muted-foreground font-normal">({entry.subtitle})</span>}
                          {!entry.visible && <span className="text-[9px] font-mono uppercase bg-muted px-1.5 py-0.2 rounded text-muted-foreground">Hidden</span>}
                        </div>
                        {entry.date_range && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {entry.date_range} {entry.location ? `· ${entry.location}` : ''}
                          </div>
                        )}
                        {entry.description && (
                          <div className="text-[11px] text-muted-foreground/80 mt-1 truncate max-w-xl">
                            {entry.description}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          onClick={() => handleReorderEntry(entry.id, 'up', section.id)}
                          className="p-1 rounded border border-border/80 hover:bg-muted text-muted-foreground transition-colors"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          onClick={() => handleReorderEntry(entry.id, 'down', section.id)}
                          className="p-1 rounded border border-border/80 hover:bg-muted text-muted-foreground transition-colors"
                        >
                          <ChevronDown size={12} />
                        </button>
                        <button
                          onClick={() => handleToggleEntryVisible(entry)}
                          className="p-1 rounded border border-border/80 hover:bg-muted text-muted-foreground transition-colors"
                        >
                          {entry.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>
                        <button
                          onClick={() => handleOpenEditEntry(entry)}
                          className="p-1 rounded border border-border/80 hover:bg-muted text-muted-foreground transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 rounded border border-border/80 text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleOpenAddEntry(section.id)}
                    className="w-full py-2 border border-dashed border-border hover:border-primary/40 rounded-lg text-xs text-primary font-medium hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} /> Add Entry to {section.title}
                  </button>
                </div>
              </div>
            );
          })}

          {sortedSections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
              No sections created yet. Click &quot;Add Section&quot; to begin.
            </div>
          )}
        </div>
      </div>

      {/* Section Edit/Add Modal */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/40 rounded-t-2xl">
              <h3 className="font-display font-bold text-foreground">{sectionForm.id ? 'Edit Section' : 'Add Section'}</h3>
              <button
                onClick={() => setSectionModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4">
              <SettingsField label="Section Title *">
                <SettingsInput
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                  placeholder="e.g. Experience, Achievements"
                />
              </SettingsField>

              <SettingsField label="Section Type">
                <select
                  value={sectionForm.type}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      type: e.target.value as ResumeSectionType,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {RESUME_SECTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.toUpperCase()}
                    </option>
                  ))}
                </select>
              </SettingsField>

              <SettingsField label="Sort Order">
                <SettingsInput
                  type="number"
                  value={sectionForm.sort_order}
                  onChange={(e) => setSectionForm({ ...sectionForm, sort_order: Number(e.target.value) })}
                />
              </SettingsField>

              <label className="flex items-center gap-2 text-sm text-foreground select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionForm.visible}
                  onChange={(e) => setSectionForm({ ...sectionForm, visible: e.target.checked })}
                  className="rounded border-border bg-muted text-primary focus:ring-primary/30"
                />
                Visible on resume page
              </label>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20 rounded-b-2xl">
              <button
                onClick={() => setSectionModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                disabled={savingSection}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {savingSection ? 'Saving…' : 'Save Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Edit/Add Modal */}
      {entryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/40 rounded-t-2xl">
              <h3 className="font-display font-bold text-foreground">{entryForm.id ? 'Edit Entry' : 'Add Entry'}</h3>
              <button
                onClick={() => setEntryModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <SettingsField label="Title / Header">
                <SettingsInput
                  value={entryForm.title || ''}
                  onChange={(e) => setEntryForm({ ...entryForm, title: e.target.value })}
                  placeholder="e.g. Freelance Developer, Bachelor of Tech, Frontend"
                />
              </SettingsField>

              <SettingsField label="Subtitle / Company / Technologies">
                <SettingsInput
                  value={entryForm.subtitle || ''}
                  onChange={(e) => setEntryForm({ ...entryForm, subtitle: e.target.value })}
                  placeholder="e.g. Self-Employed, SVNIT, React | Node.js"
                />
              </SettingsField>

              <div className="grid grid-cols-2 gap-4">
                <SettingsField label="Date Range">
                  <SettingsInput
                    value={entryForm.date_range || ''}
                    onChange={(e) => setEntryForm({ ...entryForm, date_range: e.target.value })}
                    placeholder="e.g. Jan 2023 - Present, 2022 - 2026"
                  />
                </SettingsField>
                <SettingsField label="Location">
                  <SettingsInput
                    value={entryForm.location || ''}
                    onChange={(e) => setEntryForm({ ...entryForm, location: e.target.value })}
                    placeholder="e.g. Remote, Surat, India"
                  />
                </SettingsField>
              </div>

              <SettingsField label="Description / Summary">
                <SettingsTextarea
                  value={entryForm.description || ''}
                  onChange={(e) => setEntryForm({ ...entryForm, description: e.target.value })}
                  placeholder="e.g. GPA: 8.5/10, project description summary..."
                  rows={2}
                />
              </SettingsField>

              {/* Bullet Points List Editor */}
              <SettingsField label="Details / Bullet Points">
                <div className="space-y-2">
                  {entryForm.details.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <SettingsInput
                        value={bullet}
                        onChange={(e) => {
                          const updated = [...entryForm.details];
                          updated[idx] = e.target.value;
                          setEntryForm({ ...entryForm, details: updated });
                        }}
                        placeholder={`Bullet point ${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeDetailBullet(idx)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <SettingsInput
                      value={detailInput}
                      onChange={(e) => setDetailInput(e.target.value)}
                      placeholder="Add a new bullet point detail..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addDetailBullet();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addDetailBullet}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </SettingsField>

              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <SettingsField label="Sort Order">
                  <SettingsInput
                    type="number"
                    value={entryForm.sort_order}
                    onChange={(e) => setEntryForm({ ...entryForm, sort_order: Number(e.target.value) })}
                  />
                </SettingsField>

                <label className="flex items-center gap-2 text-sm text-foreground select-none cursor-pointer mt-5">
                  <input
                    type="checkbox"
                    checked={entryForm.visible}
                    onChange={(e) => setEntryForm({ ...entryForm, visible: e.target.checked })}
                    className="rounded border-border bg-muted text-primary focus:ring-primary/30"
                  />
                  Visible
                </label>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20 rounded-b-2xl">
              <button
                onClick={() => setEntryModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEntry}
                disabled={savingEntry}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {savingEntry ? 'Saving…' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
