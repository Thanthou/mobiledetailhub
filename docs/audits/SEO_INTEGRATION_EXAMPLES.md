# SEO Integration Examples

## 🔧 How to Integrate New SEO Components

### 1. Replace useSEO with SeoHead Component

**Before (HomePage.tsx):**
```tsx
// Update SEO metadata (title, description, etc.)
useSEO();
```

**After:**
```tsx
import { SeoHead } from '@/shared/components/seo/SeoHead';

// Replace useSEO() with SeoHead component
<SeoHead 
  title="Professional Mobile Detailing Services"
  description="Expert mobile detailing for cars, boats, and RVs. Paint correction, ceramic coating, and deep cleaning services."
/>
```

### 2. Add Preview Detection to ServicePage

**Current ServicePage.tsx:**
```tsx
const ServicePage: React.FC<ServicePageProps> = ({ onRequestQuote }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  
  // If token is present, we're in preview mode
  const { payload } = usePreviewParams();
```

**Enhanced with SEO:**
```tsx
import { SeoHead } from '@/shared/components/seo/SeoHead';

const ServicePage: React.FC<ServicePageProps> = ({ onRequestQuote }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  
  // If token is present, we're in preview mode
  const { payload } = usePreviewParams();
  const isPreview = !!token;

  return (
    <>
      <SeoHead 
        title={`${serviceData.title} - Professional Mobile Detailing`}
        description={serviceData.description}
        isPreview={isPreview} // Automatically adds noindex for previews
      />
      {/* Rest of component */}
    </>
  );
};
```

### 3. Enhance LocationPage with Better SEO

**Current LocationPage.tsx:**
```tsx
// Update meta tags for SEO
useMetaTags({
  title: area.seo.title,
  description: area.seo.description,
  ogImage: area.seo.ogImage ?? area.images?.[0]?.url,
  twitterImage: area.seo.twitterImage ?? area.seo.ogImage ?? area.images?.[0]?.url,
  canonicalPath: area.seo.canonicalPath,
});
```

**Enhanced with SeoHead:**
```tsx
import { SeoHead } from '@/shared/components/seo/SeoHead';

// Replace useMetaTags with SeoHead
<SeoHead
  title={area.seo.title}
  description={area.seo.description}
  ogImage={area.seo.ogImage ?? area.images?.[0]?.url}
  twitterImage={area.seo.twitterImage ?? area.seo.ogImage ?? area.images?.[0]?.url}
  canonicalPath={area.seo.canonicalPath}
  keywords={generateLocationKeywords('mobile-detailing', area.city, area.stateCode)}
/>
```

### 4. Add Analytics Tracking

**In Quote Request Components:**
```tsx
import { useAnalytics } from '@/shared/hooks/useAnalytics';

const QuoteModal = () => {
  const analytics = useAnalytics();

  const handleQuoteSubmit = () => {
    // Track conversion
    analytics.trackConversion({
      conversion_type: 'quote_request',
      conversion_value: 150,
      currency: 'USD'
    });
    
    // Existing quote logic...
  };

  return (
    // Modal JSX...
  );
};
```

**In CTA Buttons:**
```tsx
import { useAnalytics } from '@/shared/hooks/useAnalytics';

const SmartCTAButtons = ({ onRequestQuote, onBookNow }) => {
  const analytics = useAnalytics();

  const handleQuoteClick = () => {
    analytics.trackEvent({
      event: 'cta_click',
      parameters: { 
        button_type: 'quote_request',
        page: 'home'
      }
    });
    onRequestQuote();
  };

  return (
    <button onClick={handleQuoteClick}>
      Request a Quote
    </button>
  );
};
```

### 5. Replace Image Components

**Before:**
```tsx
<img src="/images/hero.jpg" alt="Mobile detailing service" />
```

**After:**
```tsx
import { OptimizedImage } from '@/shared/components/seo/OptimizedImage';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Professional mobile detailing service"
  width={1920}
  height={1080}
  type="hero"
  isAboveFold
  seoContext={{ 
    business: "ABC Detailing", 
    location: "Austin, TX",
    service: "mobile detailing"
  }}
/>
```

## 🚀 Quick Integration Checklist

### Phase 1: Core Pages (Priority 1)
- [ ] **HomePage.tsx** - Replace `useSEO()` with `<SeoHead />`
- [ ] **ServicePage.tsx** - Add preview detection and SEO
- [ ] **LocationPage.tsx** - Replace `useMetaTags` with `<SeoHead />`

### Phase 2: Components (Priority 2)
- [ ] **Quote Modal** - Add analytics tracking
- [ ] **CTA Buttons** - Add event tracking
- [ ] **Hero Images** - Replace with `<OptimizedImage />`

### Phase 3: Advanced Features (Priority 3)
- [ ] **Gallery Images** - Optimize with lazy loading
- [ ] **Service Images** - Add responsive handling
- [ ] **Analytics Dashboard** - Connect to backend

## 🔍 Testing Your Integration

### 1. Test Robots.txt
```bash
curl https://your-domain.com/robots.txt
curl https://preview.your-domain.com/robots.txt
```

### 2. Test Sitemap
```bash
curl https://your-domain.com/sitemap.xml
```

### 3. Test Meta Tags
- View page source
- Check for proper `<title>`, `<meta description>`, `<canonical>`
- Verify `robots` meta tag for preview pages

### 4. Test Analytics
- Open browser dev tools
- Check for analytics events in Network tab
- Verify conversion tracking works

## 📊 Expected Results

After integration, you should see:

1. **Better SEO Scores**
   - Proper meta tags on all pages
   - Optimized images with lazy loading
   - Structured data for rich snippets

2. **Improved Performance**
   - Faster image loading
   - Better Core Web Vitals
   - Reduced bundle size

3. **Enhanced Analytics**
   - Conversion tracking
   - User behavior insights
   - Performance monitoring

4. **Search Engine Optimization**
   - Proper robots.txt for crawlers
   - Dynamic sitemaps
   - Preview page blocking
