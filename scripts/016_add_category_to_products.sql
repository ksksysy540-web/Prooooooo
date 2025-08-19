-- Add a category column to products and index it (safe to run multiple times)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category TEXT;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Optional: backfill NULLs to empty string if you prefer non-null categories
-- UPDATE products SET category = '' WHERE category IS NULL;

-- RLS: existing read policy already allows SELECT for all, so no change needed
