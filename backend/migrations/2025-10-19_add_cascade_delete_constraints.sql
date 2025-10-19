-- Add CASCADE DELETE Constraints Migration
-- This migration adds ON DELETE CASCADE to foreign key constraints
-- to enable automatic cleanup when tenants are deleted

-- Note: This migration modifies existing foreign key constraints
-- It will drop and recreate them with CASCADE DELETE behavior

BEGIN;

-- 1. Update tenants.services to cascade delete when business is deleted
ALTER TABLE tenants.services 
DROP CONSTRAINT IF EXISTS services_business_id_fkey,
ADD CONSTRAINT services_business_id_fkey 
FOREIGN KEY (business_id) REFERENCES tenants.business(id) ON DELETE CASCADE;

-- 2. Update tenants.service_areas to cascade delete when business is deleted
ALTER TABLE tenants.service_areas 
DROP CONSTRAINT IF EXISTS service_areas_business_id_fkey,
ADD CONSTRAINT service_areas_business_id_fkey 
FOREIGN KEY (business_id) REFERENCES tenants.business(id) ON DELETE CASCADE;

-- 3. Update tenants.subscriptions to cascade delete when business is deleted
ALTER TABLE tenants.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_business_id_fkey,
ADD CONSTRAINT subscriptions_business_id_fkey 
FOREIGN KEY (business_id) REFERENCES tenants.business(id) ON DELETE CASCADE;

-- 4. Update booking.bookings to cascade delete when tenant is deleted
ALTER TABLE booking.bookings 
DROP CONSTRAINT IF EXISTS bookings_tenant_id_fkey,
ADD CONSTRAINT bookings_tenant_id_fkey 
FOREIGN KEY (tenant_id) REFERENCES tenants.business(id) ON DELETE CASCADE;

-- 5. Update booking.availability to cascade delete when tenant is deleted
ALTER TABLE booking.availability 
DROP CONSTRAINT IF EXISTS availability_tenant_id_fkey,
ADD CONSTRAINT availability_tenant_id_fkey 
FOREIGN KEY (tenant_id) REFERENCES tenants.business(id) ON DELETE CASCADE;

-- 6. Update booking.blackout_dates to cascade delete when tenant is deleted
ALTER TABLE booking.blackout_dates 
DROP CONSTRAINT IF EXISTS blackout_dates_tenant_id_fkey,
ADD CONSTRAINT blackout_dates_tenant_id_fkey 
FOREIGN KEY (tenant_id) REFERENCES tenants.business(id) ON DELETE CASCADE;

-- 7. Check if service_tiers table exists and update it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'tenants' AND table_name = 'service_tiers') THEN
        ALTER TABLE tenants.service_tiers 
        DROP CONSTRAINT IF EXISTS service_tiers_service_id_fkey,
        ADD CONSTRAINT service_tiers_service_id_fkey 
        FOREIGN KEY (service_id) REFERENCES tenants.services(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 8. Check if tenant_images table exists and update it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'tenants' AND table_name = 'tenant_images') THEN
        -- For tenant_images, we need to check if it references business_id or tenant_slug
        -- If it references tenant_slug, we'll need a different approach
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'tenants' AND table_name = 'tenant_images' AND column_name = 'business_id') THEN
            ALTER TABLE tenants.tenant_images 
            DROP CONSTRAINT IF EXISTS tenant_images_business_id_fkey,
            ADD CONSTRAINT tenant_images_business_id_fkey 
            FOREIGN KEY (business_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 9. Check if website.content table exists and update it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'website' AND table_name = 'content') THEN
        ALTER TABLE website.content 
        DROP CONSTRAINT IF EXISTS content_business_id_fkey,
        ADD CONSTRAINT content_business_id_fkey 
        FOREIGN KEY (business_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 10. Check if system.health_monitoring table exists and update it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'system' AND table_name = 'health_monitoring') THEN
        -- Update both business_id and tenant_slug references if they exist
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'system' AND table_name = 'health_monitoring' AND column_name = 'business_id') THEN
            ALTER TABLE system.health_monitoring 
            DROP CONSTRAINT IF EXISTS health_monitoring_business_id_fkey,
            ADD CONSTRAINT health_monitoring_business_id_fkey 
            FOREIGN KEY (business_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 11. Check if reputation.reviews table exists and update it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'reputation' AND table_name = 'reviews') THEN
        -- For reviews, we might need to handle tenant_slug differently
        -- For now, we'll add a business_id reference if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'reputation' AND table_name = 'reviews' AND column_name = 'business_id') THEN
            ALTER TABLE reputation.reviews ADD COLUMN business_id INTEGER;
            UPDATE reputation.reviews SET business_id = (
                SELECT id FROM tenants.business WHERE slug = reputation.reviews.tenant_slug
            ) WHERE tenant_slug IS NOT NULL;
            ALTER TABLE reputation.reviews 
            ADD CONSTRAINT reviews_business_id_fkey 
            FOREIGN KEY (business_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 12. Check if schedule tables exist and update them
DO $$ 
BEGIN
    -- schedule.time_blocks
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'schedule' AND table_name = 'time_blocks') THEN
        ALTER TABLE schedule.time_blocks 
        DROP CONSTRAINT IF EXISTS time_blocks_affiliate_id_fkey,
        ADD CONSTRAINT time_blocks_affiliate_id_fkey 
        FOREIGN KEY (affiliate_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
    END IF;
    
    -- schedule.blocked_days
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'schedule' AND table_name = 'blocked_days') THEN
        ALTER TABLE schedule.blocked_days 
        DROP CONSTRAINT IF EXISTS blocked_days_affiliate_id_fkey,
        ADD CONSTRAINT blocked_days_affiliate_id_fkey 
        FOREIGN KEY (affiliate_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
    END IF;
    
    -- schedule.appointments
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'schedule' AND table_name = 'appointments') THEN
        ALTER TABLE schedule.appointments 
        DROP CONSTRAINT IF EXISTS appointments_affiliate_id_fkey,
        ADD CONSTRAINT appointments_affiliate_id_fkey 
        FOREIGN KEY (affiliate_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
    END IF;
    
    -- schedule.schedule_settings
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'schedule' AND table_name = 'schedule_settings') THEN
        ALTER TABLE schedule.schedule_settings 
        DROP CONSTRAINT IF EXISTS schedule_settings_affiliate_id_fkey,
        ADD CONSTRAINT schedule_settings_affiliate_id_fkey 
        FOREIGN KEY (affiliate_id) REFERENCES tenants.business(id) ON DELETE CASCADE;
    END IF;
END $$;

COMMIT;

-- Add comments to document the cascade behavior
COMMENT ON CONSTRAINT services_business_id_fkey ON tenants.services IS 'Cascades delete when business is deleted';
COMMENT ON CONSTRAINT service_areas_business_id_fkey ON tenants.service_areas IS 'Cascades delete when business is deleted';
COMMENT ON CONSTRAINT subscriptions_business_id_fkey ON tenants.subscriptions IS 'Cascades delete when business is deleted';
COMMENT ON CONSTRAINT bookings_tenant_id_fkey ON booking.bookings IS 'Cascades delete when tenant is deleted';
COMMENT ON CONSTRAINT availability_tenant_id_fkey ON booking.availability IS 'Cascades delete when tenant is deleted';
COMMENT ON CONSTRAINT blackout_dates_tenant_id_fkey ON booking.blackout_dates IS 'Cascades delete when tenant is deleted';
