-- Drop and recreate website_content table with updated schema
-- This removes image columns and focuses on text content only

-- Drop existing table and all its dependencies
DROP TABLE IF EXISTS tenants.website_content CASCADE;

-- Recreate website_content table with clean schema
CREATE TABLE tenants.website_content (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  reviews_title VARCHAR(255),
  reviews_description TEXT,
  reviews_avg_rating FLOAT,
  reviews_total_ratings INTEGER,
  faq_title VARCHAR(255),
  faq_description TEXT,
  gallery_title VARCHAR(255),
  gallery_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Foreign key constraint
  CONSTRAINT fk_website_content_tenant
    FOREIGN KEY (tenant_id)
    REFERENCES tenants.business(id)
    ON DELETE CASCADE,

  -- Unique constraint to ensure one content record per tenant
  CONSTRAINT uk_website_content_tenant
    UNIQUE (tenant_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_website_content_tenant_id ON tenants.website_content(tenant_id);

-- Add comments
COMMENT ON TABLE tenants.website_content IS 'Stores website text content configuration for each tenant (images handled separately)';
COMMENT ON COLUMN tenants.website_content.tenant_id IS 'Reference to tenants.business (id)';
COMMENT ON COLUMN tenants.website_content.hero_title IS 'Main hero section title';
COMMENT ON COLUMN tenants.website_content.hero_subtitle IS 'Hero section subtitle/description';
COMMENT ON COLUMN tenants.website_content.reviews_title IS 'Reviews section title';
COMMENT ON COLUMN tenants.website_content.reviews_description IS 'Reviews section description';
COMMENT ON COLUMN tenants.website_content.reviews_avg_rating IS 'Average rating for reviews';
COMMENT ON COLUMN tenants.website_content.reviews_total_ratings IS 'Total number of reviews';
COMMENT ON COLUMN tenants.website_content.faq_title IS 'FAQ section title';
COMMENT ON COLUMN tenants.website_content.faq_description IS 'FAQ section description';
COMMENT ON COLUMN tenants.website_content.gallery_title IS 'Gallery section title';
COMMENT ON COLUMN tenants.website_content.gallery_description IS 'Gallery section description';
