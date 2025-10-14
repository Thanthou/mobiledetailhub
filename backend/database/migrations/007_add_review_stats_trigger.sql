-- Migration: Add trigger to automatically update review statistics
-- Date: 2025-10-14
-- Description: Creates a trigger function to keep review stats in sync

-- Function to update review statistics for a tenant
CREATE OR REPLACE FUNCTION reputation.update_review_statistics()
RETURNS TRIGGER AS $$
DECLARE
  tenant_business_id INTEGER;
  new_count INTEGER;
  new_avg DECIMAL(3,2);
BEGIN
  -- Get the business_id for the affected tenant
  SELECT id INTO tenant_business_id
  FROM tenants.business
  WHERE slug = COALESCE(NEW.tenant_slug, OLD.tenant_slug);

  IF tenant_business_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Calculate new statistics
  SELECT 
    COUNT(*),
    COALESCE(AVG(rating), 0)
  INTO new_count, new_avg
  FROM reputation.reviews
  WHERE tenant_slug = COALESCE(NEW.tenant_slug, OLD.tenant_slug);

  -- Update the website.content table
  UPDATE website.content
  SET 
    reviews_total_count = new_count,
    reviews_avg_rating = new_avg,
    updated_at = NOW()
  WHERE business_id = tenant_business_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for INSERT, UPDATE, and DELETE operations
DROP TRIGGER IF EXISTS trigger_review_stats_insert ON reputation.reviews;
CREATE TRIGGER trigger_review_stats_insert
  AFTER INSERT ON reputation.reviews
  FOR EACH ROW
  EXECUTE FUNCTION reputation.update_review_statistics();

DROP TRIGGER IF EXISTS trigger_review_stats_update ON reputation.reviews;
CREATE TRIGGER trigger_review_stats_update
  AFTER UPDATE ON reputation.reviews
  FOR EACH ROW
  EXECUTE FUNCTION reputation.update_review_statistics();

DROP TRIGGER IF EXISTS trigger_review_stats_delete ON reputation.reviews;
CREATE TRIGGER trigger_review_stats_delete
  AFTER DELETE ON reputation.reviews
  FOR EACH ROW
  EXECUTE FUNCTION reputation.update_review_statistics();

