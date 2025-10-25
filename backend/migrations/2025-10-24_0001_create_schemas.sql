-- Create Database Schemas
-- Migration: 2025-10-24_0001_create_schemas
-- Purpose: Create all database schemas for multi-tenant SaaS

-- Create all schemas
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS customers;
CREATE SCHEMA IF NOT EXISTS reputation;
CREATE SCHEMA IF NOT EXISTS schedule;
CREATE SCHEMA IF NOT EXISTS system;
CREATE SCHEMA IF NOT EXISTS tenants;
CREATE SCHEMA IF NOT EXISTS website;

-- Add schema comments
COMMENT ON SCHEMA analytics IS 'Analytics and metrics data';
COMMENT ON SCHEMA auth IS 'Authentication and user management';
COMMENT ON SCHEMA booking IS 'Service bookings and appointments';
COMMENT ON SCHEMA customers IS 'Customer records and communication';
COMMENT ON SCHEMA reputation IS 'Reviews, ratings, and testimonials';
COMMENT ON SCHEMA schedule IS 'Availability and scheduling';
COMMENT ON SCHEMA system IS 'System logs, settings, and monitoring';
COMMENT ON SCHEMA tenants IS 'Tenant business records and services';
COMMENT ON SCHEMA website IS 'Website content and media';

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

