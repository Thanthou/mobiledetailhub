-- Migration: Redesign website.content for multi-industry support
-- Date: 2025-10-13
-- Description: Simplify content table to only store editable content.
--              Remove industry-specific service descriptions (handled by templates).
--              Use JSONB for flexible, industry-agnostic structure.

BEGIN;

-- =====================================================
-- PART 1: Backup existing data (if any)
-- =====================================================

-- Create temporary backup table
CREATE TABLE IF NOT EXISTS website.content_backup AS 
SELECT * FROM website.content;

-- =====================================================
-- PART 2: Drop and recreate content table
-- =====================================================

DROP TABLE IF EXISTS website.content CASCADE;

CREATE TABLE website.content (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Tenant Reference (use business_id instead of slug)
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Header Branding (Tier 1 - Custom Logo/Icon)
    header_logo_url VARCHAR(500), -- URL or path to uploaded logo
    header_icon_url VARCHAR(500), -- URL or path to favicon/icon
    
    -- Hero Section (Tier 1 - Editable Text)
    hero_title VARCHAR(500),
    hero_subtitle TEXT,
    
    -- Reviews Section (Tier 1 - Editable Text)
    reviews_title VARCHAR(255),
    reviews_subtitle TEXT,
    
    -- FAQ Section (Tier 1 - Editable Text & Items)
    faq_title VARCHAR(255),
    faq_subtitle TEXT,
    faq_items JSONB DEFAULT '[]', -- Array of { question, answer } objects
    
    -- Future: Additional Images (Tier 2/3)
    -- hero_background_url, gallery images, etc. will be added later
    
    -- Metadata
    custom_sections JSONB DEFAULT '[]', -- For future extensibility
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- One content record per business
    CONSTRAINT uk_content_business_id UNIQUE(business_id)
);

-- =====================================================
-- PART 3: Create Indexes
-- =====================================================

CREATE INDEX idx_content_business_id ON website.content(business_id);
CREATE INDEX idx_content_updated_at ON website.content(updated_at);

-- =====================================================
-- PART 4: Create Auto-Update Trigger
-- =====================================================

CREATE OR REPLACE FUNCTION website.update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_content_updated_at
    BEFORE UPDATE ON website.content
    FOR EACH ROW
    EXECUTE FUNCTION website.update_content_updated_at();

-- =====================================================
-- PART 5: Add Helper Functions
-- =====================================================

-- Get content for a business
CREATE OR REPLACE FUNCTION website.get_content_by_slug(p_slug VARCHAR)
RETURNS website.content AS $$
DECLARE
    content_record website.content;
BEGIN
    SELECT c.* INTO content_record
    FROM website.content c
    JOIN tenants.business b ON c.business_id = b.id
    WHERE b.slug = p_slug;
    
    RETURN content_record;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION website.get_content_by_slug(VARCHAR) IS 
  'Get website content by business slug';

-- Get or create content for a business (with defaults)
CREATE OR REPLACE FUNCTION website.get_or_create_content(
    p_business_id INTEGER,
    p_industry VARCHAR DEFAULT NULL
)
RETURNS website.content AS $$
DECLARE
    content_record website.content;
    industry_name VARCHAR;
BEGIN
    -- Try to get existing content
    SELECT * INTO content_record
    FROM website.content
    WHERE business_id = p_business_id;
    
    -- If exists, return it
    IF FOUND THEN
        RETURN content_record;
    END IF;
    
    -- Get industry if not provided
    IF p_industry IS NULL THEN
        SELECT industry INTO industry_name
        FROM tenants.business
        WHERE id = p_business_id;
    ELSE
        industry_name := p_industry;
    END IF;
    
    -- Create with industry-specific defaults
    INSERT INTO website.content (
        business_id,
        hero_title,
        hero_subtitle,
        reviews_title,
        reviews_subtitle,
        faq_title,
        faq_subtitle,
        faq_items
    ) VALUES (
        p_business_id,
        -- Defaults will be provided by application layer based on industry
        NULL, NULL, NULL, NULL, NULL, NULL, '[]'::JSONB
    )
    RETURNING * INTO content_record;
    
    RETURN content_record;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION website.get_or_create_content(INTEGER, VARCHAR) IS 
  'Get existing content or create new record with defaults for a business';

