-- Tenant Applications Table - Tracks applications before they become tenants
-- Stores draft applications, supports auto-save, and pre-approval data collection

DROP TABLE IF EXISTS tenants.tenant_applications CASCADE;

CREATE TABLE tenants.tenant_applications (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    personal_phone VARCHAR(20) NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    
    -- Business Information
    business_name VARCHAR(255) NOT NULL,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    industry VARCHAR(50),
    
    -- Business Address
    business_address VARCHAR(500),
    business_city VARCHAR(100),
    business_state VARCHAR(50),
    business_zip VARCHAR(20),
    
    -- Plan Selection
    selected_plan VARCHAR(20), -- 'starter', 'pro', 'enterprise'
    plan_price_cents INTEGER, -- Price in cents (e.g., 1500 for $15)
    
    -- Billing Address
    billing_address VARCHAR(500),
    billing_city VARCHAR(100),
    billing_state VARCHAR(50),
    billing_zip VARCHAR(20),
    use_same_address BOOLEAN DEFAULT true,
    
    -- Application Progress
    current_step INTEGER DEFAULT 0, -- 0=plan, 1=personal, 2=business, 3=payment
    status VARCHAR(20) DEFAULT 'draft', -- draft, submitted, approved, rejected, expired
    
    -- Payment Intent (Stripe)
    stripe_customer_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    
    -- Draft Data (Full form snapshot)
    draft_data JSONB, -- Stores complete form state for auto-save
    
    -- Metadata
    source VARCHAR(100), -- 'preview', 'direct', 'referral', etc.
    referrer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    
    -- Timestamps
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'), -- Auto-expire drafts after 30 days
    last_saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_email ON tenants.tenant_applications(personal_email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON tenants.tenant_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON tenants.tenant_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_applications_expires_at ON tenants.tenant_applications(expires_at);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON tenants.tenant_applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_applications_stripe_customer ON tenants.tenant_applications(stripe_customer_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION tenants.update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.last_saved_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_applications_updated_at
    BEFORE UPDATE ON tenants.tenant_applications
    FOR EACH ROW
    EXECUTE FUNCTION tenants.update_applications_updated_at();

-- Add comments for documentation
COMMENT ON TABLE tenants.tenant_applications IS 'Tenant onboarding applications - tracks submissions before they become active tenants';
COMMENT ON COLUMN tenants.tenant_applications.status IS 'Application lifecycle: draft, submitted, approved, rejected, expired';
COMMENT ON COLUMN tenants.tenant_applications.current_step IS 'Current onboarding step: 0=plan, 1=personal, 2=business, 3=payment';
COMMENT ON COLUMN tenants.tenant_applications.draft_data IS 'Full form state snapshot for auto-save/restore functionality';
COMMENT ON COLUMN tenants.tenant_applications.expires_at IS 'Draft applications expire after 30 days and can be purged';
COMMENT ON COLUMN tenants.tenant_applications.use_same_address IS 'Whether billing address matches business address';

