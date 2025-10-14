-- booking.quotes table definition

CREATE TABLE IF NOT EXISTS booking.quotes (
  id INTEGER(32) NOT NULL DEFAULT nextval('booking.quotes_id_seq'::regclass),
  affiliate_id INTEGER(32) NOT NULL,
  customer_id INTEGER(32),
  address_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  requested_start TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'new'::character varying,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_total_cents INTEGER(32),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_quotes_affiliate_id ON booking.quotes USING btree (affiliate_id);
CREATE INDEX idx_quotes_created_at ON booking.quotes USING btree (created_at);
CREATE INDEX idx_quotes_customer_id ON booking.quotes USING btree (customer_id);
CREATE INDEX idx_quotes_status ON booking.quotes USING btree (status);

-- Table created: 2025-10-13T18:29:42.783Z
-- Extracted from database
