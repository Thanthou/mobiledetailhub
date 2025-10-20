# Website Schema Review

**Generated:** 2025-10-13  
**Database:** ThatSmartSite  
**Schema:** `website`  
**Priority:** Tier 1 (Basic content management)

---

## Overview

The `website` schema contains **1 table** for tenant website content:

| Table | Purpose | Status |
|-------|---------|--------|
| `content` | Editable website content for tenants | ⚠️ **NEEDS REDESIGN** |

---

## Table Review

### 1. `content` ⚠️

**Purpose:** Store customizable website content for each tenant.

**Schema File:** `backend/database/schemas/website/content.sql`

**Current Structure:**
```sql
id, tenant_slug (unique),
hero_title, hero_subtitle,
services_title, services_subtitle,
services_auto_description,      ← Mobile-detailing specific
services_marine_description,    ← Mobile-detailing specific
services_rv_description,        ← Mobile-detailing specific
services_ceramic_description,   ← Mobile-detailing specific
services_correction_description,← Mobile-detailing specific
services_ppf_description,       ← Mobile-detailing specific
reviews_title, reviews_subtitle,
reviews_avg_rating, reviews_total_count,
faq_title, faq_subtitle,
faq_content (JSONB),
created_at, updated_at
```

**Key Features:**
- ✅ One record per tenant (UNIQUE constraint on tenant_slug)
- ✅ FAQ as flexible JSONB
- ✅ Good indexes (tenant_slug, updated_at)
- ✅ Auto-update trigger

---

## 🔴 **Critical Issues**

### **1. Industry-Specific Hardcoded Columns**

**Problem:** Table is designed ONLY for mobile-detailing industry!

```sql
services_auto_description      -- Auto detailing (car)
services_marine_description    -- Marine detailing (boat)
services_rv_description        -- RV detailing
services_ceramic_description   -- Ceramic coating
services_correction_description-- Paint correction
services_ppf_description       -- Paint protection film
```

**What happens with other industries?**
- ❌ **Maid Service:** Doesn't need vehicle descriptions
- ❌ **Lawn Care:** Needs lawn/garden service types
- ❌ **Pet Grooming:** Needs pet grooming services
- ❌ **Barber Shops:** Needs haircut/styling services

**Impact:** This table **CANNOT support multi-industry platform** as designed!

---

### **2. Duplicate Indexes**

```sql
CREATE INDEX idx_content_tenant_slug ...
CREATE INDEX idx_website_content_tenant_slug ... ← DUPLICATE!

CREATE INDEX idx_content_updated_at ...
CREATE INDEX idx_website_content_updated_at ...  ← DUPLICATE!
```

**Impact:** Wastes storage, slows down writes

---

### **3. Missing Foreign Key to Business**

```sql
tenant_slug VARCHAR(255) NOT NULL  -- No FK constraint
```

**Impact:** 
- Can't enforce referential integrity
- Orphaned content records possible
- Less efficient joins

---

### **4. Cached Review Stats (Redundant)**

```sql
reviews_avg_rating NUMERIC(3,2)
reviews_total_count INTEGER DEFAULT 0
```

**Problem:** Review stats should be calculated from `reputation.reviews` table, not cached here.

**Issues:**
- Data duplication
- Can get out of sync
- Extra work to keep updated

**Better approach:** Calculate on-the-fly or use a database view.

---

## 💡 **Recommended Redesign**

### **Option A: Flexible JSONB Approach** ✅ RECOMMENDED

**New structure:**
```sql
CREATE TABLE website.content (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Hero Section
    hero JSONB DEFAULT '{}', -- { "title": "...", "subtitle": "...", "cta_text": "..." }
    
    -- Services Section
    services JSONB DEFAULT '{}', -- { "title": "...", "subtitle": "...", "items": [...] }
    
    -- Reviews Section
    reviews JSONB DEFAULT '{}', -- { "title": "...", "subtitle": "..." }
    
    -- FAQ Section
    faq JSONB DEFAULT '{}', -- { "title": "...", "subtitle": "...", "items": [...] }
    
    -- Gallery Section
    gallery JSONB DEFAULT '{}', -- { "title": "...", "subtitle": "..." }
    
    -- Footer Content
    footer JSONB DEFAULT '{}', -- { "tagline": "...", "about": "..." }
    
    -- SEO/Meta
    seo JSONB DEFAULT '{}', -- { "title": "...", "description": "...", "keywords": [...] }
    
    -- Custom Sections (future extensibility)
    custom_sections JSONB DEFAULT '[]', -- [ { "name": "...", "content": {...} } ]
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_content_business_id UNIQUE(business_id)
);

-- Indexes
CREATE INDEX idx_content_business_id ON website.content(business_id);
CREATE INDEX idx_content_updated_at ON website.content(updated_at);
```

**Benefits:**
- ✅ Works for **ALL industries** (no hardcoded service types)
- ✅ Flexible structure (add new sections without migrations)
- ✅ Clean separation of concerns
- ✅ No duplicate data (remove review stats)
- ✅ Proper foreign key to business table
- ✅ Industry-agnostic

---

### **Option B: Keep Current + Add JSONB Fallback**

Keep existing columns for backward compatibility, add `custom_content JSONB` for new industries.

**Pros:** No migration pain  
**Cons:** Technical debt, messy structure

---

## 🎯 **Recommendation:**

### **Redesign the `website.content` table** (Migration 007)

**Why:**
- Current design blocks multi-industry support
- You're early enough to make this change
- Better long-term architecture
- Clean, flexible structure

**What to do:**
1. Create migration 007 to redesign `website.content`
2. Migrate existing data (if any) to new JSONB structure
3. Update schema file
4. Update backend API to use new structure
5. Update frontend to read from JSONB fields

---

## ⚠️ **Decision Required:**

**Do you want to:**

**A)** **Redesign now** (30 minutes work, cleaner future)  
**B)** **Keep current structure** (works for mobile-detailing only)  
**C)** **Hybrid approach** (add JSONB columns, keep existing)  

**My strong recommendation:** **Option A** - Redesign now while you have no production data. This prevents major refactoring later when you add more industries.

What do you think? 🤔
