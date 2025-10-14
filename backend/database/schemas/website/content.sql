-- website.content table definition

CREATE TABLE IF NOT EXISTS website.content (
  id INTEGER(32) NOT NULL DEFAULT nextval('website.content_id_seq'::regclass),
  business_id INTEGER(32) NOT NULL,
  header_logo_url VARCHAR(500),
  header_icon_url VARCHAR(500),
  hero_title VARCHAR(500),
  hero_subtitle TEXT,
  reviews_title VARCHAR(255),
  reviews_subtitle TEXT,
  faq_title VARCHAR(255),
  faq_subtitle TEXT,
  faq_items JSONB DEFAULT '[]'::jsonb,
  custom_sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_content_business_id ON website.content USING btree (business_id);
CREATE INDEX idx_content_updated_at ON website.content USING btree (updated_at);
CREATE UNIQUE INDEX uk_content_business_id ON website.content USING btree (business_id);

-- Table created: 2025-10-13T19:26:01.170Z
-- Extracted from database
