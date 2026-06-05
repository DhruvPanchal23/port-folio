-- Command menu items (database-driven Ctrl+K)
CREATE TABLE IF NOT EXISTS command_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  category text NOT NULL DEFAULT 'Navigate',
  href text NOT NULL,
  icon text NOT NULL DEFAULT 'Link',
  hint text DEFAULT '',
  keywords text[] DEFAULT '{}',
  external boolean DEFAULT false,
  enabled boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE command_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read enabled command items"
  ON command_items FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

CREATE POLICY "Authenticated can read all command items"
  ON command_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert command items"
  ON command_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update command items"
  ON command_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete command items"
  ON command_items FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_command_items_enabled ON command_items(enabled);
CREATE INDEX IF NOT EXISTS idx_command_items_sort ON command_items(sort_order);

-- Allow admin delete on submissions
CREATE POLICY "Authenticated can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete feedback submissions"
  ON feedback_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Seed default command items
INSERT INTO command_items (slug, label, category, href, icon, hint, keywords, external, sort_order) VALUES
  ('home', 'Home', 'Navigate', '/', 'Home', 'g h', ARRAY['home', 'landing'], false, 1),
  ('about', 'About', 'Navigate', '/about', 'User', 'g a', ARRAY['bio', 'profile'], false, 2),
  ('work', 'Selected Work', 'Navigate', '/work', 'Briefcase', 'g w', ARRAY['projects', 'portfolio'], false, 3),
  ('resume', 'Resume', 'Navigate', '/resume', 'FileText', 'g r', ARRAY['cv', 'experience'], false, 4),
  ('blog', 'Blog', 'Navigate', '/blog', 'BookOpen', 'g b', ARRAY['articles', 'writing'], false, 5),
  ('contact', 'Start a conversation', 'Connect', '/connect', 'Mail', 'g c', ARRAY['contact', 'email'], false, 10),
  ('guestbook', 'Sign the Guestbook', 'Connect', '/guestbook', 'MessageSquare', '', ARRAY['sign', 'message'], false, 11),
  ('testimonials', 'Testimonials', 'Connect', '/testimonials', 'Star', '', ARRAY['reviews', 'praise'], false, 12),
  ('feedback', 'Send Feedback', 'Connect', '/feedback', 'Sparkles', '', ARRAY['suggest'], false, 13),
  ('github', 'GitHub', 'Elsewhere', 'https://github.com/dhruvpanchal', 'Github', '↗', ARRAY['github', 'code'], true, 20),
  ('linkedin', 'LinkedIn', 'Elsewhere', 'https://linkedin.com/in/dhruv-panchal', 'Linkedin', '↗', ARRAY['linkedin'], true, 21),
  ('twitter', 'Twitter / X', 'Elsewhere', 'https://twitter.com/dhruvpanchal', 'Twitter', '↗', ARRAY['twitter', 'x'], true, 22),
  ('all-links', 'All Links', 'Elsewhere', '/links', 'Link', '', ARRAY['social'], false, 23),
  ('engine-room', 'Engine Room — my setup', 'Setup', '/engine-room', 'Settings', '', ARRAY['uses', 'tools'], false, 30),
  ('admin', 'Admin Panel', 'Setup', '/admin', 'Settings', '', ARRAY['dashboard', 'manage'], false, 31)
ON CONFLICT (slug) DO NOTHING;
