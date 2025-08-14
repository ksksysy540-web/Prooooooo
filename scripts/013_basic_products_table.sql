-- Simple products table creation
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name text NOT NULL,
    description text,
    price numeric NOT NULL,
    affiliate_link text NOT NULL,
    image_url text,
    created_at timestamp DEFAULT now()
);
