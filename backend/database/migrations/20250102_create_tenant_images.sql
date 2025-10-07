-- Create tenant_images table for storing tenant-specific images
CREATE TABLE IF NOT EXISTS tenants.tenant_images (
  id SERIAL PRIMARY KEY,
  tenant_slug VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  image_category VARCHAR(50) DEFAULT 'gallery', -- gallery, hero, services, etc.
  uploaded_at TIMESTAMP DEFAULT NOW(),
  is_stock BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Foreign key constraint
  CONSTRAINT fk_tenant_images_tenant 
    FOREIGN KEY (tenant_slug) 
    REFERENCES tenants.business(slug) 
    ON DELETE CASCADE,
    
  -- Unique constraint to prevent duplicate filenames per tenant
  CONSTRAINT uk_tenant_images_filename 
    UNIQUE (tenant_slug, filename)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tenant_images_slug ON tenants.tenant_images(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_tenant_images_category ON tenants.tenant_images(image_category);
CREATE INDEX IF NOT EXISTS idx_tenant_images_stock ON tenants.tenant_images(is_stock);

-- Add comment
COMMENT ON TABLE tenants.tenant_images IS 'Stores tenant-specific images and stock images';
COMMENT ON COLUMN tenants.tenant_images.tenant_slug IS 'Reference to tenants.business (slug)';
COMMENT ON COLUMN tenants.tenant_images.image_category IS 'Type of image: gallery, hero, services, etc.';
COMMENT ON COLUMN tenants.tenant_images.is_stock IS 'TRUE for shared stock images, FALSE for tenant-specific';
