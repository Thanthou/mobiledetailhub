-- Tenants Schema Migration
-- Migration: 2025-10-24_0003_tenants
-- Purpose: Create tenants tables (schema created in 0001_create_schemas.sql)

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
    example_field TEXT,
    custom_domain VARCHAR(255) UNIQUE,
    domain_verified BOOLEAN DEFAULT FALSE,
    ssl_enabled BOOLEAN DEFAULT FALSE,
    domain_added_at TIMESTAMP DEFAULT NOW()
);

-- Add column comments for custom domain fields
COMMENT ON COLUMN tenants.business.custom_domain IS 'Custom domain name for tenant (e.g., mybusiness.com)';
COMMENT ON COLUMN tenants.business.domain_verified IS 'Whether the custom domain has been verified via DNS';
COMMENT ON COLUMN tenants.business.ssl_enabled IS 'Whether SSL certificate is active for custom domain';
COMMENT ON COLUMN tenants.business.domain_added_at IS 'When the custom domain was first added';

-- Create services table
CREATE TABLE IF NOT EXISTS tenants.services (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
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
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
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
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_business_email ON tenants.business(business_email);
CREATE INDEX IF NOT EXISTS idx_business_custom_domain ON tenants.business(custom_domain);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON tenants.services(business_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_business_id ON tenants.service_areas(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON tenants.subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON tenants.subscriptions(stripe_subscription_id);

-- Add comments
COMMENT ON INDEX tenants.idx_business_email IS 'Index for fast email lookups during authentication and user searches';

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS tenants CASCADE;

