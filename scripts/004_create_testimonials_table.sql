-- Create testimonials table for customer testimonials (repeatable sections)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
  
  customer_photo_url TEXT,
  customer_name VARCHAR(255) NOT NULL,
  customer_location VARCHAR(255),
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  testimonial_quote TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for testimonials table
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_testimonials_landing_page_order ON testimonials(landing_page_id, display_order);
