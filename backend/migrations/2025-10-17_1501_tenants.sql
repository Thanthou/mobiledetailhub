-- Tenants Schema Migration
-- Creates tenants tables (schema already exists from 1400_create_schemas.sql)

-- Create business table
CREATE TABLE IF NOT EXISTS tenants.business (
    id SERIAL PRIMARY KEY,
    industry VARCHAR(50) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    owner VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    user_id INTEGER,
    application_status VARCHAR(50) DEFAULT 'pending',
    business_start_date DATE,
    business_phone VARCHAR(20),
    personal_phone VARCHAR(20),
    business_email VARCHAR(255),
    personal_email VARCHAR(255),
    twilio_phone VARCHAR(20),
    sms_phone VARCHAR(20),
    gbp_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    tiktok_url TEXT,
    facebook_enabled BOOLEAN DEFAULT true,
    instagram_enabled BOOLEAN DEFAULT true,
    tiktok_enabled BOOLEAN DEFAULT true,
    youtube_enabled BOOLEAN DEFAULT true,
    source VARCHAR(255),
    notes TEXT,
    service_areas JSONB,
    application_date TIMESTAMPTZ,
    approved_date TIMESTAMPTZ,
    last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    website TEXT,
    example_field TEXT
);

-- Add custom domain columns if they don't exist
DO $$ 
BEGIN
    -- Add custom_domain column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'tenants' 
                   AND table_name = 'business' 
                   AND column_name = 'custom_domain') THEN
        ALTER TABLE tenants.business ADD COLUMN custom_domain VARCHAR(255) UNIQUE;
    END IF;
    
    -- Add domain_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'tenants' 
                   AND table_name = 'business' 
                   AND column_name = 'domain_verified') THEN
        ALTER TABLE tenants.business ADD COLUMN domain_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add ssl_enabled column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'tenants' 
                   AND table_name = 'business' 
                   AND column_name = 'ssl_enabled') THEN
        ALTER TABLE tenants.business ADD COLUMN ssl_enabled BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add domain_added_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'tenants' 
                   AND table_name = 'business' 
                   AND column_name = 'domain_added_at') THEN
        ALTER TABLE tenants.business ADD COLUMN domain_added_at TIMESTAMP DEFAULT NOW();
    END IF;
END $$;

-- Create services table
CREATE TABLE IF NOT EXISTS tenants.services (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create service_areas table
CREATE TABLE IF NOT EXISTS tenants.service_areas (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    radius_miles INTEGER DEFAULT 25,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS tenants.subscriptions (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    plan_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_slug ON tenants.business(slug);
CREATE INDEX IF NOT EXISTS idx_business_user_id ON tenants.business(user_id);
CREATE INDEX IF NOT EXISTS idx_business_custom_domain ON tenants.business(custom_domain);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON tenants.services(business_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_business_id ON tenants.service_areas(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON tenants.subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON tenants.subscriptions(stripe_subscription_id);

-- Add column comments for custom domain fields
COMMENT ON COLUMN tenants.business.custom_domain IS 'Custom domain name for tenant (e.g., mybusiness.com)';
COMMENT ON COLUMN tenants.business.domain_verified IS 'Whether the custom domain has been verified via DNS';
COMMENT ON COLUMN tenants.business.ssl_enabled IS 'Whether SSL certificate is active for custom domain';
COMMENT ON COLUMN tenants.business.domain_added_at IS 'When the custom domain was first added';

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS tenants CASCADE;
