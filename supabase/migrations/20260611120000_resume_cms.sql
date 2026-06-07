-- Resume CMS Tables
CREATE TABLE IF NOT EXISTS resume_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL, -- 'skills', 'experience', 'education', 'projects', 'achievements', 'certifications', 'custom'
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES resume_sections(id) ON DELETE CASCADE,
  title text,
  subtitle text,
  date_range text,
  location text,
  description text,
  details text[] DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_entries ENABLE ROW LEVEL SECURITY;

-- Read policies (Public visible only)
CREATE POLICY "Public read visible resume sections"
  ON resume_sections FOR SELECT TO anon, authenticated
  USING (visible = true);

CREATE POLICY "Public read visible resume entries"
  ON resume_entries FOR SELECT TO anon, authenticated
  USING (
    visible = true AND EXISTS (
      SELECT 1 FROM resume_sections s
      WHERE s.id = section_id AND s.visible = true
    )
  );

-- Admin read/write policies (Authenticated users)
CREATE POLICY "Auth read all resume sections"
  ON resume_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert resume sections"
  ON resume_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update resume sections"
  ON resume_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete resume sections"
  ON resume_sections FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth read all resume entries"
  ON resume_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert resume entries"
  ON resume_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update resume entries"
  ON resume_entries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete resume entries"
  ON resume_entries FOR DELETE TO authenticated USING (true);

-- Indexes for sorting and search performance
CREATE INDEX IF NOT EXISTS idx_resume_sections_sort ON resume_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_resume_entries_section ON resume_entries(section_id);
CREATE INDEX IF NOT EXISTS idx_resume_entries_sort ON resume_entries(sort_order);

-- Seed initial resume data
DO $$
DECLARE
  skills_id uuid;
  exp_id uuid;
  edu_id uuid;
  proj_id uuid;
  ach_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resume_sections LIMIT 1) THEN
    -- 1. Skills
    INSERT INTO resume_sections (title, type, sort_order, visible)
    VALUES ('Technical Skills', 'skills', 1, true) RETURNING id INTO skills_id;

    INSERT INTO resume_entries (section_id, title, subtitle, sort_order) VALUES
      (skills_id, 'Frontend', 'React | Next.js | TypeScript | Tailwind CSS | HTML5 | CSS3 | JavaScript', 1),
      (skills_id, 'Backend', 'Node.js | Express.js | MongoDB | MySQL | REST APIs | GraphQL', 2),
      (skills_id, 'Tools', 'Git | GitHub | Figma | Adobe Creative Suite | VS Code | Docker', 3),
      (skills_id, 'Other', 'Graphics Design | Responsive Design | Cybersecurity | Network Security | Python', 4);

    -- 2. Experience
    INSERT INTO resume_sections (title, type, sort_order, visible)
    VALUES ('Experience', 'experience', 2, true) RETURNING id INTO exp_id;

    INSERT INTO resume_entries (section_id, title, subtitle, date_range, location, details, sort_order) VALUES
      (exp_id, 'Freelance Full Stack Developer', 'Self-Employed', 'Jan 2023 - Present', 'Remote', 
       ARRAY[
         'Developed 10+ responsive web applications using React and Node.js',
         'Collaborated with clients to deliver custom solutions on time and within budget',
         'Implemented modern UI/UX practices resulting in 40% improved user engagement',
         'Maintained 100% client satisfaction rate through effective communication'
       ], 1),
      (exp_id, 'UI/UX Design Intern', 'TechCorp Solutions', 'Jun 2023 - Aug 2023', 'Surat, India',
       ARRAY[
         'Designed user interfaces for 3 mobile applications using Figma',
         'Conducted user research and usability testing with 50+ participants',
         'Created design systems and component libraries for consistent branding',
         'Collaborated with development team to ensure pixel-perfect implementation'
       ], 2);

    -- 3. Education
    INSERT INTO resume_sections (title, type, sort_order, visible)
    VALUES ('Education', 'education', 3, true) RETURNING id INTO edu_id;

    INSERT INTO resume_entries (section_id, title, subtitle, description, details, date_range, location, sort_order) VALUES
      (edu_id, 'Bachelor of Technology in Computer Science', 'Sardar Vallabhbhai National Institute of Technology', 
       'GPA: 8.5/10', ARRAY['Data Structures & Algorithms | Database Management | Software Engineering | Computer Networks'],
       '2022 - 2026', 'Surat, India', 1);

    -- 4. Key Projects
    INSERT INTO resume_sections (title, type, sort_order, visible)
    VALUES ('Key Projects', 'projects', 4, true) RETURNING id INTO proj_id;

    INSERT INTO resume_entries (section_id, title, description, subtitle, sort_order) VALUES
      (proj_id, 'Personal Portfolio Website', 'Modern dark glassmorphism portfolio with smooth animations and responsive design', 'React | TypeScript | Tailwind CSS', 1),
      (proj_id, 'Hospital Management System', 'Complete hospital management solution with patient records and appointment scheduling', 'HTML | JavaScript | MySQL | PHP', 2),
      (proj_id, 'ARP Spoofing Detector', 'Network security tool to detect and prevent ARP spoofing attacks in real-time', 'Python | Scapy | Tkinter', 3);

    -- 5. Achievements
    INSERT INTO resume_sections (title, type, sort_order, visible)
    VALUES ('Achievements', 'achievements', 5, true) RETURNING id INTO ach_id;

    INSERT INTO resume_entries (section_id, title, sort_order) VALUES
      (ach_id, '100% client satisfaction rate in freelance projects', 1),
      (ach_id, 'Led team of 4 developers in college hackathon', 2),
      (ach_id, 'Contributed to 5+ open source projects on GitHub', 3),
      (ach_id, 'Speaker at college tech symposium on ''Web Security''', 4);

  END IF;
END $$;
