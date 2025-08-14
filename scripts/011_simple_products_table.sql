-- Create products table for e-commerce system
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name text NOT NULL,
    description text,
    price numeric NOT NULL,
    affiliate_link text NOT NULL,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read products
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

-- Policy: Only authenticated users can insert products  
CREATE POLICY "Authenticated users can insert products" ON public.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update products
CREATE POLICY "Authenticated users can update products" ON public.products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete products
CREATE POLICY "Authenticated users can delete products" ON public.products
    FOR DELETE USING (auth.role() = 'authenticated');
