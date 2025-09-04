-- Reviews table for both affiliate and MDH site reviews
DROP TABLE IF EXISTS reputation.reviews CASCADE;

CREATE TABLE reputation.reviews (
    id SERIAL PRIMARY KEY,
    
    -- Review target (either affiliate or MDH site)
    review_type VARCHAR(20) NOT NULL CHECK (review_type IN ('affiliate', 'mdh')),
    
    -- For affiliate reviews - link to business
    affiliate_id INTEGER NULL,
    
    -- For affiliate reviews - business slug for easy URL queries
    business_slug VARCHAR(255) NULL,
    
    -- Review content
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NULL,
    content TEXT NULL,
    
    -- Reviewer information
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NULL,
    reviewer_phone VARCHAR(20) NULL,
    reviewer_avatar_url VARCHAR(500) NULL, -- User profile picture/icon
    
    -- Review metadata
    review_source VARCHAR(50) NOT NULL DEFAULT 'website' CHECK (review_source IN ('website', 'google', 'yelp', 'facebook', 'imported')),
    external_review_id VARCHAR(255) NULL, -- For imported reviews
    
    -- Review status and moderation
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
    moderation_notes TEXT NULL,
    moderated_by INTEGER NULL, -- References auth.users.id
    moderated_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Review verification
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verification_method VARCHAR(50) NULL, -- 'email', 'phone', 'booking', 'external'
    
    -- Service-specific data (for affiliate reviews)
    service_category VARCHAR(100) NULL, -- 'auto', 'boat', 'rv', 'ceramic', 'ppf', etc.
    service_date DATE NULL,
    booking_id INTEGER NULL, -- If review is linked to a specific booking
    
    -- Review metadata
    helpful_votes INTEGER NOT NULL DEFAULT 0,
    total_votes INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_review_type ON reputation.reviews(review_type);
CREATE INDEX IF NOT EXISTS idx_reviews_affiliate_id ON reputation.reviews(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_slug ON reputation.reviews(business_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reputation.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reputation.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_review_source ON reputation.reviews(review_source);
CREATE INDEX IF NOT EXISTS idx_reviews_is_verified ON reputation.reviews(is_verified);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON reputation.reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reputation.reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_published_at ON reputation.reviews(published_at);
CREATE INDEX IF NOT EXISTS idx_reviews_service_category ON reputation.reviews(service_category);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reviews_affiliate_status ON reputation.reviews(affiliate_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_type_status ON reputation.reviews(review_type, status);
CREATE INDEX IF NOT EXISTS idx_reviews_affiliate_rating ON reputation.reviews(affiliate_id, rating);

-- Create trigger to automatically update updated_at timestamp
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

-- Add foreign key constraints
ALTER TABLE reputation.reviews 
    ADD CONSTRAINT fk_reviews_affiliate_id 
    FOREIGN KEY (affiliate_id) REFERENCES affiliates.business(id) ON DELETE CASCADE;

ALTER TABLE reputation.reviews 
    ADD CONSTRAINT fk_reviews_moderated_by 
    FOREIGN KEY (moderated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add constraint to ensure business_slug matches affiliate when affiliate_id is set
ALTER TABLE reputation.reviews 
    ADD CONSTRAINT fk_reviews_business_slug 
    FOREIGN KEY (business_slug) REFERENCES affiliates.business(slug) ON DELETE CASCADE;

-- Add constraint to ensure affiliate_id and business_slug are consistent
ALTER TABLE reputation.reviews 
    ADD CONSTRAINT chk_reviews_affiliate_consistency 
    CHECK (
        (affiliate_id IS NULL AND business_slug IS NULL) OR 
        (affiliate_id IS NOT NULL AND business_slug IS NOT NULL)
    );

-- Add constraint to ensure affiliate reviews have required fields
ALTER TABLE reputation.reviews 
    ADD CONSTRAINT chk_reviews_affiliate_required 
    CHECK (
        (review_type = 'affiliate' AND affiliate_id IS NOT NULL AND business_slug IS NOT NULL) OR
        (review_type = 'mdh' AND affiliate_id IS NULL AND business_slug IS NULL)
    );
