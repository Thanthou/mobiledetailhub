-- Migration: Add review statistics columns to website.content table
-- Date: 2025-10-14
-- Description: Adds reviews_avg_rating and reviews_total_count columns to track review statistics

-- Add review statistics columns
ALTER TABLE website.content
ADD COLUMN IF NOT EXISTS reviews_avg_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS reviews_total_count INTEGER DEFAULT 0;

-- Add indexes for potential filtering/sorting
CREATE INDEX IF NOT EXISTS idx_content_avg_rating ON website.content (reviews_avg_rating);
CREATE INDEX IF NOT EXISTS idx_content_review_count ON website.content (reviews_total_count);

-- Update existing records with actual review statistics
UPDATE website.content wc
SET 
  reviews_total_count = (
    SELECT COUNT(*)
    FROM reputation.reviews r
    JOIN tenants.business b ON b.slug = r.tenant_slug
    WHERE b.id = wc.business_id
  ),
  reviews_avg_rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reputation.reviews r
    JOIN tenants.business b ON b.slug = r.tenant_slug
    WHERE b.id = wc.business_id
  ),
  updated_at = NOW();

