-- Add URL columns to affiliates table
-- Migration: add_url_columns_to_affiliates.sql

-- Add URL columns to the affiliates.affiliates table
ALTER TABLE affiliates.affiliates 
ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS gbp_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS tiktok_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500);

-- Add comments to document the purpose of these columns
COMMENT ON COLUMN affiliates.affiliates.website_url IS 'Business website URL';
COMMENT ON COLUMN affiliates.affiliates.gbp_url IS 'Google Business Profile URL';
COMMENT ON COLUMN affiliates.affiliates.facebook_url IS 'Facebook page/profile URL';
COMMENT ON COLUMN affiliates.affiliates.youtube_url IS 'YouTube channel URL';
COMMENT ON COLUMN affiliates.affiliates.tiktok_url IS 'TikTok profile URL';
COMMENT ON COLUMN affiliates.affiliates.instagram_url IS 'Instagram profile URL';
