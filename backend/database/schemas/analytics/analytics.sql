-- Analytics schema for tracking tenant website performance and user interactions

-- Create analytics schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS analytics;

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics.events (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    event_parameters JSONB DEFAULT '{}',
    user_properties JSONB DEFAULT '{}',
    custom_dimensions JSONB DEFAULT '{}',
    client_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics events
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_id ON analytics.events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics.events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics.events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_event ON analytics.events(tenant_id, event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_date ON analytics.events(tenant_id, created_at);

-- Analytics sessions table (for future session tracking)
CREATE TABLE IF NOT EXISTS analytics.sessions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    referer TEXT,
    landing_page TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    page_views INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    is_bounce BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics sessions
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_tenant_id ON analytics.sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics.sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time ON analytics.sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_tenant_date ON analytics.sessions(tenant_id, start_time);

-- Analytics page views table (for detailed page tracking)
CREATE TABLE IF NOT EXISTS analytics.page_views (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    session_id VARCHAR(100),
    page_path TEXT NOT NULL,
    page_title TEXT,
    referer TEXT,
    user_agent TEXT,
    ip_address INET,
    view_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_on_page INTEGER DEFAULT 0,
    scroll_depth INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics page views
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_tenant_id ON analytics.page_views(tenant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id ON analytics.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_page_path ON analytics.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_view_time ON analytics.page_views(view_time);

-- Analytics conversions table (for tracking business goals)
CREATE TABLE IF NOT EXISTS analytics.conversions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    conversion_type VARCHAR(50) NOT NULL, -- 'quote_request', 'booking', 'contact', 'phone_call', 'email'
    conversion_value DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    conversion_data JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    page_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics conversions
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_tenant_id ON analytics.conversions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_type ON analytics.conversions(conversion_type);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_created_at ON analytics.conversions(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_tenant_type ON analytics.conversions(tenant_id, conversion_type);

-- Analytics performance metrics table (for Core Web Vitals tracking)
CREATE TABLE IF NOT EXISTS analytics.performance_metrics (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    page_path TEXT NOT NULL,
    metric_name VARCHAR(50) NOT NULL, -- 'LCP', 'FID', 'CLS', 'FCP', 'TTFB'
    metric_value DECIMAL(10,3) NOT NULL,
    metric_rating VARCHAR(20), -- 'good', 'needs-improvement', 'poor'
    user_agent TEXT,
    connection_type VARCHAR(50),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics performance metrics
CREATE INDEX IF NOT EXISTS idx_analytics_performance_tenant_id ON analytics.performance_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_performance_page_path ON analytics.performance_metrics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_performance_metric_name ON analytics.performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_performance_created_at ON analytics.performance_metrics(created_at);

-- Comments for documentation
COMMENT ON SCHEMA analytics IS 'Analytics data for tracking tenant website performance and user interactions';
COMMENT ON TABLE analytics.events IS 'Raw analytics events from tenant websites';
COMMENT ON TABLE analytics.sessions IS 'User sessions for tracking engagement and bounce rates';
COMMENT ON TABLE analytics.page_views IS 'Individual page view tracking with engagement metrics';
COMMENT ON TABLE analytics.conversions IS 'Business goal conversions (quotes, bookings, contacts)';
COMMENT ON TABLE analytics.performance_metrics IS 'Core Web Vitals and performance metrics';
