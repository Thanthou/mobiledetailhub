-- Tenant Subscriptions Table - Tracks subscription history and billing over time
-- Supports plan changes, upgrades, downgrades, and billing history

DROP TABLE IF EXISTS tenants.subscriptions CASCADE;

CREATE TABLE tenants.subscriptions (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Tenant Reference
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Subscription Details
    plan_type VARCHAR(20) NOT NULL, -- 'starter', 'pro', 'enterprise'
    plan_price_cents INTEGER NOT NULL, -- Price at time of subscription
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
    
    -- Subscription Period
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ, -- NULL for active subscriptions
    cancelled_at TIMESTAMPTZ,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- trial, active, past_due, cancelled, paused, expired
    
    -- Payment Provider
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    -- Trial Information
    is_trial BOOLEAN DEFAULT false,
    trial_ends_at TIMESTAMPTZ,
    
    -- Billing Attempts
    last_billing_attempt_at TIMESTAMPTZ,
    last_successful_payment_at TIMESTAMPTZ,
    failed_payment_attempts INTEGER DEFAULT 0,
    next_billing_date TIMESTAMPTZ,
    
    -- Cancellation Info
    cancel_reason VARCHAR(255),
    cancel_reason_details TEXT,
    cancelled_by VARCHAR(50), -- 'customer', 'admin', 'system', 'payment_failure'
    
    -- Plan Change History
    previous_plan VARCHAR(20),
    plan_change_reason VARCHAR(255),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON tenants.subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON tenants.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON tenants.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON tenants.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON tenants.subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_starts_at ON tenants.subscriptions(starts_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_ends_at ON tenants.subscriptions(ends_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON tenants.subscriptions(business_id, status) WHERE status = 'active';

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION tenants.update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_subscriptions_updated_at
    BEFORE UPDATE ON tenants.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION tenants.update_subscriptions_updated_at();

-- Create function to get active subscription for a business
CREATE OR REPLACE FUNCTION tenants.get_active_subscription(p_business_id INTEGER)
RETURNS tenants.subscriptions AS $$
DECLARE
    active_sub tenants.subscriptions;
BEGIN
    SELECT * INTO active_sub
    FROM tenants.subscriptions
    WHERE business_id = p_business_id
      AND status = 'active'
      AND (ends_at IS NULL OR ends_at > CURRENT_TIMESTAMP)
    ORDER BY starts_at DESC
    LIMIT 1;
    
    RETURN active_sub;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate MRR (Monthly Recurring Revenue)
CREATE OR REPLACE FUNCTION tenants.calculate_mrr()
RETURNS TABLE(
    plan_type VARCHAR(20),
    subscriber_count BIGINT,
    monthly_revenue_cents BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.plan_type,
        COUNT(*) as subscriber_count,
        SUM(
            CASE 
                WHEN s.billing_cycle = 'yearly' THEN s.plan_price_cents / 12
                ELSE s.plan_price_cents
            END
        ) as monthly_revenue_cents
    FROM tenants.subscriptions s
    WHERE s.status = 'active'
      AND (s.ends_at IS NULL OR s.ends_at > CURRENT_TIMESTAMP)
    GROUP BY s.plan_type
    ORDER BY s.plan_type;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE tenants.subscriptions IS 'Subscription history and billing tracking for tenants';
COMMENT ON COLUMN tenants.subscriptions.status IS 'Subscription state: trial, active, past_due, cancelled, paused, expired';
COMMENT ON COLUMN tenants.subscriptions.billing_cycle IS 'Billing frequency: monthly, yearly';
COMMENT ON COLUMN tenants.subscriptions.ends_at IS 'NULL for active subscriptions, populated when cancelled/expired';
COMMENT ON COLUMN tenants.subscriptions.cancelled_by IS 'Who initiated cancellation: customer, admin, system, payment_failure';
COMMENT ON COLUMN tenants.subscriptions.metadata IS 'Additional subscription metadata as JSON';

COMMENT ON FUNCTION tenants.get_active_subscription(INTEGER) IS 'Returns the currently active subscription for a business';
COMMENT ON FUNCTION tenants.calculate_mrr() IS 'Calculates Monthly Recurring Revenue by plan type';

