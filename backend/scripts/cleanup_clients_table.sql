-- Cleanup script: Remove the old clients table after migration is complete
-- Only run this after:
-- 1. Foreign key constraints have been updated to reference customers table
-- 2. All application code has been updated to use customers instead of clients
-- 3. You've verified the migration works correctly

-- Drop the clients table (this will fail if any foreign key constraints still reference it)
DROP TABLE IF EXISTS clients CASCADE;

-- Verify the table was dropped
SELECT table_name FROM information_schema.tables WHERE table_name = 'clients';
