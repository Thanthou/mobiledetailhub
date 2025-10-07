-- Clean, optimized reviews table for tenant dashboard
-- Matches the AddReviewForm fields exactly

DROP TABLE IF EXISTS reputation.reviews CASCADE;

CREATE TABLE reputation.reviews (
    id SERIAL PRIMARY KEY,
    
    -- Tenant association
    tenant_slug VARCHAR(255) NOT NULL,
    
    -- Review content (required fields from form)
    customer_name VARCHAR(255) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    
    -- Optional fields from form
    reviewer_url VARCHAR(500) NULL, -- Reviewer Profile URL
    vehicle_type VARCHAR(50) NULL CHECK (vehicle_type IN ('car', 'truck', 'suv', 'boat', 'rv', 'motorcycle')),
    
    -- Service types (checkboxes from form)
    paint_correction BOOLEAN NOT NULL DEFAULT false,
    ceramic_coating BOOLEAN NOT NULL DEFAULT false,
    paint_protection_film BOOLEAN NOT NULL DEFAULT false,
    
    -- Review source (auto-detected or manual)
    source VARCHAR(50) NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'google', 'yelp', 'facebook')),
    
    -- Avatar handling
    avatar_filename VARCHAR(255) NULL, -- Stored filename for uploaded avatar
    
    -- Review status and moderation
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create indexes for performance
CREATE INDEX idx_reviews_tenant_slug ON reputation.reviews(tenant_slug);
CREATE INDEX idx_reviews_rating ON reputation.reviews(rating);
CREATE INDEX idx_reviews_status ON reputation.reviews(status);
CREATE INDEX idx_reviews_source ON reputation.reviews(source);
CREATE INDEX idx_reviews_created_at ON reputation.reviews(created_at);
CREATE INDEX idx_reviews_published_at ON reputation.reviews(published_at);

-- Composite indexes for common queries
CREATE INDEX idx_reviews_tenant_status ON reputation.reviews(tenant_slug, status);
CREATE INDEX idx_reviews_tenant_rating ON reputation.reviews(tenant_slug, rating);
CREATE INDEX idx_reviews_tenant_published ON reputation.reviews(tenant_slug, published_at) WHERE published_at IS NOT NULL;

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION reputation.update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reputation.reviews
    FOR EACH ROW
    EXECUTE FUNCTION reputation.update_reviews_updated_at();

-- Add foreign key constraint to ensure tenant exists
-- Note: You'll need to adjust this based on your actual tenants table structure
-- ALTER TABLE reputation.reviews 
--     ADD CONSTRAINT fk_reviews_tenant_slug 
--     FOREIGN KEY (tenant_slug) REFERENCES tenants.business(slug) ON DELETE CASCADE;
