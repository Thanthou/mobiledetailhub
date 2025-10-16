-- SEO configuration table for tenant-specific SEO settings
-- This table anchors Cursor's understanding of where SEO data comes from

CREATE TABLE IF NOT EXISTS website.seo_config (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Core SEO metadata
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[] DEFAULT '{}',
    
    -- Open Graph and Twitter Card
    og_image TEXT,
    twitter_image TEXT,
    
    -- Canonical and robots
    canonical_path TEXT DEFAULT '/',
    robots_directive VARCHAR(50) DEFAULT 'index,follow',
    
    -- JSON-LD structured data overrides
    jsonld_overrides JSONB DEFAULT '{}'::jsonb,
    
    -- Analytics configuration
    analytics_config JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT seo_config_business_id_unique UNIQUE (business_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_config_business_id ON website.seo_config(business_id);
CREATE INDEX IF NOT EXISTS idx_seo_config_updated_at ON website.seo_config(updated_at);

-- Comments for documentation
COMMENT ON TABLE website.seo_config IS 'Tenant-specific SEO configuration and metadata';
COMMENT ON COLUMN website.seo_config.meta_title IS 'Custom page title for SEO (overrides industry defaults)';
COMMENT ON COLUMN website.seo_config.meta_description IS 'Custom meta description for SEO';
COMMENT ON COLUMN website.seo_config.keywords IS 'Array of SEO keywords';
COMMENT ON COLUMN website.seo_config.jsonld_overrides IS 'JSON-LD structured data customizations';
COMMENT ON COLUMN website.seo_config.analytics_config IS 'Analytics provider configuration (GA4, GTM, etc.)';

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_seo_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seo_config_updated_at 
    BEFORE UPDATE ON website.seo_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_seo_config_updated_at();
