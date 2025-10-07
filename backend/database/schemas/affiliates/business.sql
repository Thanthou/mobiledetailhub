-- Business table for affiliate businesses
DROP TABLE IF EXISTS tenants.business CASCADE;

CREATE TABLE tenants.business (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) GENERATED ALWAYS AS (
        CASE 
            WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
            WHEN first_name IS NOT NULL THEN first_name
            WHEN last_name IS NOT NULL THEN last_name
            ELSE NULL
        END
    ) STORED,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    user_id INTEGER,
    application_status VARCHAR(50) DEFAULT 'pending',
    business_start_date DATE,
    business_phone VARCHAR(20),
    personal_phone VARCHAR(20),
    business_email VARCHAR(255),
    personal_email VARCHAR(255),
    twilio_phone VARCHAR(20),
    sms_phone VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN business_phone IS NOT NULL THEN '+1' || business_phone
            ELSE NULL
        END
    ) STORED,
    website TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN slug IS NOT NULL THEN 'http://mobiledetailhub.com/' || slug
            ELSE NULL
        END
    ) STORED,
    gbp_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    tiktok_url TEXT,
    source VARCHAR(255),
    notes TEXT,
    service_areas JSONB,
    application_date TIMESTAMP WITH TIME ZONE,
    approved_date TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_slug ON tenants.business(slug);
CREATE INDEX IF NOT EXISTS idx_business_user_id ON tenants.business(user_id);
CREATE INDEX IF NOT EXISTS idx_business_application_status ON tenants.business(application_status);
CREATE INDEX IF NOT EXISTS idx_business_created_at ON tenants.business(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION affiliates.update_business_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_business_updated_at
    BEFORE UPDATE ON tenants.business
    FOR EACH ROW
    EXECUTE FUNCTION affiliates.update_business_updated_at();
