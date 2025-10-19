-- Website Schema Migration
-- Creates website tables (schema already exists from 1400_create_schemas.sql)

-- Drop existing website tables if they exist (to ensure clean migration)
DROP TABLE IF EXISTS website.media CASCADE;
DROP TABLE IF EXISTS website.pages CASCADE;
DROP TABLE IF EXISTS website.content CASCADE;

-- Create website_content table
CREATE TABLE website.content (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
    content_type VARCHAR(50) NOT NULL,
    content_key VARCHAR(255) NOT NULL,
    content_value TEXT,
    content_data JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, content_type, content_key)
);

-- Create website_pages table
CREATE TABLE website.pages (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
    page_slug VARCHAR(255) NOT NULL,
    page_title VARCHAR(255) NOT NULL,
    page_content TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    is_published BOOLEAN DEFAULT TRUE,
    is_homepage BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, page_slug)
);

-- Create website_media table
CREATE TABLE website.media (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
    media_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    alt_text TEXT,
    caption TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_tenant_id ON website.content(tenant_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON website.content(content_type);
CREATE INDEX IF NOT EXISTS idx_pages_tenant_id ON website.pages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON website.pages(page_slug);
CREATE INDEX IF NOT EXISTS idx_media_tenant_id ON website.media(tenant_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON website.media(media_type);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS website CASCADE;
