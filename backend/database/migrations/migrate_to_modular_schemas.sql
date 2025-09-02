-- Migration: Move from single public schema to modular schemas
-- Version: v5.0
-- Description: Separate tables into domain-specific schemas for better organization

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Create new schemas
-- ─────────────────────────────────────────────────────────────────────────────

-- Authentication & Authorization
CREATE SCHEMA IF NOT EXISTS auth;
COMMENT ON SCHEMA auth IS 'Authentication, authorization, and user management';

-- Customer Management
CREATE SCHEMA IF NOT EXISTS customers;
COMMENT ON SCHEMA customers IS 'Customer profiles and preferences';

-- Business Operations
CREATE SCHEMA IF NOT EXISTS business;
COMMENT ON SCHEMA business IS 'Affiliates, services, and business configuration';

-- Booking & Scheduling
CREATE SCHEMA IF NOT EXISTS booking;
COMMENT ON SCHEMA booking IS 'Availability, quotes, and bookings';

-- Reputation & Reviews
CREATE SCHEMA IF NOT EXISTS reputation;
COMMENT ON SCHEMA reputation IS 'Reviews, ratings, and reputation management';

-- System Management
CREATE SCHEMA IF NOT EXISTS system;
COMMENT ON SCHEMA system IS 'System configuration and migrations';

-- ─────────────────────────────────────────────────────────────────────────────
-- Move tables to appropriate schemas
-- ─────────────────────────────────────────────────────────────────────────────

-- AUTH SCHEMA
ALTER TABLE users SET SCHEMA auth;
ALTER TABLE refresh_tokens SET SCHEMA auth;
ALTER TABLE affiliate_users SET SCHEMA auth;

-- CUSTOMERS SCHEMA  
ALTER TABLE customers SET SCHEMA customers;

-- BUSINESS SCHEMA
ALTER TABLE affiliates SET SCHEMA business;
ALTER TABLE services SET SCHEMA business;
ALTER TABLE service_tiers SET SCHEMA business;
ALTER TABLE mdh_config SET SCHEMA business;

-- BOOKING SCHEMA
ALTER TABLE availability SET SCHEMA booking;
ALTER TABLE quotes SET SCHEMA booking;
ALTER TABLE bookings SET SCHEMA booking;

-- REPUTATION SCHEMA
ALTER TABLE location SET SCHEMA reputation;
ALTER TABLE reviews SET SCHEMA reputation;
ALTER TABLE review_reply SET SCHEMA reputation;
ALTER TABLE review_sync_state SET SCHEMA reputation;

-- SYSTEM SCHEMA
ALTER TABLE schema_migrations SET SCHEMA system;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update foreign key references to use schema-qualified names
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop existing foreign key constraints that reference moved tables
ALTER TABLE customers.customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;
ALTER TABLE auth.affiliate_users DROP CONSTRAINT IF EXISTS affiliate_users_affiliate_id_fkey;
ALTER TABLE auth.affiliate_users DROP CONSTRAINT IF EXISTS affiliate_users_user_id_fkey;
ALTER TABLE business.services DROP CONSTRAINT IF EXISTS services_affiliate_id_fkey;
ALTER TABLE business.service_tiers DROP CONSTRAINT IF EXISTS service_tiers_service_id_fkey;
ALTER TABLE booking.availability DROP CONSTRAINT IF EXISTS availability_affiliate_id_fkey;
ALTER TABLE booking.quotes DROP CONSTRAINT IF EXISTS quotes_affiliate_id_fkey;
ALTER TABLE booking.quotes DROP CONSTRAINT IF EXISTS quotes_customer_id_fkey;
ALTER TABLE booking.bookings DROP CONSTRAINT IF EXISTS bookings_affiliate_id_fkey;
ALTER TABLE booking.bookings DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;
ALTER TABLE booking.bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;
ALTER TABLE booking.bookings DROP CONSTRAINT IF EXISTS bookings_tier_id_fkey;
ALTER TABLE reputation.location DROP CONSTRAINT IF EXISTS location_affiliate_id_fkey;
ALTER TABLE reputation.reviews DROP CONSTRAINT IF EXISTS reviews_affiliate_id_fkey;
ALTER TABLE reputation.reviews DROP CONSTRAINT IF EXISTS reviews_location_id_fkey;
ALTER TABLE reputation.review_reply DROP CONSTRAINT IF EXISTS review_reply_review_id_fkey;
ALTER TABLE reputation.review_sync_state DROP CONSTRAINT IF EXISTS review_sync_state_location_id_fkey;
ALTER TABLE auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;

-- Recreate foreign key constraints with schema-qualified references
ALTER TABLE customers.customers ADD CONSTRAINT customers_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE auth.affiliate_users ADD CONSTRAINT affiliate_users_affiliate_id_fkey 
  FOREIGN KEY (affiliate_id) REFERENCES business.affiliates(id) ON DELETE CASCADE;

ALTER TABLE auth.affiliate_users ADD CONSTRAINT affiliate_users_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE business.services ADD CONSTRAINT services_affiliate_id_fkey 
  FOREIGN KEY (affiliate_id) REFERENCES business.affiliates(id) ON DELETE CASCADE;

