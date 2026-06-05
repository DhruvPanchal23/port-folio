-- About gallery carousel CMS

CREATE TABLE IF NOT EXISTS about_gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  image_path text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible about gallery items"
  ON about_gallery_items FOR SELECT
  TO anon, authenticated
  USING (visible = true);

CREATE POLICY "Auth read all about gallery items"
  ON about_gallery_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Auth insert about gallery items"
  ON about_gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth update about gallery items"
  ON about_gallery_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth delete about gallery items"
  ON about_gallery_items FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_about_gallery_sort ON about_gallery_items(sort_order);
