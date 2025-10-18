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

-- Create services table
CREATE TABLE IF NOT EXISTS tenants.services (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id),
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_category VARCHAR(100),
    service_type VARCHAR(100),
    vehicle_types JSONB DEFAULT '["auto", "boat", "rv", "truck"]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create service_tiers table
CREATE TABLE IF NOT EXISTS tenants.service_tiers (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES tenants.services(id),
    tier_name VARCHAR(255) NOT NULL,
    price_cents INTEGER DEFAULT 0,
    included_services JSONB DEFAULT '[]'::jsonb,
    duration_minutes INTEGER DEFAULT 60,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS tenants.subscriptions (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id),
    plan_type VARCHAR(20) NOT NULL,
    plan_price_cents INTEGER NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active',
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    is_trial BOOLEAN DEFAULT FALSE,
    trial_ends_at TIMESTAMPTZ,
    last_billing_attempt_at TIMESTAMPTZ,
    last_successful_payment_at TIMESTAMPTZ,
    failed_payment_attempts INTEGER DEFAULT 0,
    next_billing_date TIMESTAMPTZ,
    cancel_reason VARCHAR(255),
    cancel_reason_details TEXT,
    cancelled_by VARCHAR(50),
    previous_plan VARCHAR(20),
    plan_change_reason VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create tenant_applications table
CREATE TABLE IF NOT EXISTS tenants.tenant_applications (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    personal_phone VARCHAR(20) NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    industry VARCHAR(50),
    business_address VARCHAR(500),
    business_city VARCHAR(100),
    business_state VARCHAR(50),
    business_zip VARCHAR(20),
    selected_plan VARCHAR(20),
    plan_price_cents INTEGER,
    billing_address VARCHAR(500),
    billing_city VARCHAR(100),
    billing_state VARCHAR(50),
    billing_zip VARCHAR(20),
    use_same_address BOOLEAN DEFAULT TRUE,
    current_step INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft',
    stripe_customer_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    draft_data JSONB,
    source VARCHAR(100),
    referrer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + '30 days'::interval),
    last_saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create tenant_images table
CREATE TABLE IF NOT EXISTS tenants.tenant_images (
    id SERIAL PRIMARY KEY,
    tenant_slug VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    image_category VARCHAR(50) DEFAULT 'gallery',
    uploaded_at TIMESTAMP DEFAULT NOW(),
    is_stock BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_slug ON tenants.business(slug);
CREATE INDEX IF NOT EXISTS idx_business_industry ON tenants.business(industry);
CREATE INDEX IF NOT EXISTS idx_business_user_id ON tenants.business(user_id);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON tenants.services(business_id);
CREATE INDEX IF NOT EXISTS idx_service_tiers_service_id ON tenants.service_tiers(service_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON tenants.subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON tenants.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_tenant_applications_email ON tenants.tenant_applications(personal_email);
CREATE INDEX IF NOT EXISTS idx_tenant_applications_status ON tenants.tenant_applications(status);
CREATE INDEX IF NOT EXISTS idx_tenant_images_tenant_slug ON tenants.tenant_images(tenant_slug);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS tenants CASCADE;
