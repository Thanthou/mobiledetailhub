-- Website Schema Migration
-- Creates website schema and all its tables

-- Create schema
CREATE SCHEMA IF NOT EXISTS website;

-- Create content table
CREATE TABLE IF NOT EXISTS website.content (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL,
    header_logo_url VARCHAR(500),
    header_icon_url VARCHAR(500),
    hero_title VARCHAR(500),
    hero_subtitle TEXT,
    reviews_title VARCHAR(255),
    reviews_subtitle TEXT,
    faq_title VARCHAR(255),
    faq_subtitle TEXT,
    faq_items JSONB DEFAULT '[]'::jsonb,
    custom_sections JSONB DEFAULT '[]'::jsonb,
    reviews_avg_rating NUMERIC DEFAULT 0.00,
    reviews_total_count INTEGER DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    seo_og_image VARCHAR(500),
    seo_twitter_image VARCHAR(500),
    seo_canonical_path VARCHAR(500),
    seo_robots VARCHAR(50) DEFAULT 'index,follow',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_business_id ON website.content(business_id);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS website CASCADE;
