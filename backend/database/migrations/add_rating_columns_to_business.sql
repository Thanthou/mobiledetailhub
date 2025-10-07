-- Add rating and review count columns to tenants.business table
-- These will store scraped data from Google Business Profile

ALTER TABLE tenants.business 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1),
ADD COLUMN IF NOT EXISTS total_review_count INTEGER;

-- Add comments to clarify the purpose
COMMENT ON COLUMN tenants.business.average_rating IS 'Average rating scraped from Google Business Profile (1.0-5.0)';
COMMENT ON COLUMN tenants.business.total_review_count IS 'Total number of reviews scraped from Google Business Profile';
