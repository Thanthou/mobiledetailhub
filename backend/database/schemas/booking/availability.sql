-- booking.availability table definition

CREATE TABLE IF NOT EXISTS booking.availability (
  id INTEGER(32) NOT NULL DEFAULT nextval('booking.availability_id_seq'::regclass),
  affiliate_id INTEGER(32) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER(32) NOT NULL DEFAULT 1,
  is_blocked BOOLEAN DEFAULT false,
  block_reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_availability_affiliate_date ON booking.availability USING btree (affiliate_id, date);
CREATE INDEX idx_availability_date ON booking.availability USING btree (date);

-- Table created: 2025-10-13T18:29:42.763Z
-- Extracted from database
