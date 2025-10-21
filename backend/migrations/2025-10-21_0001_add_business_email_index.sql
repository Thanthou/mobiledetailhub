-- Add index on business_email for faster lookups
-- Email is commonly used for authentication and lookups

-- Create index on business_email in tenants.business table
CREATE INDEX IF NOT EXISTS idx_business_email 
ON tenants.business(business_email);

-- Add comment explaining the index
COMMENT ON INDEX tenants.idx_business_email IS 'Index for fast email lookups during authentication and user searches';

