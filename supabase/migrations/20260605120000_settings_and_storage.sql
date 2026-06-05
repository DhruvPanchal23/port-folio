/*
  # Portfolio Settings & Storage

  1. Storage Buckets
    - `resumes` — PDF resume (fixed path: resume.pdf)
    - `profile-images` — profile avatar (fixed path: avatar)

  2. Settings Keys (portfolio_settings)
    - `profile` — profile image URL and metadata
    - `resume` — resume PDF URL and metadata
    - `social` — social links + custom links
    - `site` — version, footer, availability, location

  3. Security
    - Public read on storage objects
    - Authenticated upload/update/delete on storage
*/

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'resumes',
    'resumes',
    true,
    10485760,
    ARRAY['application/pdf']
  ),
  (
    'profile-images',
    'profile-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies: public read
CREATE POLICY "Public can read resumes"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Public can read profile images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'profile-images');

-- Storage policies: authenticated write
CREATE POLICY "Authenticated can upload resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated can update resumes"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated can delete resumes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated can upload profile images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Authenticated can update profile images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-images')
  WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Authenticated can delete profile images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-images');

-- Seed / update portfolio settings
INSERT INTO portfolio_settings (key, value) VALUES
  (
    'profile',
    '{
      "image_url": "",
      "image_path": "",
      "name": "Dhruv Panchal",
      "updated_at": null
    }'::jsonb
  ),
  (
    'resume',
    '{
      "url": "",
      "path": "resume.pdf",
      "file_name": "",
      "uploaded_at": null,
      "file_size": null
    }'::jsonb
  ),
  (
    'social',
    '{
      "github": "https://github.com/dhruvpanchal",
      "linkedin": "https://linkedin.com/in/dhruv-panchal",
      "twitter": "https://twitter.com/dhruvpanchal",
      "email": "dhruvpanchal.dev@gmail.com",
      "spotify": "https://open.spotify.com/album/namastute",
      "portfolio_url": "https://dhruvpanchal.dev",
      "custom_links": []
    }'::jsonb
  ),
  (
    'site',
    '{
      "current_version": "1.0",
      "last_updated": "July 2025",
      "copyright_text": "Crafted with Coffee, Playlists & Curiosity.",
      "footer_content": "Explore, experiment && say hello",
      "availability_status": "Available for select projects · Feb 2026",
      "current_location": "Surat, IN",
      "open_to_work": true,
      "open_to_work_headline": "I''m available for full-time roles & freelance projects.",
      "open_to_work_description": "I thrive on crafting dynamic web applications, and delivering seamless user experiences.",
      "footer_cta_title": "MY SITE",
      "footer_cta_subtitle": "Explore, Connect"
    }'::jsonb
  )
ON CONFLICT (key) DO NOTHING;
