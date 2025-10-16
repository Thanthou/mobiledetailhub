# SEO Module

This directory contains all SEO-related functionality for the application. This module anchors Cursor's understanding of SEO architecture and ensures consistent SEO implementation across all features.

## Architecture

- **SeoHead.tsx** - Centralized head management component
- **jsonld.ts** - JSON-LD structured data utilities  
- **imageOptimization.ts** - Image optimization utilities
- **industryDefaults.ts** - Industry-specific SEO defaults
- **OptimizedImage.tsx** - SEO-optimized image component
- **index.ts** - Barrel exports for clean imports

## Usage

```tsx
// Import from the SEO module
import { SeoHead, OptimizedImage, useAnalytics } from '@/shared/seo';

// Use in components
<SeoHead 
  title="Page Title"
  description="Page description"
  isPreview={isPreview}
/>
```

## Cursor Integration

This module structure ensures Cursor will:
- Route all SEO edits through these shared utilities
- Avoid duplicating meta tags across pages
- Use consistent structured data generation
- Maintain proper image optimization patterns

## Database Integration

SEO configuration is stored in `website.seo_config` table, allowing for:
- Tenant-specific SEO overrides
- Analytics configuration per tenant
- JSON-LD customizations
- Dynamic meta tag generation
