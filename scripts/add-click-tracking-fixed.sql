-- Add click tracking table with correct UUID data type
CREATE TABLE IF NOT EXISTS click_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_click_tracking_product_id ON click_tracking(product_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_clicked_at ON click_tracking(clicked_at);

-- Enable RLS
ALTER TABLE click_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to insert clicks
CREATE POLICY "Allow authenticated users to insert clicks" ON click_tracking
  FOR INSERT WITH CHECK (true);

-- Create policy for authenticated users to read click data
CREATE POLICY "Allow authenticated users to read clicks" ON click_tracking
  FOR SELECT USING (auth.role() = 'authenticated');

-- Add click_count column to products table for caching
ALTER TABLE products ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- Create function to update click count
CREATE OR REPLACE FUNCTION update_product_click_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET click_count = (
    SELECT COUNT(*) 
    FROM click_tracking 
    WHERE product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update click count
DROP TRIGGER IF EXISTS trigger_update_click_count ON click_tracking;
CREATE TRIGGER trigger_update_click_count
  AFTER INSERT ON click_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_product_click_count();
