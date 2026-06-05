'use client';

import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { CaseStudySection, CaseStudySectionType } from '@/lib/types/cms';
import { CASE_STUDY_SECTION_LABELS, OPTIONAL_SECTION_TYPES } from '@/lib/types/cms';
import { createSection, reorderSections, sortSections } from '@/lib/cms-utils';
import { SettingsField, SettingsInput, SettingsTextarea } from '@/components/admin/settings/SettingsFormCard';
import ImageUploadField from './ImageUploadField';

export default function CaseStudyBuilder({
  sections,
  onChange,
}: {
  sections: CaseStudySection[];
  onChange: (sections: CaseStudySection[]) => void;
}) {
  const sorted = sortSections(sections);

  const update = (id: string, patch: Partial<CaseStudySection>) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const updateContent = (id: string, content: Record<string, unknown>) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, content: { ...s.content, ...content } } : s)));
  };

  const remove = (id: string) => onChange(sections.filter((s) => s.id !== id));

  const addType = (type: CaseStudySectionType) => {
    onChange([...sections, createSection(type, sections.length)]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              addType(e.target.value as CaseStudySectionType);
              e.target.value = '';
            }
          }}
        >
          <option value="">+ Add section…</option>
          {OPTIONAL_SECTION_TYPES.map((t) => (
            <option key={t} value={t}>{CASE_STUDY_SECTION_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {sorted.map((section) => (
        <div key={section.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-primary uppercase">{section.type}</span>
            <SettingsInput
              value={section.title}
              onChange={(e) => update(section.id, { title: e.target.value })}
              className="flex-1 min-w-[120px]"
            />
            <button type="button" onClick={() => update(section.id, { visible: !section.visible })} className="p-1.5 rounded-lg border border-border" title={section.visible ? 'Hide' : 'Show'}>
              {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button type="button" onClick={() => onChange(reorderSections(sections, section.id, 'up'))} className="p-1.5 rounded-lg border border-border"><ChevronUp size={14} /></button>
            <button type="button" onClick={() => onChange(reorderSections(sections, section.id, 'down'))} className="p-1.5 rounded-lg border border-border"><ChevronDown size={14} /></button>
            <button type="button" onClick={() => remove(section.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 size={14} /></button>
          </div>

          {['overview', 'problem', 'challenge', 'solution', 'architecture', 'research', 'design_process', 'development_process', 'team_role', 'results_impact', 'custom'].includes(section.type) && (
            <SettingsTextarea
              value={String(section.content.text || '')}
              onChange={(e) => updateContent(section.id, { text: e.target.value })}
              placeholder="Section content…"
              className="min-h-[100px]"
            />
          )}

          {['tech_stack', 'key_features', 'learnings', 'future_roadmap'].includes(section.type) && (
            <SettingsTextarea
              value={((section.content.items as string[]) || []).join('\n')}
              onChange={(e) => updateContent(section.id, { items: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean) })}
              placeholder="One item per line"
            />
          )}

          {['screenshots', 'gallery'].includes(section.type) && (
            <>
              <ImageUploadField
                label="Section images"
                folder="projects"
                multiple
                onMultiple={(urls) => updateContent(section.id, { images: [...((section.content.images as string[]) || []), ...urls] })}
              />
              <div className="flex flex-wrap gap-2">
                {((section.content.images as string[]) || []).map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}

          {section.type === 'links' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SettingsField label="GitHub URL">
                <SettingsInput value={String(section.content.github || '')} onChange={(e) => updateContent(section.id, { github: e.target.value })} />
              </SettingsField>
              <SettingsField label="Live URL">
                <SettingsInput value={String(section.content.live || '')} onChange={(e) => updateContent(section.id, { live: e.target.value })} />
              </SettingsField>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
