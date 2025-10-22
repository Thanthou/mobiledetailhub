# Main Marketing Site Config

**Purpose:** JSON-based configuration for That Smart Site marketing/showcase experience (Tenant-0)

---

## Structure

```
main/
├── index.ts                 # Config loader/assembler
├── assets.json              # Logo, hero images, marketing visuals
├── content.json             # Marketing copy, CTAs, feature descriptions
└── seo.json                 # SEO metadata for main site
```

---

## How It Works

The `loadMainSiteConfig()` function assembles modular JSON files into a `MainSiteConfig` object that's compatible with the same interface tenant sites use.

**This means:** Marketing site can use the SAME components as tenant sites (Hero, Services, etc.) but with marketing-focused content.

---

## Usage

```typescript
import { loadMainSiteConfig } from '@data/main';

const config = loadMainSiteConfig();
// Returns: MainSiteConfig with marketing content
```

---

## Editing Content

### Hero Section
Edit `content.json`:
```json
{
  "hero": {
    "h1": "Your main headline",
    "subTitle": "Your subtitle",
    "cta": {
      "primary": { "label": "Get Started", "href": "/onboard" }
    }
  }
}
```

### Features
Edit `content.json`:
```json
{
  "features": [
    { "title": "Feature Name", "description": "...", "icon": "..." }
  ]
}
```

### SEO
Edit `seo.json`:
```json
{
  "title": "Page title for Google",
  "description": "Meta description",
  "keywords": "comma, separated, keywords"
}
```

---

## Future: Cinematic Showcase

When adding scroll-based component showcase, add to `content.json`:

```json
{
  "showcase": {
    "sections": [
      {
        "id": "hero",
        "title": "Hero Component Showcase",
        "description": "See how the hero section works..."
      }
    ]
  }
}
```

---

See: [Mobile Detailing Config](../mobile-detailing/README.md) for similar modular approach

