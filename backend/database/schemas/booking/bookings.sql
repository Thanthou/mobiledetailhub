-- booking.bookings table definition

CREATE TABLE IF NOT EXISTS booking.bookings (
  id INTEGER(32) NOT NULL DEFAULT nextval('booking.bookings_id_seq'::regclass),
  affiliate_id INTEGER(32) NOT NULL,
  customer_id INTEGER(32),
  service_id INTEGER(32),
  tier_id INTEGER(32),
  appointment_start TIMESTAMPTZ NOT NULL,
  appointment_end TIMESTAMPTZ NOT NULL,
  address_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'::character varying,
  total_cents INTEGER(32) NOT NULL DEFAULT 0,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_bookings_affiliate_id ON booking.bookings USING btree (affiliate_id);
CREATE INDEX idx_bookings_appointment_start ON booking.bookings USING btree (appointment_start);
CREATE INDEX idx_bookings_created_at ON booking.bookings USING btree (created_at);
CREATE INDEX idx_bookings_customer_id ON booking.bookings USING btree (customer_id);
CREATE INDEX idx_bookings_status ON booking.bookings USING btree (status);

-- Table created: 2025-10-13T18:29:42.773Z
-- Extracted from database
