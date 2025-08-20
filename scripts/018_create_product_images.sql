-- Create product_images table for multiple images per product
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON product_images(product_id, sort_order);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON product_images
  FOR SELECT USING (true);

-- Authenticated full access
CREATE POLICY IF NOT EXISTS "Allow authenticated users full access" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

