export const ENGINE_ROOM_SECTION_TYPES = ['tools', 'listening', 'coffee', 'content'] as const;
export type EngineRoomSectionType = (typeof ENGINE_ROOM_SECTION_TYPES)[number];

export const ENGINE_ROOM_CTA_STYLES = ['primary', 'secondary'] as const;
export type EngineRoomCtaStyle = (typeof ENGINE_ROOM_CTA_STYLES)[number];

export type EngineRoomPageConfig = {
  title: string;
  subtitle: string;
  description: string;
  footer_message: string;
  empty_state_title: string;
  empty_state_message: string;
  error_state_title: string;
  error_state_message: string;
};

export type EngineRoomListeningMeta = {
  track?: string;
  artist?: string;
  album?: string;
  url?: string;
};

export type EngineRoomCoffeeMeta = {
  line1?: string;
  line2?: string;
};

export type EngineRoomSection = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string;
  section_type: EngineRoomSectionType;
  metadata: EngineRoomListeningMeta | EngineRoomCoffeeMeta | Record<string, unknown>;
  sort_order: number;
  visible: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type EngineRoomSectionItem = {
  id: string;
  section_id: string;
  name: string;
  description: string | null;
  url: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type EngineRoomStat = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type EngineRoomNavLink = {
  id: string;
  label: string;
  href: string;
  external: boolean;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type EngineRoomCtaButton = {
  id: string;
  label: string;
  href: string;
  style: EngineRoomCtaStyle;
  external: boolean;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type EngineRoomData = {
  config: EngineRoomPageConfig;
  stats: EngineRoomStat[];
  navLinks: EngineRoomNavLink[];
  ctaButtons: EngineRoomCtaButton[];
  sections: EngineRoomSection[];
  sectionItems: EngineRoomSectionItem[];
};
