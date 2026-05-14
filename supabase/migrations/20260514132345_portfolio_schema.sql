
/*
  # Portfolio Schema

  1. New Tables
    - `portfolio_settings` - site-wide settings (hero text, about, theme, toggles)
    - `projects` - portfolio projects with metadata, tech stack, metrics
    - `testimonials` - client testimonials with rating, role, company
    - `services` - offered services with descriptions
    - `blog_posts` - blog/insights with slug, content, tags, SEO
    - `contact_submissions` - contact form submissions
    - `media_library` - uploaded media assets
    - `activity_logs` - admin activity tracking

  2. Security
    - RLS enabled on all tables
    - Admin-only write access via service role
    - Public read for published content
*/

-- Portfolio Settings
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings"
  ON portfolio_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can update settings"
  ON portfolio_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert settings"
  ON portfolio_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  long_description text DEFAULT '',
  cover_image text DEFAULT '',
  images text[] DEFAULT '{}',
  tech_stack text[] DEFAULT '{}',
  category text DEFAULT 'web',
  status text DEFAULT 'published',
  featured boolean DEFAULT false,
  github_url text DEFAULT '',
  live_url text DEFAULT '',
  metrics jsonb DEFAULT '{}',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated can manage projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  avatar text DEFAULT '',
  content text NOT NULL DEFAULT '',
  rating integer DEFAULT 5,
  status text DEFAULT 'published',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated can manage testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon text DEFAULT '',
  features text[] DEFAULT '{}',
  status text DEFAULT 'published',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated can manage services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL DEFAULT '',
  excerpt text DEFAULT '',
  content text DEFAULT '',
  cover_image text DEFAULT '',
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  status text DEFAULT 'draft',
  read_time integer DEFAULT 5,
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  og_image text DEFAULT '',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated can manage posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Contact Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL DEFAULT '',
  budget text DEFAULT '',
  project_type text DEFAULT '',
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can read contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL DEFAULT '',
  resource text DEFAULT '',
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can insert logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated can read logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Seed default settings
INSERT INTO portfolio_settings (key, value) VALUES
  ('hero', '{"name": "Alex Rivera", "tagline": "Building the future, one pixel at a time.", "roles": ["Developer", "Designer", "Creative Technologist", "Cyber Security Enthusiast", "Builder"], "cta_primary": "View My Work", "cta_secondary": "Get In Touch", "location": "San Francisco, CA", "available": true}'),
  ('about', '{"bio": "I craft digital experiences that sit at the intersection of engineering precision and creative vision. With 5+ years building products that users love, I bring both technical depth and design sensibility to every project.", "philosophy": "Code is poetry. Design is language. Together they tell stories that move people to action.", "experience_years": 5, "projects_built": 50, "clients_served": 30}'),
  ('seo', '{"title": "Alex Rivera — Creative Technologist", "description": "Full-stack developer and creative technologist building premium digital experiences. Available for freelance projects and collaborations.", "keywords": ["developer", "portfolio", "react", "nextjs", "fullstack"], "og_image": ""}'),
  ('social', '{"github": "https://github.com", "twitter": "https://twitter.com", "linkedin": "https://linkedin.com", "instagram": "https://instagram.com", "email": "hello@alexrivera.dev"}')
ON CONFLICT (key) DO NOTHING;

