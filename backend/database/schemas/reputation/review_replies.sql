-- Review replies table for business responses to reviews
DROP TABLE IF EXISTS reputation.review_replies CASCADE;

CREATE TABLE reputation.review_replies (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    
    -- Reply content
    content TEXT NOT NULL,
    
    -- Reply author (business owner or admin)
    author_id INTEGER NOT NULL, -- References auth.users.id
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(50) NOT NULL DEFAULT 'business_owner' CHECK (author_role IN ('business_owner', 'admin', 'moderator')),
    
    -- Reply status
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_review_replies_review_id ON reputation.review_replies(review_id);
CREATE INDEX IF NOT EXISTS idx_review_replies_author_id ON reputation.review_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_review_replies_status ON reputation.review_replies(status);
CREATE INDEX IF NOT EXISTS idx_review_replies_created_at ON reputation.review_replies(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION reputation.update_review_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_review_replies_updated_at
    BEFORE UPDATE ON reputation.review_replies
    FOR EACH ROW
    EXECUTE FUNCTION reputation.update_review_replies_updated_at();

-- Add foreign key constraints
ALTER TABLE reputation.review_replies 
    ADD CONSTRAINT fk_review_replies_review_id 
    FOREIGN KEY (review_id) REFERENCES reputation.reviews(id) ON DELETE CASCADE;

ALTER TABLE reputation.review_replies 
    ADD CONSTRAINT fk_review_replies_author_id 
    FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;
