-- reputation.reviews table definition

CREATE TABLE IF NOT EXISTS reputation.reviews (
  id INTEGER(32) NOT NULL DEFAULT nextval('reputation.reviews_id_seq'::regclass),
  tenant_slug VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating SMALLINT(16) NOT NULL,
  comment TEXT NOT NULL,
  reviewer_url VARCHAR(500),
  vehicle_type VARCHAR(50),
  paint_correction BOOLEAN NOT NULL DEFAULT false,
  ceramic_coating BOOLEAN NOT NULL DEFAULT false,
  paint_protection_film BOOLEAN NOT NULL DEFAULT false,
  source VARCHAR(50) NOT NULL DEFAULT 'website'::character varying,
  avatar_filename VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMPTZ,
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_reviews_created_at ON reputation.reviews USING btree (created_at);
CREATE INDEX idx_reviews_rating ON reputation.reviews USING btree (rating);
CREATE INDEX idx_reviews_source ON reputation.reviews USING btree (source);
CREATE INDEX idx_reviews_tenant_created ON reputation.reviews USING btree (tenant_slug, created_at);
CREATE INDEX idx_reviews_tenant_rating ON reputation.reviews USING btree (tenant_slug, rating);
CREATE INDEX idx_reviews_tenant_slug ON reputation.reviews USING btree (tenant_slug);

-- Table created: 2025-10-13T19:26:01.127Z
-- Extracted from database
