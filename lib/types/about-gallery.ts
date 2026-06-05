export type AboutGalleryItem = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  image_path: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};
