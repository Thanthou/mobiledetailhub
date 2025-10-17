-- Create All Required Schemas
-- This migration ensures all necessary schemas exist before other migrations run
-- MUST run first to avoid dependency issues

-- Create all required schemas (matching actual database structure)
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS customers;
CREATE SCHEMA IF NOT EXISTS reputation;
CREATE SCHEMA IF NOT EXISTS schedule;
CREATE SCHEMA IF NOT EXISTS system;
CREATE SCHEMA IF NOT EXISTS tenants;
CREATE SCHEMA IF NOT EXISTS website;

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS analytics CASCADE;
-- DROP SCHEMA IF EXISTS auth CASCADE;
-- DROP SCHEMA IF EXISTS booking CASCADE;
-- DROP SCHEMA IF EXISTS customers CASCADE;
-- DROP SCHEMA IF EXISTS reputation CASCADE;
-- DROP SCHEMA IF EXISTS schedule CASCADE;
-- DROP SCHEMA IF EXISTS system CASCADE;
-- DROP SCHEMA IF EXISTS tenants CASCADE;
-- DROP SCHEMA IF EXISTS website CASCADE;
