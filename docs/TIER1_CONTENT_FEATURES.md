# Tier 1 Content Features

**Platform:** ThatSmartSite  
**Tier:** Starter, Pro, Enterprise (All Plans)  
**Updated:** 2025-10-13

---

## 📝 **What Tenants Can Edit (Tier 1)**

### **Header Branding** 🎨
- **Logo:** Upload custom logo (appears in header)
- **Icon/Favicon:** Upload custom icon (browser tab, mobile home screen)
- **Fallback:** If no logo uploaded, show business name as text

**Database Fields:**
```sql
header_logo_url VARCHAR(500)
header_icon_url VARCHAR(500)
```

**File Storage:**
- Location: `backend/uploads/logos/` or cloud storage
- Formats: PNG, JPG, SVG (logo), ICO/PNG (icon)
- Size limits: Logo ≤ 2MB, Icon ≤ 500KB

---

### **Hero Section** 🦸
- **Title:** Main headline (e.g., "Professional Mobile Detailing in Phoenix")
- **Subtitle:** Supporting text (e.g., "Premium auto detailing at your doorstep")
- **Fallback:** Industry template provides defaults

**Database Fields:**
```sql
hero_title VARCHAR(500)
hero_subtitle TEXT
```

**Example Defaults:**
```
Mobile Detailing:
  Title: "Professional Mobile Detailing in {City}"
  Subtitle: "Premium auto detailing services at your doorstep"

Maid Service:
  Title: "Professional House Cleaning in {City}"
  Subtitle: "Trusted, reliable cleaning services for your home"

Lawn Care:
  Title: "Expert Lawn Care Services in {City}"
  Subtitle: "Keep your lawn healthy and beautiful year-round"
```

---

### **Reviews Section** ⭐
- **Title:** Section headline (e.g., "What Our Customers Say")
- **Subtitle:** Supporting text (e.g., "See why customers love our service")
- **Fallback:** Generic defaults

**Database Fields:**
```sql
reviews_title VARCHAR(255)
reviews_subtitle TEXT
```

**Note:** Review stats (average rating, count) are calculated from `reputation.reviews` table, not stored here.

---

### **FAQ Section** ❓
- **Title:** Section headline (e.g., "Frequently Asked Questions")
- **Subtitle:** Intro text (e.g., "Got questions? We've got answers")
- **FAQ Items:** Array of question/answer pairs

**Database Fields:**
```sql
faq_title VARCHAR(255)
faq_subtitle TEXT
faq_items JSONB  -- [{ question, answer }, ...]
```

**Example FAQ Items:**
```json
[
  {
    "category": "Services",
    "question": "How long does the service take?",
    "answer": "Typically 2-4 hours depending on the scope of work."
  },
  {
    "category": "Services",
    "question": "Do you come to my location?",
    "answer": "Yes! We're fully mobile and come to you."
  },
  {
    "category": "Pricing",
    "question": "What forms of payment do you accept?",
    "answer": "We accept cash, credit cards, and digital payments."
  },
  {
    "category": "Pricing",
    "question": "Do you offer discounts?",
    "answer": "Yes! We offer discounts for recurring services and referrals."
  },
  {
    "category": "Scheduling",
    "question": "How far in advance should I book?",
    "answer": "We recommend booking at least 48 hours in advance."
  }
]
```

**Common Categories:**
- `"Services"` - What you offer, how it works
- `"Pricing"` - Payment, discounts, refunds
- `"Scheduling"` - Booking, availability, cancellations
- `"General"` - Miscellaneous questions

---

## 🎨 **Tier 1 Branding/Customization Summary**

### **What's Included:**
✅ **Header:** Custom logo + icon/favicon  
✅ **Hero:** Custom title + subtitle  
✅ **Reviews:** Custom section title + subtitle  
✅ **FAQ:** Custom title, subtitle, and all Q&A pairs  

