-- Review votes table for helpful/not helpful voting
DROP TABLE IF EXISTS reputation.review_votes CASCADE;

CREATE TABLE reputation.review_votes (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    
    -- Voter information (can be anonymous)
    voter_ip INET NULL,
    voter_user_id INTEGER NULL, -- References auth.users.id if logged in
    
    -- Vote type
    vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON reputation.review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_voter_ip ON reputation.review_votes(voter_ip);
CREATE INDEX IF NOT EXISTS idx_review_votes_voter_user_id ON reputation.review_votes(voter_user_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_vote_type ON reputation.review_votes(vote_type);

-- Add foreign key constraints
ALTER TABLE reputation.review_votes 
    ADD CONSTRAINT fk_review_votes_review_id 
    FOREIGN KEY (review_id) REFERENCES reputation.reviews(id) ON DELETE CASCADE;

ALTER TABLE reputation.review_votes 
    ADD CONSTRAINT fk_review_votes_voter_user_id 
    FOREIGN KEY (voter_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add unique constraint to prevent duplicate votes from same IP/user
CREATE UNIQUE INDEX IF NOT EXISTS idx_review_votes_unique_ip 
    ON reputation.review_votes(review_id, voter_ip) 
    WHERE voter_ip IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_review_votes_unique_user 
    ON reputation.review_votes(review_id, voter_user_id) 
    WHERE voter_user_id IS NOT NULL;
