-- reputation.review_replies table definition

CREATE TABLE IF NOT EXISTS reputation.review_replies (
  id INTEGER(32) NOT NULL DEFAULT nextval('reputation.review_replies_id_seq'::regclass),
  review_id INTEGER(32) NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER(32) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(50) NOT NULL DEFAULT 'business_owner'::character varying,
  status VARCHAR(20) NOT NULL DEFAULT 'published'::character varying,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMPTZ,
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_review_replies_author_id ON reputation.review_replies USING btree (author_id);
CREATE INDEX idx_review_replies_created_at ON reputation.review_replies USING btree (created_at);
CREATE INDEX idx_review_replies_review_id ON reputation.review_replies USING btree (review_id);
CREATE INDEX idx_review_replies_status ON reputation.review_replies USING btree (status);

-- Table created: 2025-10-13T19:26:01.136Z
-- Extracted from database
