export const NOW_CARD_STATUSES = [
  'Building',
  'Shipping',
  'Shipped',
  'Research',
  'Planning',
  'Custom',
] as const;

export type NowCardStatus = (typeof NOW_CARD_STATUSES)[number];

export type NowCardConfig = {
  section_label: string;
  status_label: string;
  next_drop_text: string;
  estimated_time: string;
  tech_badge_top: string;
  tech_badge_bottom: string;
};

export type NowCardItem = {
  id: string;
  title: string;
  status: NowCardStatus;
  status_custom: string | null;
  timeline_label: string;
  sort_order: number;
  visible: boolean;
  link_url: string | null;
  link_label: string | null;
  thumbnail_url: string | null;
  progress_percentage: number | null;
  created_at: string;
  updated_at: string;
};

export type NowCardData = {
  config: NowCardConfig;
  items: NowCardItem[];
};
