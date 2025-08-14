-- Create features table for feature/benefit pairs (repeatable sections)
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
  
  feature_icon VARCHAR(100), -- Icon name or class
  feature_title VARCHAR(255) NOT NULL,
  benefit_description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for features table
CREATE TRIGGER update_features_updated_at 
    BEFORE UPDATE ON features 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_features_landing_page_order ON features(landing_page_id, display_order);
