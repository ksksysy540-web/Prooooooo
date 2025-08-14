-- Update RLS policies for products table
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON products;

-- Create comprehensive RLS policies for products table
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Update RLS policies for click_tracking table
DROP POLICY IF EXISTS "Allow public to insert clicks" ON click_tracking;
DROP POLICY IF EXISTS "Allow authenticated users to view clicks" ON click_tracking;

-- Create comprehensive RLS policies for click_tracking table
CREATE POLICY "Enable insert for all users" ON click_tracking
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON click_tracking
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON click_tracking
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON click_tracking
    FOR DELETE USING (auth.role() = 'authenticated');

-- Ensure RLS is enabled on both tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_tracking ENABLE ROLS LEVEL SECURITY;

-- Update storage policies for product images
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;

-- Create comprehensive storage policies
CREATE POLICY "Enable read access for all users" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Enable insert for authenticated users" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
