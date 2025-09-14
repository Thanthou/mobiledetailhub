-- Customer communications table for tracking all customer interactions
DROP TABLE IF EXISTS customers.customer_communications CASCADE;

CREATE TABLE customers.customer_communications (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers.customers(id) ON DELETE CASCADE,
    
    -- Communication details
    communication_type VARCHAR(50) NOT NULL, -- email, sms, phone, in_app, mail
    direction VARCHAR(10) NOT NULL, -- inbound, outbound
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Communication metadata
    status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, read, failed, bounced
    priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, urgent
    category VARCHAR(50), -- booking_confirmation, quote_request, marketing, support, etc.
    
    -- Related entities
    related_booking_id INTEGER, -- if related to a booking
    related_quote_id INTEGER, -- if related to a quote
    related_affiliate_id INTEGER, -- if from/to specific affiliate
    
    -- Delivery tracking
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    
    -- Response tracking
    response_required BOOLEAN DEFAULT false,
    response_received_at TIMESTAMPTZ,
    response_content TEXT,
    
    -- External system tracking
    external_id VARCHAR(255), -- ID from email/SMS service
    external_status VARCHAR(50), -- status from external service
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_communications_customer_id ON customers.customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_type ON customers.customer_communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_customer_communications_direction ON customers.customer_communications(direction);
CREATE INDEX IF NOT EXISTS idx_customer_communications_status ON customers.customer_communications(status);
CREATE INDEX IF NOT EXISTS idx_customer_communications_created_at ON customers.customer_communications(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_communications_booking_id ON customers.customer_communications(related_booking_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_quote_id ON customers.customer_communications(related_quote_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION customers.update_customer_communications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customer_communications_updated_at
    BEFORE UPDATE ON customers.customer_communications
    FOR EACH ROW
    EXECUTE FUNCTION customers.update_customer_communications_updated_at();

-- Add comments for documentation
COMMENT ON TABLE customers.customer_communications IS 'All customer communication history and tracking';
COMMENT ON COLUMN customers.customer_communications.communication_type IS 'Type of communication: email, sms, phone, in_app, mail';
COMMENT ON COLUMN customers.customer_communications.direction IS 'Whether communication was inbound or outbound';
COMMENT ON COLUMN customers.customer_communications.status IS 'Current status of the communication';
COMMENT ON COLUMN customers.customer_communications.category IS 'Business category of the communication';
