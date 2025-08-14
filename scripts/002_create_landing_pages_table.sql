-- Create landing_pages table for main page data
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Global Page Settings (Category 1)
  product_name VARCHAR(255) NOT NULL,
  primary_affiliate_link TEXT NOT NULL,
  target_audience TEXT,
  affiliate_disclosure TEXT,
  
  -- Hero Section (Category 2)
  main_headline VARCHAR(500),
  sub_headline TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  primary_cta_text VARCHAR(100),
  
  -- Problem & Agitation (Category 3)
  problem_headline VARCHAR(500),
  problem_description TEXT,
  
  -- Solution & Benefits (Category 4)
  solution_headline VARCHAR(500),
  solution_description TEXT,
  
  -- Social Proof (Category 5)
  social_proof_headline VARCHAR(500),
  
  -- The Offer & CTA (Category 6)
  offer_headline VARCHAR(500),
  urgency_scarcity_text TEXT,
  risk_reversal_guarantee TEXT,
  final_cta_text VARCHAR(100),
  
  -- FAQ Section (Category 7)
  faq_headline VARCHAR(500),
  
  -- Meta fields
  slug VARCHAR(255) UNIQUE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for landing_pages table
CREATE TRIGGER update_landing_pages_updated_at 
    BEFORE UPDATE ON landing_pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_user_id ON landing_pages(user_id);
