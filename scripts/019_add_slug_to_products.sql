-- Add unique slug for products
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_products_slug ON products(slug);

