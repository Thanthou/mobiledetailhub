-- Migration: Add subscription fields to business table
-- Version: 003
-- Description: Adds subscription and billing fields to existing tenants.business table
-- Date: 2025-10-10
-- Author: ThatSmartSite Team

-- ====================
-- UP MIGRATION
-- ====================

-- Add subscription fields to business table
ALTER TABLE tenants.business 
ADD COLUMN IF NOT EXISTS selected_plan VARCHAR(20),
ADD COLUMN IF NOT EXISTS plan_price_cents INTEGER,
ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ;

-- Add billing address fields
ALTER TABLE tenants.business
ADD COLUMN IF NOT EXISTS billing_address VARCHAR(500),
ADD COLUMN IF NOT EXISTS billing_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS billing_state VARCHAR(50),
ADD COLUMN IF NOT EXISTS billing_zip VARCHAR(20),
ADD COLUMN IF NOT EXISTS billing_country VARCHAR(50) DEFAULT 'US';

-- Create new indexes for subscription fields
CREATE INDEX IF NOT EXISTS idx_business_selected_plan ON tenants.business(selected_plan);
CREATE INDEX IF NOT EXISTS idx_business_subscription_status ON tenants.business(subscription_status);
CREATE INDEX IF NOT EXISTS idx_business_trial_ends ON tenants.business(trial_ends_at);

-- Add column comments
COMMENT ON COLUMN tenants.business.selected_plan IS 'Current subscription plan: starter, pro, enterprise';
COMMENT ON COLUMN tenants.business.plan_price_cents IS 'Current plan price in cents';
COMMENT ON COLUMN tenants.business.billing_cycle IS 'Billing frequency: monthly, yearly';
COMMENT ON COLUMN tenants.business.subscription_status IS 'Current billing status: trial, active, past_due, cancelled, paused';
COMMENT ON COLUMN tenants.business.trial_ends_at IS 'When trial period ends';
COMMENT ON COLUMN tenants.business.subscription_started_at IS 'When paid subscription started';
COMMENT ON COLUMN tenants.business.billing_address IS 'Billing address (may differ from business address)';

-- Record migration
INSERT INTO system.schema_migrations (version, description) 
VALUES ('003', 'Add subscription and billing fields to tenants.business table')
ON CONFLICT (version) DO NOTHING;

-- ====================
-- DOWN MIGRATION (Rollback)
-- ====================

-- To rollback this migration, run:
-- DROP INDEX IF EXISTS idx_business_subscription_status;
-- DROP INDEX IF EXISTS idx_business_selected_plan;
-- DROP INDEX IF EXISTS idx_business_trial_ends;
-- ALTER TABLE tenants.business 
--   DROP COLUMN IF EXISTS selected_plan,
--   DROP COLUMN IF EXISTS plan_price_cents,
--   DROP COLUMN IF EXISTS billing_cycle,
--   DROP COLUMN IF EXISTS subscription_status,
--   DROP COLUMN IF EXISTS trial_ends_at,
--   DROP COLUMN IF EXISTS subscription_started_at,
--   DROP COLUMN IF EXISTS billing_address,
--   DROP COLUMN IF EXISTS billing_city,
--   DROP COLUMN IF EXISTS billing_state,
--   DROP COLUMN IF EXISTS billing_zip,
--   DROP COLUMN IF EXISTS billing_country;
-- DELETE FROM system.schema_migrations WHERE version = '003';

