-- Migration: Add SEO fields to website.content table
-- Date: 2025-10-15
-- Description: Adds page-level SEO metadata fields for tenant customization

-- Add SEO columns to website.content
ALTER TABLE website.content
  ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
  ADD COLUMN IF NOT EXISTS seo_og_image VARCHAR(500),
  ADD COLUMN IF NOT EXISTS seo_twitter_image VARCHAR(500),
  ADD COLUMN IF NOT EXISTS seo_canonical_path VARCHAR(500),
  ADD COLUMN IF NOT EXISTS seo_robots VARCHAR(50) DEFAULT 'index,follow';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_content_seo_robots ON website.content(seo_robots);

-- Add comment to document the table structure
COMMENT ON COLUMN website.content.seo_title IS 'Page title for search engines and browser tabs';
COMMENT ON COLUMN website.content.seo_description IS 'Meta description for search results';
COMMENT ON COLUMN website.content.seo_keywords IS 'Comma-separated keywords for SEO';
COMMENT ON COLUMN website.content.seo_og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN website.content.seo_twitter_image IS 'Twitter card image URL';
COMMENT ON COLUMN website.content.seo_canonical_path IS 'Canonical URL path for SEO';
COMMENT ON COLUMN website.content.seo_robots IS 'Robots meta tag directive (e.g., index,follow or noindex,nofollow)';

-- Record migration
INSERT INTO system.schema_migrations (version, description)
VALUES ('v8.0', 'Added SEO fields to website.content table')
ON CONFLICT (version) DO NOTHING;

