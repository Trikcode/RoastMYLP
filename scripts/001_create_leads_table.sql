-- Create leads table to store email addresses
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for lead capture)
CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can view (for future admin features)
CREATE POLICY "Authenticated users can view leads"
  ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');
