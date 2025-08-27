# CSP-Safe JSON-LD Implementation

## Overview
This document describes the Content Security Policy (CSP) compliant JSON-LD implementation that ensures structured data loading without inline scripts.

## Implementation Details

### 1. Script Loading Strategy
- **Deferred Loading**: All JSON-LD related scripts use `defer` attribute
- **External Scripts**: No inline scripts; all logic moved to external files
- **Proper Ordering**: MDH config loads first, then JSON-LD loader

### 2. Files Structure

#### `frontend/index.html`
```html
<!-- JSON-LD placeholders (filled by loader) -->
<script type="application/ld+json" id="org-jsonld">{}</script>
<script type="application/ld+json" id="website-jsonld">{}</script>
<script type="application/ld+json" id="directory-jsonld">{}</script>

<!-- External scripts with defer -->
<script src="/js/mdh-config.js" defer></script>
<script src="/js/jsonld-loader.js" defer></script>
```

#### `frontend/public/js/mdh-config.js`
- Contains static MDH configuration
- Sets `window.__MDH__` object
- Loaded before JSON-LD loader

#### `frontend/public/js/jsonld-loader.js`
- Populates JSON-LD placeholders
- Waits for DOM and config to be ready
- Handles directory data loading

### 3. Security Features

#### CSP Compliance
- **No inline scripts**: All JavaScript moved to external files
- **Self-origin only**: Scripts served from same origin (`'self'`)
- **Deferred execution**: Scripts don't block page rendering

#### Backend CSP Configuration
```javascript
contentSecurityPolicy: {
  directives: {
    scriptSrc: ["'self'"],  // Allows /js/* scripts
    // ... other directives
  }
}
```

### 4. Loading Sequence

1. **HTML loads** with empty JSON-LD placeholders
2. **MDH config script** loads and sets `window.__MDH__`
3. **JSON-LD loader script** waits for DOM and config
4. **Loader populates** JSON-LD elements with structured data
5. **Directory data** fetched and added if available

### 5. Error Handling

#### Config Loading
- Retries if MDH config not available
- Graceful fallback for missing configuration
- Console warnings for debugging

#### DOM Ready
- Checks `document.readyState`
- Uses `DOMContentLoaded` event if needed
- Ensures proper initialization order

### 6. Testing

#### Manual Testing
1. Open browser console
2. Load page and check for JSON-LD content
3. Verify no CSP violations
4. Check structured data in browser dev tools

#### Test Script
```bash
# Add test script to index.html temporarily
<script src="/js/test-jsonld.js" defer></script>
```

### 7. Benefits

1. **CSP Compliant**: No inline scripts, external files only
2. **Performance**: Deferred loading doesn't block rendering
3. **Security**: Scripts from same origin only
4. **Maintainability**: Centralized configuration and loading logic
5. **SEO**: Proper structured data for search engines

### 8. Future Enhancements

- **Nonce support**: For additional CSP flexibility
- **Hash-based CSP**: For inline scripts if needed
- **Dynamic loading**: Based on page content
- **Error reporting**: CSP violation monitoring

## Usage

The JSON-LD implementation works automatically once the page loads. No additional configuration is needed.

### Verification

1. **Check Console**: No CSP violations
2. **View Source**: JSON-LD elements contain structured data
3. **Dev Tools**: Structured data tab shows organization and website info
4. **Google Rich Results**: Test with Google's testing tools

## Troubleshooting

### Common Issues

1. **Config not loaded**: Check script loading order
2. **CSP violations**: Verify script sources are from same origin
3. **Empty JSON-LD**: Check console for loader errors
4. **Performance**: Ensure scripts are properly deferred

### Debug Steps

1. Check browser console for errors
2. Verify script files are accessible
3. Confirm CSP configuration allows scripts
4. Test with simplified configuration

The implementation is now CSP-safe and follows security best practices while maintaining functionality.
