-- Add discount and badge columns to products table if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;

-- Update existing products with sample badges and discounts for testing
UPDATE products SET 
  badge = CASE 
    WHEN id = (SELECT id FROM products ORDER BY created_at LIMIT 1) THEN 'Best Seller'
    WHEN id = (SELECT id FROM products ORDER BY created_at LIMIT 1 OFFSET 1) THEN 'Trending'
    WHEN id = (SELECT id FROM products ORDER BY created_at LIMIT 1 OFFSET 2) THEN 'Limited Offer'
    ELSE 'New Arrival'
  END,
  discount = CASE 
    WHEN id = (SELECT id FROM products ORDER BY created_at LIMIT 1) THEN 25
    WHEN id = (SELECT id FROM products ORDER BY created_at LIMIT 1 OFFSET 1) THEN 15
    WHEN id = (SELECT id FROM products ORDER BY created_at LIMIT 1 OFFSET 2) THEN 30
    ELSE 10
  END
WHERE badge IS NULL OR discount = 0;
