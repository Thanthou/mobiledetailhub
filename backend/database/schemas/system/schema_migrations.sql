-- Schema migrations table for tracking database version history
DROP TABLE IF EXISTS system.schema_migrations CASCADE;

CREATE TABLE system.schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON system.schema_migrations(applied_at);

-- Insert initial migration record
INSERT INTO system.schema_migrations (version, description) 
VALUES ('v5.0', 'Migrated to 5-schema design: auth, customers, vehicles, affiliates, system')
ON CONFLICT (version) DO NOTHING;
