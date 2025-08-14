-- Insert admin user (this will be handled by Supabase Auth, but we can create a profile)
-- The actual user creation will be done through the auth system
-- This script creates sample products for demonstration

INSERT INTO products (product_name, description, price, affiliate_link, image_url) VALUES
('Premium Wireless Headphones', 'Experience crystal-clear audio with our top-rated wireless headphones. Perfect for music lovers and professionals.', 199.99, 'https://example.com/affiliate/headphones', '/placeholder.svg?height=400&width=400'),
('Smart Fitness Tracker', 'Track your health and fitness goals with advanced monitoring features. Water-resistant and long-lasting battery.', 149.99, 'https://example.com/affiliate/fitness-tracker', '/placeholder.svg?height=400&width=400'),
('Ergonomic Office Chair', 'Improve your productivity with our ergonomically designed office chair. Perfect for long work sessions.', 299.99, 'https://example.com/affiliate/office-chair', '/placeholder.svg?height=400&width=400'),
('Portable Power Bank', 'Never run out of battery again with our high-capacity portable power bank. Fast charging technology included.', 79.99, 'https://example.com/affiliate/power-bank', '/placeholder.svg?height=400&width=400');
