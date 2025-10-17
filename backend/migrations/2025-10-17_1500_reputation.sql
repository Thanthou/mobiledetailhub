-- Reputation Schema Migration
-- Creates reputation schema and all its tables

-- Create schema
CREATE SCHEMA IF NOT EXISTS reputation;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reputation.reviews (
    id SERIAL PRIMARY KEY,
    tenant_slug VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    reviewer_url VARCHAR(500),
    vehicle_type VARCHAR(50),
    paint_correction BOOLEAN DEFAULT FALSE,
    ceramic_coating BOOLEAN DEFAULT FALSE,
    paint_protection_film BOOLEAN DEFAULT FALSE,
    source VARCHAR(50) DEFAULT 'website',
    avatar_filename VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ
);

-- Create review_replies table
CREATE TABLE IF NOT EXISTS reputation.review_replies (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES reputation.reviews(id),
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(50) DEFAULT 'business_owner',
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ
);

-- Create review_votes table
CREATE TABLE IF NOT EXISTS reputation.review_votes (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES reputation.reviews(id),
    voter_ip INET,
    voter_user_id INTEGER,
    vote_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_slug ON reputation.reviews(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reputation.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_published_at ON reputation.reviews(published_at);
CREATE INDEX IF NOT EXISTS idx_review_replies_review_id ON reputation.review_replies(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON reputation.review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_voter_ip ON reputation.review_votes(voter_ip);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS reputation CASCADE;
