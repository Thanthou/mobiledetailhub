-- reputation.review_votes table definition

CREATE TABLE IF NOT EXISTS reputation.review_votes (
  id INTEGER(32) NOT NULL DEFAULT nextval('reputation.review_votes_id_seq'::regclass),
  review_id INTEGER(32) NOT NULL,
  voter_ip INET,
  voter_user_id INTEGER(32),
  vote_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_review_votes_review_id ON reputation.review_votes USING btree (review_id);
CREATE UNIQUE INDEX idx_review_votes_unique_ip ON reputation.review_votes USING btree (review_id, voter_ip) WHERE (voter_ip IS NOT NULL);
CREATE UNIQUE INDEX idx_review_votes_unique_user ON reputation.review_votes USING btree (review_id, voter_user_id) WHERE (voter_user_id IS NOT NULL);
CREATE INDEX idx_review_votes_vote_type ON reputation.review_votes USING btree (vote_type);
CREATE INDEX idx_review_votes_voter_ip ON reputation.review_votes USING btree (voter_ip);
CREATE INDEX idx_review_votes_voter_user_id ON reputation.review_votes USING btree (voter_user_id);

-- Table created: 2025-10-13T19:26:01.146Z
-- Extracted from database
