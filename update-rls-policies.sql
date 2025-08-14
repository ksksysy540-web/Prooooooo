-- Update RLS policies for products table
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON products;

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view products)
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON products TO anon;
GRANT ALL ON products TO authenticated;

-- Ensure the badge column exists (add if missing)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'badge') THEN
        ALTER TABLE products ADD COLUMN badge TEXT;
    END IF;
END $$;

-- Update existing products with sample badges if badge column is empty
UPDATE products SET badge = 'Best Seller' WHERE badge IS NULL AND id IN (
    SELECT id FROM products ORDER BY created_at LIMIT 2
);

UPDATE products SET badge = 'New Arrival' WHERE badge IS NULL AND id IN (
    SELECT id FROM products ORDER BY created_at DESC LIMIT 1
);
