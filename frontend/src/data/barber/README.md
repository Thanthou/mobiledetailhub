# Barber Shop Industry Data

Default content and configuration for barber shop tenants.

## Structure

```
barber/
├── content-defaults.json   - Text defaults for hero, reviews, FAQ sections
├── seo-defaults.json       - SEO metadata for home page
├── assets.json            - Image references (logos, hero, services)
├── defaults/
│   ├── content.json       - Detailed section content
│   ├── services.json      - Service descriptions (6 services)
│   ├── metadata.json      - Industry metadata
│   └── faq.json          - FAQ items by category
└── index.ts              - Exports for easy importing
```

## Services Included

1. **Classic Haircut** - Traditional men's haircut (30-45 min)
2. **Hot Towel Shave** - Straight razor shave experience (30-40 min)
3. **Beard Trim & Shaping** - Professional beard grooming (20-30 min)
4. **Fade Haircut** - Modern fade styles (45-60 min)
5. **Haircut & Shave Combo** - Complete grooming package (60-75 min)
6. **Kids Haircut** - Fun, patient cuts for children (15-25 min)

## Usage

```typescript
import { barberDefaults } from '@/data/barber';

// Access defaults
const heroText = barberDefaults.content.hero.h1;
const services = barberDefaults.services;
const faqItems = barberDefaults.faq;
```

## Assets Needed

You'll need to add these images to `frontend/public/barber/`:

- `images/hero/hero1.png` (and mobile version)
- `images/services/classic-haircut.png`
- `images/services/hot-towel-shave.png`
- `images/services/beard-trim.png`
- `images/services/fade-haircut.png`
- `icons/logo.png` (already exists)

