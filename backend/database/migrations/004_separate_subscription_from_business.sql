-- Migration: Separate subscription data from business table
-- Date: 2025-10-13
-- Description: Remove subscription fields from tenants.business table.
--              All subscription data should live in tenants.subscriptions table.

BEGIN;

-- Step 1: Migrate existing subscription data to subscriptions table
-- (Only for businesses that have subscription data but no subscription record)
INSERT INTO tenants.subscriptions (
    business_id,
    plan_type,
    plan_price_cents,
    billing_cycle,
    status,
    is_trial,
    trial_ends_at,
    starts_at,
    created_at,
    updated_at
)
SELECT 
    id as business_id,
    selected_plan as plan_type,
    plan_price_cents,
    COALESCE(billing_cycle, 'monthly') as billing_cycle,
    COALESCE(subscription_status, 'trial') as status,
    CASE WHEN trial_ends_at IS NOT NULL THEN true ELSE false END as is_trial,
    trial_ends_at,
    COALESCE(subscription_started_at, created_at) as starts_at,
    created_at,
    updated_at
FROM tenants.business
WHERE selected_plan IS NOT NULL
  AND id NOT IN (
    SELECT DISTINCT business_id 
    FROM tenants.subscriptions 
    WHERE status = 'active' AND (ends_at IS NULL OR ends_at > NOW())
  );

-- Step 2: Remove subscription fields from business table
ALTER TABLE tenants.business 
  DROP COLUMN IF EXISTS selected_plan,
  DROP COLUMN IF EXISTS plan_price_cents,
  DROP COLUMN IF EXISTS billing_cycle,
  DROP COLUMN IF EXISTS subscription_status,
  DROP COLUMN IF EXISTS trial_ends_at,
  DROP COLUMN IF EXISTS subscription_started_at,
  DROP COLUMN IF EXISTS billing_address,
  DROP COLUMN IF EXISTS billing_city,
  DROP COLUMN IF EXISTS billing_state,
  DROP COLUMN IF EXISTS billing_zip,
  DROP COLUMN IF EXISTS billing_country;

-- Step 3: Create view for easy access to business + current subscription
CREATE OR REPLACE VIEW tenants.businesses_with_subscription AS
SELECT 
    b.*,
    s.id as subscription_id,
    s.plan_type,
    s.plan_price_cents,
    s.billing_cycle,
    s.status as subscription_status,
    s.stripe_subscription_id,
    s.stripe_customer_id,
    s.stripe_price_id,
    s.is_trial,
    s.trial_ends_at,
    s.next_billing_date,
    s.last_successful_payment_at,
    s.failed_payment_attempts,
    s.metadata as subscription_metadata
FROM tenants.business b
LEFT JOIN LATERAL (
    SELECT * FROM tenants.subscriptions
    WHERE business_id = b.id 
      AND status IN ('active', 'trial')
      AND (ends_at IS NULL OR ends_at > NOW())
    ORDER BY starts_at DESC
    LIMIT 1
) s ON true;

-- Step 4: Create helper function to check if business has active subscription
CREATE OR REPLACE FUNCTION tenants.has_active_subscription(p_business_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tenants.subscriptions
        WHERE business_id = p_business_id
          AND status IN ('active', 'trial')
          AND (ends_at IS NULL OR ends_at > NOW())
    );
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create helper function to check if business has specific plan or higher
CREATE OR REPLACE FUNCTION tenants.has_plan_access(
    p_business_id INTEGER, 
    p_required_plan VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
    current_plan VARCHAR(20);
    plan_hierarchy JSONB := '{"starter": 1, "pro": 2, "enterprise": 3}';
    required_level INTEGER;
    current_level INTEGER;
BEGIN
    -- Get current active plan
    SELECT plan_type INTO current_plan
    FROM tenants.subscriptions
    WHERE business_id = p_business_id
      AND status IN ('active', 'trial')
      AND (ends_at IS NULL OR ends_at > NOW())
    ORDER BY starts_at DESC
    LIMIT 1;
    
    -- If no active subscription, return false
    IF current_plan IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get hierarchy levels
    required_level := (plan_hierarchy->>p_required_plan)::INTEGER;
    current_level := (plan_hierarchy->>current_plan)::INTEGER;
    
    -- Check if current plan meets or exceeds required plan
    RETURN current_level >= required_level;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Add comments
COMMENT ON VIEW tenants.businesses_with_subscription IS 'Business data with current active subscription joined';
COMMENT ON FUNCTION tenants.has_active_subscription(INTEGER) IS 'Check if business has an active or trial subscription';
COMMENT ON FUNCTION tenants.has_plan_access(INTEGER, VARCHAR) IS 'Check if business has access to features requiring a specific plan level';

-- Step 7: Record migration
INSERT INTO system.schema_migrations (version, description)
VALUES ('004', 'Separate subscription data from business table')
ON CONFLICT (version) DO NOTHING;

COMMIT;

