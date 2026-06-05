-- CMS column extensions and storage
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline text DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year text DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_status text DEFAULT 'Shipped';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study_sections jsonb DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS performance_metrics jsonb DEFAULT '{}';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS location text DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS skills_tags text[] DEFAULT '{}';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

CREATE POLICY "Authenticated can read all projects"
  ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read all testimonials"
  ON testimonials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read all blog posts"
  ON blog_posts FOR SELECT TO authenticated USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cms-images', 'cms-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

CREATE POLICY "Public can read cms images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'cms-images');
CREATE POLICY "Authenticated can upload cms images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-images');
CREATE POLICY "Authenticated can update cms images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-images') WITH CHECK (bucket_id = 'cms-images');
CREATE POLICY "Authenticated can delete cms images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-images');