### **What's NOT Included (Industry Templates Handle):**
❌ **Services:** Service names, descriptions, pricing (from industry template)  
❌ **Gallery:** Images (tier 2/3 feature)  
❌ **Footer:** Content (uses defaults)  
❌ **Color Scheme:** Branding colors (tier 2/3 feature)  

---

## 💾 **File Upload Strategy (Tier 1)**

### **Logo/Icon Files:**

**Storage Options:**
1. **Local Storage** (Simple, tier 1)
   - Path: `backend/uploads/branding/{business_slug}/`
   - Files: `logo.png`, `icon.png`
   - URL: `/uploads/branding/{slug}/logo.png`

2. **Cloud Storage** (Tier 2/3)
   - AWS S3, Cloudinary, etc.
   - CDN delivery
   - Better performance

**Recommendation for Tier 1:** Local storage, upgrade to cloud later.

---

## 🔧 **Database Schema:**

```sql
CREATE TABLE website.content (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Tier 1: Branding
    header_logo_url VARCHAR(500),
    header_icon_url VARCHAR(500),
    
    -- Tier 1: Editable Text
    hero_title VARCHAR(500),
    hero_subtitle TEXT,
    reviews_title VARCHAR(255),
    reviews_subtitle TEXT,
    faq_title VARCHAR(255),
    faq_subtitle TEXT,
    faq_items JSONB DEFAULT '[]',
    
    -- Future Extensibility
    custom_sections JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_content_business_id UNIQUE(business_id)
);
```

---

## 🎯 **Content Fallback Strategy**

### **Priority Order:**
1. **Custom content** (from `website.content` table)
2. **Industry defaults** (from `frontend/src/data/{industry}/site.json`)
3. **Generic defaults** (from app config)

### **Example: Hero Title**
```javascript
// Backend API response
const heroTitle = 
  content.hero_title ||                    // 1. Custom (if set)
  industryDefaults.hero.title ||           // 2. Industry template
  `Professional ${industry} in ${city}`;   // 3. Generic fallback
```

---

## 📋 **Tier 1 Feature Checklist**

### **Onboarding Flow:**
- [ ] Collect business name, industry, location
- [ ] Allow logo upload (optional)
- [ ] Allow icon upload (optional)
- [ ] Provide default hero text (editable later)
- [ ] Provide default FAQ items (editable later)
- [ ] Generate preview with custom branding

### **Tenant Dashboard:**
- [ ] Edit hero title/subtitle
- [ ] Edit reviews title/subtitle
- [ ] Edit FAQ title/subtitle
- [ ] Add/edit/remove FAQ items
- [ ] Upload/replace logo
- [ ] Upload/replace icon
- [ ] Preview changes before publishing

### **Frontend Display:**
- [ ] Show custom logo in header (or business name if no logo)
- [ ] Show custom icon in browser tab
- [ ] Display custom hero text (or template defaults)
- [ ] Display custom review section text
- [ ] Display custom FAQ items (or template defaults)

---

## 🚀 **Backend API Endpoints Needed**

```javascript
// Content Management
GET    /api/content/:slug              // Get content by business slug
PUT    /api/content/:slug              // Update content
POST   /api/content/:slug/logo         // Upload logo
DELETE /api/content/:slug/logo         // Remove logo
POST   /api/content/:slug/icon         // Upload icon
DELETE /api/content/:slug/icon         // Remove icon

// FAQ Management
GET    /api/content/:slug/faq          // Get FAQ items
PUT    /api/content/:slug/faq          // Update FAQ items
POST   /api/content/:slug/faq          // Add FAQ item
DELETE /api/content/:slug/faq/:id      // Remove FAQ item
```

---

**This tier 1 feature set gives tenants:**
- ✅ Custom branding (logo + icon)
- ✅ Custom messaging (hero, reviews, FAQ)
- ✅ Professional appearance
- ✅ Easy to edit
- ❌ No complex image galleries (tier 2/3)
- ❌ No color customization (tier 2/3)

**Perfect balance for starter tier!** 🎯