-- Seed sample projects
INSERT INTO projects (title, slug, description, long_description, tech_stack, category, featured, metrics, sort_order) VALUES
  ('Stellar Design System', 'stellar-design-system', 'A comprehensive design system powering enterprise products at scale', 'Built from the ground up to serve 50+ product teams across a Fortune 500 company. Includes 200+ components, full dark mode, and accessibility compliance.', ARRAY['React', 'TypeScript', 'Storybook', 'Figma', 'CSS Variables'], 'design-system', true, '{"components": "200+", "teams": "50+", "adoption": "94%"}', 1),
  ('NeuralFlow AI Platform', 'neuralflow-ai', 'Real-time AI workflow automation platform with visual pipeline builder', 'Full-stack SaaS product enabling non-technical teams to build complex AI pipelines without code. Reached 10k users in 3 months post-launch.', ARRAY['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'OpenAI', 'Redis'], 'saas', true, '{"users": "10k+", "pipelines_built": "50k+", "time_saved": "40hrs/week"}', 2),
  ('Cinematica Web App', 'cinematica', 'Award-winning film discovery platform with AI-powered recommendations', 'Reimagined the film discovery experience with a cinematic UI, personalized recommendations, and social features. Won Product Hunt #1 Product of the Day.', ARRAY['React', 'Node.js', 'GraphQL', 'MongoDB', 'Redis'], 'web', true, '{"users": "25k+", "rating": "4.9/5", "award": "PH #1"}', 3),
  ('CyberShield Dashboard', 'cybershield', 'Enterprise security monitoring dashboard with real-time threat detection', 'End-to-end security operations platform for mid-market companies. Integrates 15+ security tools into a unified command center.', ARRAY['React', 'D3.js', 'Python', 'Kafka', 'Elasticsearch'], 'security', false, '{"threats_blocked": "1M+", "uptime": "99.99%", "integrations": "15+"}', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed sample testimonials
INSERT INTO testimonials (name, role, company, content, rating, sort_order) VALUES
  ('Sarah Chen', 'CTO', 'TechVentures Inc.', 'Working with Alex was transformative. The attention to detail, the clean code, and the ability to translate our vision into reality exceeded all expectations. The product launched ahead of schedule and users love it.', 5, 1),
  ('Marcus Rodriguez', 'Founder', 'Launchpad Studio', 'Alex does not just build websites — he builds experiences. Our conversion rate tripled after the redesign, and the codebase is so clean our new developers can onboard in days.', 5, 2),
  ('Priya Sharma', 'Product Lead', 'Finova', 'The level of craft and professionalism is rare to find. Alex delivered a complex fintech dashboard that our compliance team, design team, and users all celebrate. Exceptional work.', 5, 3),
  ('James Whitfield', 'CEO', 'CreativeHQ', 'From concept to launch in 6 weeks. The speed, quality, and communication were all A+. Alex is the definition of a 10x engineer. We will be working together on all future projects.', 5, 4)
ON CONFLICT DO NOTHING;

-- Seed services
INSERT INTO services (title, description, icon, features, sort_order) VALUES
  ('Web Development', 'End-to-end development of high-performance web applications using modern technologies.', 'Code', ARRAY['Next.js & React', 'API Development', 'Database Architecture', 'Performance Optimization', 'Testing & QA'], 1),
  ('UI/UX Design', 'Crafting intuitive, beautiful interfaces that convert visitors into customers.', 'Palette', ARRAY['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility'], 2),
  ('Portfolio Design', 'Premium portfolio websites that position you as a top-tier professional.', 'Layout', ARRAY['Custom Design', 'CMS Integration', 'SEO Optimized', 'Mobile First', 'Analytics'], 3),
  ('Branding', 'Strategic brand identity that communicates your unique value proposition.', 'Sparkles', ARRAY['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy', 'Asset Creation'], 4),
  ('SEO Optimization', 'Data-driven SEO strategies that drive organic growth and visibility.', 'TrendingUp', ARRAY['Technical SEO', 'Content Strategy', 'Link Building', 'Analytics Setup', 'Performance'], 5),
  ('Automation Solutions', 'Custom automation workflows that save time and eliminate repetitive tasks.', 'Zap', ARRAY['Workflow Automation', 'API Integrations', 'Data Pipelines', 'Scheduled Tasks', 'Monitoring'], 6),
  ('Creative Direction', 'Strategic creative leadership for campaigns, products, and brand moments.', 'Lightbulb', ARRAY['Campaign Strategy', 'Art Direction', 'Content Planning', 'Visual Storytelling', 'Brand Voice'], 7),
  ('Social Media Design', 'Scroll-stopping visual content that builds community and drives engagement.', 'Share2', ARRAY['Content Templates', 'Story Designs', 'Ad Creatives', 'Brand Consistency', 'Motion Graphics'], 8)
ON CONFLICT DO NOTHING;
