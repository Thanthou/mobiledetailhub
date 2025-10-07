-- Create website_content table for storing tenant website content
CREATE TABLE IF NOT EXISTS tenants.website_content (
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
COMMENT ON COLUMN tenants.website_content.services_items IS 'Array of service items with name, price, description';
