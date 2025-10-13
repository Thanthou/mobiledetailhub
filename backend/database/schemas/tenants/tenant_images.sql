-- Tenant Images Table - Gallery and media storage for tenant businesses

DROP TABLE IF EXISTS tenants.tenant_images CASCADE;

CREATE TABLE tenants.tenant_images (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Tenant Reference
    tenant_slug VARCHAR(255) NOT NULL,
    
    -- File Information
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Image Categorization
    image_category VARCHAR(50) DEFAULT 'gallery', -- gallery, hero, logo, before, after, etc.
    
    -- Image Status
    is_stock BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tenant_images_slug ON tenants.tenant_images(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_tenant_images_category ON tenants.tenant_images(image_category);
CREATE INDEX IF NOT EXISTS idx_tenant_images_active ON tenants.tenant_images(is_active);
CREATE INDEX IF NOT EXISTS idx_tenant_images_stock ON tenants.tenant_images(is_stock);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION tenants.update_tenant_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tenant_images_updated_at
    BEFORE UPDATE ON tenants.tenant_images
    FOR EACH ROW
    EXECUTE FUNCTION tenants.update_tenant_images_updated_at();

-- Add comments for documentation
COMMENT ON TABLE tenants.tenant_images IS 'Media storage for tenant business galleries and website images';
COMMENT ON COLUMN tenants.tenant_images.tenant_slug IS 'Business slug (URL identifier)';
COMMENT ON COLUMN tenants.tenant_images.image_category IS 'Image type: gallery, hero, logo, before, after, etc.';
COMMENT ON COLUMN tenants.tenant_images.is_stock IS 'Whether image is a stock/placeholder image';