ALTER TABLE business.service_tiers ADD CONSTRAINT service_tiers_service_id_fkey 
  FOREIGN KEY (service_id) REFERENCES business.services(id) ON DELETE CASCADE;

ALTER TABLE booking.availability ADD CONSTRAINT availability_affiliate_id_fkey 
  FOREIGN KEY (affiliate_id) REFERENCES business.affiliates(id) ON DELETE CASCADE;

ALTER TABLE booking.quotes ADD CONSTRAINT quotes_affiliate_id_fkey 
  FOREIGN KEY (affiliate_id) REFERENCES business.affiliates(id) ON DELETE CASCADE;

ALTER TABLE booking.quotes ADD CONSTRAINT quotes_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers.customers(id) ON DELETE SET NULL;

ALTER TABLE booking.bookings ADD CONSTRAINT bookings_affiliate_id_fkey 
  FOREIGN KEY (affiliate_id) REFERENCES business.affiliates(id) ON DELETE CASCADE;

ALTER TABLE booking.bookings ADD CONSTRAINT bookings_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers.customers(id) ON DELETE SET NULL;

ALTER TABLE booking.bookings ADD CONSTRAINT bookings_service_id_fkey 
  FOREIGN KEY (service_id) REFERENCES business.services(id) ON DELETE SET NULL;

ALTER TABLE booking.bookings ADD CONSTRAINT bookings_tier_id_fkey 
  FOREIGN KEY (tier_id) REFERENCES business.service_tiers(id) ON DELETE SET NULL;

ALTER TABLE reputation.location ADD CONSTRAINT location_affiliate_id_fkey 
  FOREIGN KEY (affiliate_id) REFERENCES business.affiliates(id) ON DELETE SET NULL;

ALTER TABLE reputation.reviews ADD CONSTRAINT reviews_affiliate_id_fkey 
  FOREIGN KEY (affiliate_id) REFERENCES business.affiliates(id) ON DELETE CASCADE;

ALTER TABLE reputation.reviews ADD CONSTRAINT reviews_location_id_fkey 
  FOREIGN KEY (location_id) REFERENCES reputation.location(location_id) ON DELETE SET NULL;

ALTER TABLE reputation.review_reply ADD CONSTRAINT review_reply_review_id_fkey 
  FOREIGN KEY (review_id) REFERENCES reputation.reviews(id) ON DELETE CASCADE;

ALTER TABLE reputation.review_sync_state ADD CONSTRAINT review_sync_state_location_id_fkey 
  FOREIGN KEY (location_id) REFERENCES reputation.location(location_id) ON DELETE CASCADE;

ALTER TABLE auth.refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update triggers to reference schema-qualified functions
-- ─────────────────────────────────────────────────────────────────────────────

-- Note: Functions remain in public schema, so triggers should work as-is
-- But let's verify and recreate if needed

-- ─────────────────────────────────────────────────────────────────────────────
-- Create views for backward compatibility (optional)
-- ─────────────────────────────────────────────────────────────────────────────

-- Create views in public schema that point to the new schema locations
-- This allows existing code to work without immediate changes

CREATE OR REPLACE VIEW public.users AS SELECT * FROM auth.users;
CREATE OR REPLACE VIEW public.customers AS SELECT * FROM customers.customers;
CREATE OR REPLACE VIEW public.affiliates AS SELECT * FROM business.affiliates;
CREATE OR REPLACE VIEW public.services AS SELECT * FROM business.services;
CREATE OR REPLACE VIEW public.service_tiers AS SELECT * FROM business.service_tiers;
CREATE OR REPLACE VIEW public.availability AS SELECT * FROM booking.availability;
CREATE OR REPLACE VIEW public.quotes AS SELECT * FROM booking.quotes;
CREATE OR REPLACE VIEW public.bookings AS SELECT * FROM booking.bookings;
CREATE OR REPLACE VIEW public.location AS SELECT * FROM reputation.location;
CREATE OR REPLACE VIEW public.reviews AS SELECT * FROM reputation.reviews;
CREATE OR REPLACE VIEW public.review_reply AS SELECT * FROM reputation.review_reply;
CREATE OR REPLACE VIEW public.review_sync_state AS SELECT * FROM reputation.review_sync_state;
CREATE OR REPLACE VIEW public.mdh_config AS SELECT * FROM business.mdh_config;
CREATE OR REPLACE VIEW public.refresh_tokens AS SELECT * FROM auth.refresh_tokens;
CREATE OR REPLACE VIEW public.affiliate_users AS SELECT * FROM auth.affiliate_users;
CREATE OR REPLACE VIEW public.schema_migrations AS SELECT * FROM system.schema_migrations;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update search path for better performance
-- ─────────────────────────────────────────────────────────────────────────────

-- Set search path to include all schemas in logical order
-- This allows queries to find tables without schema qualification
ALTER DATABASE postgres SET search_path TO public, auth, customers, business, booking, reputation, system;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update migration tracking
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO system.schema_migrations(version, description) VALUES
('v5.0', 'Migrated to modular schemas: auth, customers, business, booking, reputation, system');

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
WHERE schemaname IN ('auth', 'customers', 'business', 'booking', 'reputation', 'system')
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
  AND tc.table_schema IN ('auth', 'customers', 'business', 'booking', 'reputation', 'system')
ORDER BY tc.table_schema, tc.table_name;
