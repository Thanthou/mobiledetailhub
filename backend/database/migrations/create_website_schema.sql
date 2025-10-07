-- Create website schema and content table
-- This migration creates the new website schema and content table

-- Create the website schema
CREATE SCHEMA IF NOT EXISTS website;

-- Create the content table with basic structure
CREATE TABLE IF NOT EXISTS website.content (
    id SERIAL PRIMARY KEY,
    tenant_slug VARCHAR(255) NOT NULL,
    
    -- Hero section content
    hero_title VARCHAR(255),
    hero_subtitle TEXT,
    
    -- Services section content
    services_title VARCHAR(255),
    services_subtitle TEXT,
    services_auto_description TEXT,
    services_marine_description TEXT,
    services_rv_description TEXT,
    services_ceramic_description TEXT,
    services_correction_description TEXT,
    services_ppf_description TEXT,
    
    -- Reviews section content
    reviews_title VARCHAR(255),
    reviews_subtitle TEXT,
    reviews_avg_rating DECIMAL(3,2),
    reviews_total_count INTEGER DEFAULT 0,
    
    -- FAQ section content
    faq_title VARCHAR(255),
    faq_subtitle TEXT,
    faq_content JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint to ensure one content record per tenant
    CONSTRAINT uk_website_content_tenant_slug
        UNIQUE (tenant_slug)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_content_tenant_slug ON website.content(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_website_content_updated_at ON website.content(updated_at);

-- Add comments
COMMENT ON SCHEMA website IS 'Website content management schema';
COMMENT ON TABLE website.content IS 'Stores website content and pages';
COMMENT ON COLUMN website.content.tenant_slug IS 'Tenant/business slug this content belongs to';
COMMENT ON COLUMN website.content.hero_title IS 'Main hero section title';
COMMENT ON COLUMN website.content.hero_subtitle IS 'Hero section subtitle/description';
COMMENT ON COLUMN website.content.services_title IS 'Services section title';
COMMENT ON COLUMN website.content.services_subtitle IS 'Services section subtitle/description';
COMMENT ON COLUMN website.content.services_auto_description IS 'Auto detailing service description';
COMMENT ON COLUMN website.content.services_marine_description IS 'Marine detailing service description';
COMMENT ON COLUMN website.content.services_rv_description IS 'RV detailing service description';
COMMENT ON COLUMN website.content.services_ceramic_description IS 'Ceramic coating service description';
COMMENT ON COLUMN website.content.services_correction_description IS 'Paint correction service description';
COMMENT ON COLUMN website.content.services_ppf_description IS 'PPF service description';
COMMENT ON COLUMN website.content.reviews_title IS 'Reviews section title';
COMMENT ON COLUMN website.content.reviews_subtitle IS 'Reviews section subtitle/description';
COMMENT ON COLUMN website.content.reviews_avg_rating IS 'Average rating (0.00-5.00)';
COMMENT ON COLUMN website.content.reviews_total_count IS 'Total number of reviews';
COMMENT ON COLUMN website.content.faq_title IS 'FAQ section title';
COMMENT ON COLUMN website.content.faq_subtitle IS 'FAQ section subtitle/description';
COMMENT ON COLUMN website.content.faq_content IS 'FAQ questions and answers as JSON array';

