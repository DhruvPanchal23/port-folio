-- /NOW live card CMS

CREATE TABLE IF NOT EXISTS now_card_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'Building',
  status_custom text,
  timeline_label text NOT NULL DEFAULT 'Now',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  link_url text,
  link_label text,
  thumbnail_url text,
  progress_percentage integer CHECK (progress_percentage IS NULL OR (progress_percentage >= 0 AND progress_percentage <= 100)),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE now_card_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible now card items"
  ON now_card_items FOR SELECT
  TO anon, authenticated
  USING (visible = true);

CREATE POLICY "Authenticated can read all now card items"
  ON now_card_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert now card items"
  ON now_card_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update now card items"
  ON now_card_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete now card items"
  ON now_card_items FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_now_card_items_sort ON now_card_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_now_card_items_visible ON now_card_items(visible);

-- Card config (header, footer, tech badges)
INSERT INTO portfolio_settings (key, value) VALUES
  (
    'now',
    '{
      "section_label": "/now",
      "status_label": "live",
      "next_drop_text": "Next drop",
      "estimated_time": "~ 4 weeks",
      "tech_badge_top": "next.js · ts",
      "tech_badge_bottom": "supabase · postgres"
    }'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

-- Seed default items
INSERT INTO now_card_items (title, status, timeline_label, sort_order, visible)
SELECT * FROM (VALUES
  ('Cinematica — invite-only film journal', 'Building', 'Now', 1, true),
  ('AI in Digital Forensics — research thesis', 'Shipping', 'Q1 ''26', 2, true),
  ('Personal site v3 — this one', 'Shipped', 'Q4 ''25', 3, true)
) AS v(title, status, timeline_label, sort_order, visible)
WHERE NOT EXISTS (SELECT 1 FROM now_card_items LIMIT 1);
