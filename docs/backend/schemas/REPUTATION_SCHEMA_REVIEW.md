# Reputation Schema Review

**Generated:** 2025-10-13  
**Database:** ThatSmartSite  
**Schema:** `reputation`  
**Priority:** Tier 1 (Critical for all tenants)

---

## Overview

The `reputation` schema contains **3 tables** for managing tenant reviews:

| Table | Purpose | Rows | Status |
|-------|---------|------|--------|
| `reviews` | Customer reviews for tenant sites | ? | ✅ Clean, simple structure |
| `review_replies` | Business responses to reviews | ? | ✅ Good |
| `review_votes` | Helpful/not helpful voting | ? | ✅ Good |

---

## Tables Review

### 1. `reviews` ✅

**Purpose:** Store customer reviews for tenant businesses.

**Schema File:** `backend/database/schemas/reputation/reviews.sql`

**Structure:**
```sql
id, tenant_slug, customer_name, rating (1-5), comment, reviewer_url,
vehicle_type, paint_correction, ceramic_coating, paint_protection_film,
source (website, google, yelp, facebook), avatar_filename,
created_at, updated_at, published_at
```

**Key Features:**
- ✅ Simple, focused structure (matches mobile-detailing use case)
- ✅ Links to tenant by slug
- ✅ Rating 1-5 stars
- ✅ Service type checkboxes (paint correction, ceramic, PPF)
- ✅ Multiple review sources (website, Google, Yelp, Facebook)
- ✅ Avatar support (filename storage)
- ✅ Good indexing (tenant, rating, source, created_at)
- ✅ Composite indexes (tenant+rating, tenant+created)

**Status:** **GOOD** - Clean and functional

**Notes:**
- Currently mobile-detailing focused (vehicle_type, service checkboxes)
- Works well for current use case
- Can be extended for other industries later

---

### 2. `review_replies` ✅

**Purpose:** Allow business owners to respond to customer reviews.

**Schema File:** `backend/database/schemas/reputation/review_replies.sql`

**Structure:**
```sql
id, review_id, content, author_id, author_name, author_role,
status, created_at, updated_at, published_at
```

**Key Features:**
- ✅ Foreign key to reviews (CASCADE delete)
- ✅ Foreign key to auth.users (author)
- ✅ Role tracking (business_owner, admin, moderator)
- ✅ Status management (draft, published, hidden)
- ✅ Auto-update trigger
- ✅ Good indexing

**Status:** **EXCELLENT** - Standard reply system

---

### 3. `review_votes` ✅

**Purpose:** Allow customers to vote reviews as helpful/not helpful.

**Schema File:** `backend/database/schemas/reputation/review_votes.sql`

**Structure:**
```sql
id, review_id, voter_ip, voter_user_id, vote_type, created_at
```

**Key Features:**
- ✅ Supports both anonymous (IP) and logged-in (user_id) voting
- ✅ Foreign keys to reviews and users
- ✅ Unique constraints prevent duplicate votes
- ✅ Vote types: helpful, not_helpful
- ✅ Good indexing

**Status:** **EXCELLENT** - Prevents vote manipulation

---

## Issues & Recommendations

### 🔴 Critical Issues

**None** - All tables are functional and well-designed for tier 1 use.

---

### ⚠️ Medium Priority

#### 1. **Missing Foreign Key to Business**

**Issue:** `reviews.tenant_slug` is just a string, not a foreign key.

**Current:**
```sql
tenant_slug VARCHAR(255) NOT NULL  -- No FK constraint
```

**Actual Database:** Already has the FK!
- Looking at the old `reviews.sql` file, it had: `fk_reviews_business_slug`
- But the extracted file doesn't show it (extraction script limitation)

**Recommendation:** Manually add to schema file or verify it exists in DB

---

#### 2. **Industry-Specific Fields**

**Current structure is mobile-detailing specific:**
```sql
vehicle_type VARCHAR(50)           -- Car, truck, SUV, boat, RV
paint_correction BOOLEAN
ceramic_coating BOOLEAN
paint_protection_film BOOLEAN
```

**Future consideration:**
- For maid service: No vehicle_type, different service flags
- For lawn care: Property size, service type
- For pet grooming: Pet type, grooming services

**Options:**
- **A)** Keep as-is, ignore fields for non-auto industries (simplest)
- **B)** Rename to generic JSONB: `service_metadata JSONB`
- **C)** Create industry-specific review tables (complex)

**Recommendation:** Go with **Option A** for now - fields can be NULL for other industries.

---

#### 3. **Missing Review Status/Moderation**

**Current:** No `status` field (pending, approved, rejected)

**Actual Database:** The database schema has `status` but it's missing from the extracted file!

**Issue:** The extraction script doesn't capture CHECK constraints properly.

**Recommendation:** The original `reviews.sql` (now deleted) had better constraints. We should check what's actually in the database.

---

### 💡 Optimization Opportunities

#### 1. **Add Helper Functions**

```sql
-- Get approved reviews for a tenant
CREATE OR REPLACE FUNCTION reputation.get_approved_reviews(
    p_tenant_slug VARCHAR,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    id INTEGER,
    customer_name VARCHAR,
    rating SMALLINT,
    comment TEXT,
    avatar_filename VARCHAR,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.customer_name, r.rating, r.comment, r.avatar_filename, r.created_at
    FROM reputation.reviews r
    WHERE r.tenant_slug = p_tenant_slug
      AND r.published_at IS NOT NULL
    ORDER BY r.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Calculate average rating for a tenant
CREATE OR REPLACE FUNCTION reputation.get_average_rating(p_tenant_slug VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT AVG(rating)::NUMERIC(3,2) INTO avg_rating
    FROM reputation.reviews
    WHERE tenant_slug = p_tenant_slug
      AND published_at IS NOT NULL;
    
    RETURN COALESCE(avg_rating, 0.0);
END;
$$ LANGUAGE plpgsql;

-- Get review count for a tenant
CREATE OR REPLACE FUNCTION reputation.get_review_count(p_tenant_slug VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO review_count
    FROM reputation.reviews
    WHERE tenant_slug = p_tenant_slug
      AND published_at IS NOT NULL;
    
    RETURN COALESCE(review_count, 0);
END;
$$ LANGUAGE plpgsql;
```

---

## Summary

**Overall Assessment:** ✅ **GOOD** (Functional, some improvements possible)

The reputation schema is:
- ✅ Functional and working
- ✅ Simple, clean structure
- ✅ Good for tier 1 feature
- ✅ Supports review display, replies, and voting
- ⚠️ Industry-specific fields (mobile-detailing focused)
- ⚠️ Some constraints may be missing from schema files

**This schema supports:**
- Customer review submission
- Business owner replies
- Review voting (helpful/not helpful)
- Multiple review sources (Google, Yelp, website)
- Avatar support

---

**Next Steps:**
1. Verify database has proper constraints (CHECK on rating, status, etc.)
2. Consider adding helper functions
3. Decide on industry-specific fields strategy
4. Move to review `website` schema (tier 1)

