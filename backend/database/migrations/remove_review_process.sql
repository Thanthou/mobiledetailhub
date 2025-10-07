-- Remove review approval process
-- Reviews are now published immediately when created

-- Drop indexes that reference status and published_at
DROP INDEX IF EXISTS reputation.idx_reviews_status;
DROP INDEX IF EXISTS reputation.idx_reviews_published_at;
DROP INDEX IF EXISTS reputation.idx_reviews_tenant_status;
DROP INDEX IF EXISTS reputation.idx_reviews_tenant_published;

-- Remove status and published_at columns
ALTER TABLE reputation.reviews 
    DROP COLUMN IF EXISTS status,
    DROP COLUMN IF EXISTS published_at;

-- Create new indexes without status/published_at references (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_rating ON reputation.reviews(tenant_slug, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_created ON reputation.reviews(tenant_slug, created_at);

-- Add comment to clarify the change
COMMENT ON TABLE reputation.reviews IS 'Reviews are published immediately upon creation - no approval process';
