-- Create products table for SwiftMart e-commerce
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  affiliate_link TEXT NOT NULL,
  image_url TEXT,
  badge TEXT, -- For product badges like "Trending", "Limited Offer", etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample products with badges
INSERT INTO products (product_name, description, price, affiliate_link, image_url, badge) VALUES
('Premium Wireless Headphones', 'Experience crystal-clear audio with our premium wireless headphones featuring noise cancellation and 30-hour battery life.', 199.99, 'https://example.com/headphones?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'Best Seller'),
('Smart Fitness Tracker', 'Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and sleep tracking.', 149.99, 'https://example.com/fitness-tracker?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'Trending'),
('Ergonomic Office Chair', 'Improve your productivity and comfort with this ergonomic office chair designed for long work sessions.', 299.99, 'https://example.com/office-chair?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'Limited Offer'),
('Portable Bluetooth Speaker', 'Take your music anywhere with this waterproof portable speaker delivering rich, powerful sound.', 79.99, 'https://example.com/speaker?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'New Arrival'),
('Laptop Stand with Cooling', 'Elevate your laptop for better ergonomics while keeping it cool with built-in fans and adjustable height.', 59.99, 'https://example.com/laptop-stand?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'Best Seller'),
('Wireless Charging Pad', 'Fast wireless charging for all Qi-enabled devices with sleek design and LED indicators.', 39.99, 'https://example.com/wireless-charger?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'Trending'),
('Gaming Mechanical Keyboard', 'Professional gaming keyboard with RGB backlighting and tactile mechanical switches.', 129.99, 'https://example.com/gaming-keyboard?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'New Arrival'),
('4K Webcam', 'Ultra HD webcam perfect for streaming, video calls, and content creation with auto-focus technology.', 89.99, 'https://example.com/webcam?ref=affiliate123', '/placeholder.svg?height=300&width=300', 'Limited Offer');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policy for public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Create storage policy for authenticated upload
CREATE POLICY "Authenticated upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
