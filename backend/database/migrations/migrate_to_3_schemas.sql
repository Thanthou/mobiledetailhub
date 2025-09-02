-- Migration: Move from single public schema to 3-schema design
-- Version: v5.0
-- Description: Separate tables into auth, affiliates, and system schemas

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Create new schemas
-- ─────────────────────────────────────────────────────────────────────────────

-- Authentication & Authorization
CREATE SCHEMA IF NOT EXISTS auth;
COMMENT ON SCHEMA auth IS 'Authentication, authorization, and user management';

-- Affiliate Operations
CREATE SCHEMA IF NOT EXISTS affiliates;
COMMENT ON SCHEMA affiliates IS 'Affiliate management, services, and pricing';

-- Customer Management
CREATE SCHEMA IF NOT EXISTS customers;
COMMENT ON SCHEMA customers IS 'Customer profiles and preferences';

-- Vehicle Management (for future use)
CREATE SCHEMA IF NOT EXISTS vehicles;
COMMENT ON SCHEMA vehicles IS 'Vehicle data and specifications';

-- System Management
CREATE SCHEMA IF NOT EXISTS system;
COMMENT ON SCHEMA system IS 'System configuration and migrations';

-- ─────────────────────────────────────────────────────────────────────────────
-- Move tables to appropriate schemas
-- ─────────────────────────────────────────────────────────────────────────────

-- AUTH SCHEMA
ALTER TABLE users SET SCHEMA auth;
ALTER TABLE refresh_tokens SET SCHEMA auth;

-- AFFILIATES SCHEMA
ALTER TABLE affiliates SET SCHEMA affiliates;
ALTER TABLE service_tiers SET SCHEMA affiliates;
ALTER TABLE tiers SET SCHEMA affiliates;

-- CUSTOMERS SCHEMA
ALTER TABLE customers SET SCHEMA customers;

-- VEHICLES SCHEMA
ALTER TABLE vehicles SET SCHEMA vehicles;

-- SYSTEM SCHEMA
ALTER TABLE mdh_config SET SCHEMA system;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update foreign key references to use schema-qualified names
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop existing foreign key constraints that reference moved tables
ALTER TABLE auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE affiliates.affiliates DROP CONSTRAINT IF EXISTS affiliates_user_id_fkey;
ALTER TABLE customers.customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;

-- Recreate foreign key constraints with schema-qualified references
ALTER TABLE auth.refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE affiliates.affiliates ADD CONSTRAINT affiliates_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE customers.customers ADD CONSTRAINT customers_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Create views for backward compatibility
-- ─────────────────────────────────────────────────────────────────────────────

-- Create views in public schema that point to the new schema locations
-- This allows existing code to work without immediate changes

CREATE OR REPLACE VIEW public.users AS SELECT * FROM auth.users;
CREATE OR REPLACE VIEW public.refresh_tokens AS SELECT * FROM auth.refresh_tokens;
CREATE OR REPLACE VIEW public.affiliates AS SELECT * FROM affiliates.affiliates;
CREATE OR REPLACE VIEW public.service_tiers AS SELECT * FROM affiliates.service_tiers;
CREATE OR REPLACE VIEW public.tiers AS SELECT * FROM affiliates.tiers;
CREATE OR REPLACE VIEW public.customers AS SELECT * FROM customers.customers;
CREATE OR REPLACE VIEW public.vehicles AS SELECT * FROM vehicles.vehicles;
CREATE OR REPLACE VIEW public.mdh_config AS SELECT * FROM system.mdh_config;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update search path for better performance
-- ─────────────────────────────────────────────────────────────────────────────

-- Set search path to include all schemas in logical order
-- This allows queries to find tables without schema qualification
ALTER DATABASE postgres SET search_path TO public, auth, customers, vehicles, affiliates, system;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update migration tracking
-- ─────────────────────────────────────────────────────────────────────────────

-- Note: schema_migrations table doesn't exist yet, so we'll create it
CREATE TABLE IF NOT EXISTS system.schema_migrations (
  version     TEXT PRIMARY KEY,
  applied_at  TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

INSERT INTO system.schema_migrations(version, description) VALUES
('v5.0', 'Migrated to 5-schema design: auth, customers, vehicles, affiliates, system');

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries
-- ─────────────────────────────────────────────────────────────────────────────

-- Verify all tables are in correct schemas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname IN ('auth', 'customers', 'vehicles', 'affiliates', 'system')
ORDER BY schemaname, tablename;

-- Verify foreign key constraints are working
SELECT 
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema IN ('auth', 'customers', 'vehicles', 'affiliates', 'system')
ORDER BY tc.table_schema, tc.table_name;

-- Test that views work correctly
SELECT 'Testing views...' as status;
SELECT COUNT(*) as users_count FROM public.users;
SELECT COUNT(*) as affiliates_count FROM public.affiliates;
SELECT COUNT(*) as service_tiers_count FROM public.service_tiers;
SELECT COUNT(*) as tiers_count FROM public.tiers;
SELECT COUNT(*) as customers_count FROM public.customers;
SELECT COUNT(*) as vehicles_count FROM public.vehicles;
SELECT COUNT(*) as mdh_config_count FROM public.mdh_config;