-- Function: Get FAQs grouped by category
CREATE OR REPLACE FUNCTION website.get_faqs_by_category(p_business_id INTEGER)
RETURNS TABLE(
    category VARCHAR,
    items JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH faq_data AS (
        SELECT faq_items
        FROM website.content
        WHERE business_id = p_business_id
    ),
    expanded AS (
        SELECT jsonb_array_elements(faq_items) as item
        FROM faq_data
    )
    SELECT 
        (item->>'category')::VARCHAR as category,
        jsonb_agg(item ORDER BY item->>'question') as items
    FROM expanded
    GROUP BY item->>'category'
    ORDER BY category;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION website.get_faqs_by_category(INTEGER) IS 
  'Get FAQ items grouped by category for a business';

-- Function: Validate FAQ item structure
CREATE OR REPLACE FUNCTION website.validate_faq_item(p_item JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check required fields
    IF p_item IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Must have category, question, and answer
    IF NOT (p_item ? 'category' AND p_item ? 'question' AND p_item ? 'answer') THEN
        RETURN FALSE;
    END IF;
    
    -- Values must be non-empty strings
    IF (p_item->>'category') = '' OR 
       (p_item->>'question') = '' OR 
       (p_item->>'answer') = '' THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION website.validate_faq_item(JSONB) IS 
  'Validate FAQ item has required fields: category, question, answer';

-- =====================================================
-- PART 6: Migrate existing data (if any)
-- =====================================================

-- Migrate data from backup table (only if backup has data)
DO $$
DECLARE
    backup_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO backup_count FROM website.content_backup;
    
    IF backup_count > 0 THEN
        -- Insert migrated data
        INSERT INTO website.content (
            business_id,
            hero_title,
            hero_subtitle,
            reviews_title,
            reviews_subtitle,
            faq_title,
            faq_subtitle,
            faq_items,
            created_at,
            updated_at
        )
        SELECT 
            b.id as business_id,
            cb.hero_title,
            cb.hero_subtitle,
            cb.reviews_title,
            cb.reviews_subtitle,
            cb.faq_title,
            cb.faq_subtitle,
            COALESCE(cb.faq_content, '[]'::JSONB) as faq_items,
            cb.created_at,
            cb.updated_at
        FROM website.content_backup cb
        JOIN tenants.business b ON cb.tenant_slug = b.slug
        ON CONFLICT (business_id) DO NOTHING;
        
        RAISE NOTICE 'Migrated % content records', backup_count;
    END IF;
END $$;

-- Drop backup table
DROP TABLE IF EXISTS website.content_backup;

-- =====================================================
-- PART 7: Add Comments for Documentation
-- =====================================================

COMMENT ON TABLE website.content IS 
  'Editable website content for tenant businesses (tier 1: text + logo/icon, tier 2/3: additional images)';

COMMENT ON COLUMN website.content.business_id IS 
  'Foreign key to tenants.business - one content record per business';

COMMENT ON COLUMN website.content.header_logo_url IS 
  'Custom logo for header (tier 1 branding - NULL = use business name text)';

COMMENT ON COLUMN website.content.header_icon_url IS 
  'Custom favicon/icon for browser tab and mobile (tier 1 branding)';

COMMENT ON COLUMN website.content.hero_title IS 
  'Hero section headline (NULL = use industry default from template)';

COMMENT ON COLUMN website.content.hero_subtitle IS 
  'Hero section subheadline (NULL = use industry default from template)';

COMMENT ON COLUMN website.content.reviews_title IS 
  'Reviews section title (NULL = use default "What Our Customers Say")';

COMMENT ON COLUMN website.content.reviews_subtitle IS 
  'Reviews section subtitle (NULL = use industry default)';

COMMENT ON COLUMN website.content.faq_title IS 
  'FAQ section title (NULL = use default "Frequently Asked Questions")';

COMMENT ON COLUMN website.content.faq_subtitle IS 
  'FAQ section subtitle (NULL = use industry default intro)';

COMMENT ON COLUMN website.content.faq_items IS 
  'FAQ items as JSON array: [{ "category": "Pricing", "question": "...", "answer": "..." }]';

COMMENT ON COLUMN website.content.custom_sections IS 
  'Custom content sections for future extensibility';

-- =====================================================
-- PART 8: Record Migration
-- =====================================================

INSERT INTO system.schema_migrations (version, description)
VALUES ('007', 'Redesign website.content for multi-industry support')
ON CONFLICT (version) DO NOTHING;

COMMIT;

