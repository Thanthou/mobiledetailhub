-- Tenants Business Table - Core tenant/business information
-- This is the main table for businesses using ThatSmartSite

DROP TABLE IF EXISTS tenants.business CASCADE;

CREATE TABLE tenants.business (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Core Business Info
    industry VARCHAR(50) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    owner VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    
    -- User Association
    user_id INTEGER REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Application & Status
    application_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, active, suspended, cancelled
    business_start_date DATE,
    
    -- Contact Information
    business_phone VARCHAR(20),
    personal_phone VARCHAR(20),
    business_email VARCHAR(255),
    personal_email VARCHAR(255),
    
    -- Phone Services
    twilio_phone VARCHAR(20),
    sms_phone VARCHAR(20),
    
    -- Online Presence
    website TEXT,
    gbp_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    tiktok_url TEXT,
    
    -- Subscription & Billing (NEW)
    selected_plan VARCHAR(20), -- 'starter', 'pro', 'enterprise'
    plan_price_cents INTEGER, -- Price in cents
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
    subscription_status VARCHAR(20) DEFAULT 'trial', -- trial, active, past_due, cancelled, paused
    trial_ends_at TIMESTAMPTZ,
    subscription_started_at TIMESTAMPTZ,
    
    -- Billing Address (NEW)
    billing_address VARCHAR(500),
    billing_city VARCHAR(100),
    billing_state VARCHAR(50),
    billing_zip VARCHAR(20),
    billing_country VARCHAR(50) DEFAULT 'US',
    
    -- Service Areas
    service_areas JSONB,
    
    -- Metadata
    source VARCHAR(255),
    notes TEXT,
    
    -- Timestamps
    application_date TIMESTAMPTZ,
    approved_date TIMESTAMPTZ,
    last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_slug ON tenants.business(slug);
CREATE INDEX IF NOT EXISTS idx_business_user_id ON tenants.business(user_id);
CREATE INDEX IF NOT EXISTS idx_business_industry ON tenants.business(industry);
CREATE INDEX IF NOT EXISTS idx_business_status ON tenants.business(application_status);
CREATE INDEX IF NOT EXISTS idx_business_subscription_status ON tenants.business(subscription_status);
CREATE INDEX IF NOT EXISTS idx_business_created_at ON tenants.business(created_at);
CREATE INDEX IF NOT EXISTS idx_business_email ON tenants.business(business_email);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION tenants.update_business_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_business_updated_at
    BEFORE UPDATE ON tenants.business
    FOR EACH ROW
    EXECUTE FUNCTION tenants.update_business_updated_at();

-- Add comments for documentation
COMMENT ON TABLE tenants.business IS 'Core tenant/business information for ThatSmartSite platform';
COMMENT ON COLUMN tenants.business.slug IS 'URL-friendly unique identifier (e.g., jps-mobile-detailing)';
COMMENT ON COLUMN tenants.business.application_status IS 'Lifecycle status: pending, approved, active, suspended, cancelled';
COMMENT ON COLUMN tenants.business.selected_plan IS 'Subscription plan tier: starter, pro, enterprise';
COMMENT ON COLUMN tenants.business.subscription_status IS 'Billing status: trial, active, past_due, cancelled, paused';
COMMENT ON COLUMN tenants.business.service_areas IS 'JSON array of service location data';

