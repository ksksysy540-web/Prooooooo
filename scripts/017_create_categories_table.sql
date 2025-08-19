-- Create categories lookup table with basic RLS (idempotent)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON categories
  FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY IF NOT EXISTS "Allow authenticated users full access" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Optional seed categories (safe upsert-like insert ignoring conflicts)
INSERT INTO categories (name, slug)
VALUES
  ('All', 'all'),
  ('Electronics', 'electronics'),
  ('Fashion', 'fashion'),
  ('Beauty', 'beauty'),
  ('Home & Garden', 'home-garden')
ON CONFLICT (slug) DO NOTHING;
