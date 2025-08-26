-- Create trigger function to automatically populate affiliate_service_areas when applications are approved
-- This ensures the main site can immediately show approved cities as "served"

CREATE OR REPLACE FUNCTION trg_affiliate_approved_seed_area()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_city text;
  v_state text;
  v_zip text;
BEGIN
  -- Only trigger on transition to 'approved'
  IF (TG_OP = 'UPDATE'
      AND NEW.application_status = 'approved'
      AND COALESCE(OLD.application_status,'') <> 'approved') THEN

    -- Extract city, state, zip from base_location JSONB
    v_city := NEW.base_location->>'city';
    v_state := NEW.base_location->>'state';
    v_zip := NEW.base_location->>'zip';

    -- Validate we have the required city and state
    IF v_city IS NULL OR v_state IS NULL OR v_city = '' OR v_state = '' THEN
      RAISE NOTICE 'Affiliate % approved but base_location incomplete. City: %, State: %. Skipping area seed.', 
        NEW.id, v_city, v_state;
      RETURN NEW;
    END IF;

    -- Insert service area for the whole city (zip = NULL means entire city coverage)
    INSERT INTO affiliate_service_areas(affiliate_id, state, city, zip, created_at)
    VALUES (NEW.id, v_state, v_city, NULL, NOW())
    ON CONFLICT (affiliate_id, state, city, zip) DO NOTHING;

    -- Also insert specific ZIP if provided
    IF v_zip IS NOT NULL AND v_zip != '' THEN
      INSERT INTO affiliate_service_areas(affiliate_id, state, city, zip, created_at)
      VALUES (NEW.id, v_state, v_city, v_zip, NOW())
      ON CONFLICT (affiliate_id, state, city, zip) DO NOTHING;
    END IF;

    RAISE NOTICE 'Affiliate % approved: Added service areas for %, % (ZIP: %)', 
      NEW.id, v_city, v_state, COALESCE(v_zip, 'entire city');

  END IF;

  RETURN NEW;
END$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_affiliate_approved_seed_area ON affiliates;

-- Create the trigger
CREATE TRIGGER on_affiliate_approved_seed_area
AFTER UPDATE ON affiliates
FOR EACH ROW EXECUTE FUNCTION trg_affiliate_approved_seed_area();

-- Test the function with existing approved affiliates (if any)
-- This will backfill service areas for any already-approved affiliates
DO $$
DECLARE
  affiliate_record RECORD;
BEGIN
  FOR affiliate_record IN 
    SELECT id, base_location, application_status 
    FROM affiliates 
    WHERE application_status = 'approved'
  LOOP
    -- Manually trigger the function for existing approved affiliates
    PERFORM trg_affiliate_approved_seed_area();
  END LOOP;
END$$;

-- Verify the trigger was created
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_affiliate_approved_seed_area';
