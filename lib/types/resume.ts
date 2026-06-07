export const RESUME_SECTION_TYPES = [
  'skills',
  'experience',
  'education',
  'projects',
  'achievements',
  'certifications',
  'custom',
] as const;

export type ResumeSectionType = (typeof RESUME_SECTION_TYPES)[number];

export interface ResumeSection {
  id: string;
  title: string;
  type: ResumeSectionType;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeEntry {
  id: string;
  section_id: string;
  title: string | null;
  subtitle: string | null;
  date_range: string | null;
  location: string | null;
  description: string | null;
  details: string[];
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeData {
  sections: ResumeSection[];
  entries: ResumeEntry[];
}
