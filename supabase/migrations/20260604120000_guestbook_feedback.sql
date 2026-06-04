-- Add guestbook and feedback tables

-- Guestbook entries
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  avatar_url text,
  status text DEFAULT 'approved',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved guestbook entries"
  ON guestbook_entries FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Authenticated users can insert guestbook entries"
  ON guestbook_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated can update own entries"
  ON guestbook_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated can delete own entries"
  ON guestbook_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Feedback submissions
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  category text DEFAULT 'general',
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback"
  ON feedback_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can read feedback"
  ON feedback_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update feedback"
  ON feedback_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guestbook_status ON guestbook_entries(status);
CREATE INDEX IF NOT EXISTS idx_guestbook_created ON guestbook_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback_submissions(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback_submissions(created_at DESC);
