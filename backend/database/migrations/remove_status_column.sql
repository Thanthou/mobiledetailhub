-- Remove status column from reputation.reviews table
-- This column is no longer needed since reviews are published immediately

ALTER TABLE reputation.reviews DROP COLUMN IF EXISTS status;
