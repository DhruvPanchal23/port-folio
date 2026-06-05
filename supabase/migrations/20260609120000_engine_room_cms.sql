-- Engine Room CMS

CREATE TABLE IF NOT EXISTS engine_room_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engine_room_nav_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  external boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engine_room_cta_buttons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  style text NOT NULL DEFAULT 'primary',
  external boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engine_room_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  icon text NOT NULL DEFAULT 'Monitor',
  section_type text NOT NULL DEFAULT 'tools',
  metadata jsonb DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engine_room_section_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES engine_room_sections(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  url text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE engine_room_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE engine_room_nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE engine_room_cta_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE engine_room_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE engine_room_section_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible engine room stats"
  ON engine_room_stats FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "Auth read all engine room stats"
  ON engine_room_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert engine room stats"
  ON engine_room_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update engine room stats"
  ON engine_room_stats FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete engine room stats"
  ON engine_room_stats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Public read visible engine room nav links"
  ON engine_room_nav_links FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "Auth read all engine room nav links"
  ON engine_room_nav_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert engine room nav links"
  ON engine_room_nav_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update engine room nav links"
  ON engine_room_nav_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete engine room nav links"
  ON engine_room_nav_links FOR DELETE TO authenticated USING (true);

CREATE POLICY "Public read visible engine room cta buttons"
  ON engine_room_cta_buttons FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "Auth read all engine room cta buttons"
  ON engine_room_cta_buttons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert engine room cta buttons"
  ON engine_room_cta_buttons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update engine room cta buttons"
  ON engine_room_cta_buttons FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete engine room cta buttons"
  ON engine_room_cta_buttons FOR DELETE TO authenticated USING (true);

CREATE POLICY "Public read visible engine room sections"
  ON engine_room_sections FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "Auth read all engine room sections"
  ON engine_room_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert engine room sections"
  ON engine_room_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update engine room sections"
  ON engine_room_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete engine room sections"
  ON engine_room_sections FOR DELETE TO authenticated USING (true);

CREATE POLICY "Public read visible engine room section items"
  ON engine_room_section_items FOR SELECT TO anon, authenticated
  USING (
    visible = true AND EXISTS (
      SELECT 1 FROM engine_room_sections s
      WHERE s.id = section_id AND s.visible = true
    )
  );
CREATE POLICY "Auth read all engine room section items"
  ON engine_room_section_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert engine room section items"
  ON engine_room_section_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update engine room section items"
  ON engine_room_section_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete engine room section items"
  ON engine_room_section_items FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_engine_room_sections_sort ON engine_room_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_engine_room_section_items_section ON engine_room_section_items(section_id);

INSERT INTO portfolio_settings (key, value) VALUES
  (
    'engine_room',
    '{
      "title": "Engine Room",
      "subtitle": "The tools & gear that power my work",
      "description": "",
      "footer_message": "",
      "empty_state_title": "Nothing to show yet",
      "empty_state_message": "Check back soon — the engine room is being tuned up.",
      "error_state_title": "Could not load Engine Room",
      "error_state_message": "Please refresh the page or try again later."
    }'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

-- Seed sections when empty
DO $$
DECLARE
  listening_id uuid;
  dev_id uuid;
  design_id uuid;
  prod_id uuid;
  hw_id uuid;
  coffee_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM engine_room_sections LIMIT 1) THEN
    INSERT INTO engine_room_sections (title, icon, section_type, sort_order, visible, featured, metadata)
    VALUES (
      'Currently Listening', 'Headphones', 'listening', 1, true, true,
      '{"track":"Namastute","artist":"Seedhe Maut","album":"Namastute","url":"https://open.spotify.com/album/namastute"}'::jsonb
    ) RETURNING id INTO listening_id;

    INSERT INTO engine_room_sections (title, icon, section_type, sort_order, visible, featured)
    VALUES ('Development', 'Code2', 'tools', 2, true, false) RETURNING id INTO dev_id;

    INSERT INTO engine_room_section_items (section_id, name, description, url, sort_order) VALUES
      (dev_id, 'Visual Studio Code', 'Primary code editor', 'https://code.visualstudio.com', 1),
      (dev_id, 'Next.js', 'React framework', 'https://nextjs.org', 2),
      (dev_id, 'TypeScript', 'Type-safe JavaScript', 'https://typescriptlang.org', 3),
      (dev_id, 'Tailwind CSS', 'Utility-first CSS framework', 'https://tailwindcss.com', 4),
      (dev_id, 'Git & GitHub', 'Version control', 'https://github.com', 5),
      (dev_id, 'Vercel', 'Deployment platform', 'https://vercel.com', 6);

    INSERT INTO engine_room_sections (title, icon, section_type, sort_order, visible, featured)
    VALUES ('Design', 'Palette', 'tools', 3, true, false) RETURNING id INTO design_id;

    INSERT INTO engine_room_section_items (section_id, name, description, url, sort_order) VALUES
      (design_id, 'Figma', 'Interface design & prototyping', 'https://figma.com', 1),
      (design_id, 'Adobe Creative Suite', 'Graphics & photo editing', 'https://adobe.com', 2),
      (design_id, 'Framer Motion', 'React animations', 'https://framer.com/motion', 3),
      (design_id, 'Shadcn/ui', 'Component library', 'https://ui.shadcn.com', 4);

    INSERT INTO engine_room_sections (title, icon, section_type, sort_order, visible, featured)
    VALUES ('Productivity', 'Monitor', 'tools', 4, true, false) RETURNING id INTO prod_id;

    INSERT INTO engine_room_section_items (section_id, name, description, url, sort_order) VALUES
      (prod_id, 'Notion', 'Notes & project management', 'https://notion.so', 1),
      (prod_id, 'Linear', 'Issue tracking', 'https://linear.app', 2),
      (prod_id, 'Raycast', 'macOS productivity launcher', 'https://raycast.com', 3),
      (prod_id, 'Arc Browser', 'Web browser', 'https://arc.net', 4);

    INSERT INTO engine_room_sections (title, icon, section_type, sort_order, visible, featured)
    VALUES ('Hardware', 'Monitor', 'tools', 5, true, false) RETURNING id INTO hw_id;

    INSERT INTO engine_room_section_items (section_id, name, description, url, sort_order) VALUES
      (hw_id, 'MacBook Pro M2', '16-inch, 32GB RAM', NULL, 1),
      (hw_id, 'LG UltraWide Monitor', '34-inch curved display', NULL, 2),
      (hw_id, 'Mechanical Keyboard', 'Keychron K8 Pro', NULL, 3),
      (hw_id, 'Sony WH-1000XM5', 'Noise-cancelling headphones', NULL, 4);

    INSERT INTO engine_room_sections (title, icon, section_type, sort_order, visible, featured, metadata)
    VALUES (
      'Powered by Coffee', 'Coffee', 'coffee', 6, true, false,
      '{"line1":"∞ cups consumed and counting...","line2":"Because great code doesn''t write itself at 3 AM ☕"}'::jsonb
    );
  END IF;
END $$;
