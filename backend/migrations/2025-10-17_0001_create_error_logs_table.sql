-- Create error logs table for unified error tracking
-- This table stores structured error information for monitoring and analysis

CREATE TABLE IF NOT EXISTS system.error_logs (
    id SERIAL PRIMARY KEY,
    error_code VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Context information
    tenant_id VARCHAR(50),
    user_id VARCHAR(50),
    correlation_id VARCHAR(100),
    request_id VARCHAR(100),
    
    -- Error details
    metadata JSONB,
    stack_trace TEXT,
    user_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for common queries
    CONSTRAINT error_logs_severity_check CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT error_logs_category_check CHECK (error_category IN (
        'authentication', 'authorization', 'validation', 'database', 
        'network', 'business_logic', 'system', 'security', 'performance', 'user_input'
    ))
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON system.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id ON system.error_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON system.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_correlation_id ON system.error_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_code ON system.error_logs(error_code);
CREATE INDEX IF NOT EXISTS idx_error_logs_category ON system.error_logs(error_category);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON system.error_logs(severity);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_created ON system.error_logs(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_category_severity ON system.error_logs(error_category, severity);

-- Add comments for documentation
COMMENT ON TABLE system.error_logs IS 'Stores structured error information for monitoring and analysis';
COMMENT ON COLUMN system.error_logs.error_code IS 'Unique error code identifier';
COMMENT ON COLUMN system.error_logs.error_message IS 'Technical error message';
COMMENT ON COLUMN system.error_logs.error_category IS 'Category of error (authentication, validation, etc.)';
COMMENT ON COLUMN system.error_logs.severity IS 'Error severity level (low, medium, high, critical)';
COMMENT ON COLUMN system.error_logs.tenant_id IS 'Tenant ID if error is tenant-specific';
COMMENT ON COLUMN system.error_logs.user_id IS 'User ID if error is user-specific';
COMMENT ON COLUMN system.error_logs.correlation_id IS 'Request correlation ID for tracing';
COMMENT ON COLUMN system.error_logs.request_id IS 'Request ID for tracing';
COMMENT ON COLUMN system.error_logs.metadata IS 'Additional error metadata as JSON';
COMMENT ON COLUMN system.error_logs.stack_trace IS 'Error stack trace';
COMMENT ON COLUMN system.error_logs.user_message IS 'User-friendly error message';
