-- Reputation Schema Migration
-- Creates reputation tables (schema already exists from 1400_create_schemas.sql)

-- Drop existing reputation tables if they exist (to ensure clean migration)
DROP TABLE IF EXISTS reputation.review_votes CASCADE;
DROP TABLE IF EXISTS reputation.review_media CASCADE;
DROP TABLE IF EXISTS reputation.reviews CASCADE;

-- Create reviews table
CREATE TABLE reputation.reviews (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
    customer_id INTEGER,
    booking_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'pending',
    response_text TEXT,
    response_date TIMESTAMPTZ,
    response_by INTEGER,
    source VARCHAR(50) DEFAULT 'internal',
    external_id VARCHAR(255),
    external_url TEXT,
    helpful_votes INTEGER DEFAULT 0,
    not_helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ
);

-- Create review_media table
CREATE TABLE reputation.review_media (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES reputation.reviews(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create review_votes table
CREATE TABLE reputation.review_votes (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES reputation.reviews(id) ON DELETE CASCADE,
    voter_ip INET NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(review_id, voter_ip)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_id ON reputation.reviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reputation.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reputation.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reputation.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reputation.reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_review_media_review_id ON reputation.review_media(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON reputation.review_votes(review_id);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS reputation CASCADE;
