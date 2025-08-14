-- Add badges column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS badges TEXT[];

-- Update existing products with sample badges
UPDATE products SET badges = ARRAY['Best Seller'] WHERE product_name LIKE '%Headphones%';
UPDATE products SET badges = ARRAY['Trending', 'New Arrival'] WHERE product_name LIKE '%Fitness Tracker%';
UPDATE products SET badges = ARRAY['Limited Offer'] WHERE product_name LIKE '%Office Chair%';
UPDATE products SET badges = ARRAY['Hot Deal'] WHERE product_name LIKE '%Speaker%';
UPDATE products SET badges = ARRAY['Best Seller', 'Limited Offer'] WHERE product_name LIKE '%Laptop Stand%';
