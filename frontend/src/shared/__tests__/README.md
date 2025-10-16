# SEO Module Tests

This directory contains comprehensive tests for the shared SEO modules as part of Problem 17 implementation.

## Test Coverage

### Frontend Tests (`frontend/src/shared/`)

#### `utils/__tests__/schemaUtils.test.ts`
Tests for Schema.org structured data generation:
- `generateSchemaImages()` - Image filtering by role
- `generateLocationSchema()` - LocalBusiness schema generation
- `generateOrganizationSchema()` - Organization schema generation
- `generateWebsiteSchema()` - Website schema with search action
- `generateWebPageSchema()` - WebPage schema for different page types
- `generateFAQSchema()` - FAQPage schema from FAQ items
- `generateAllSchemas()` - Complete schema generation orchestration

#### `utils/__tests__/faqSchemaBuilder.test.ts`
Tests for FAQ schema building utilities:
- `buildLocationFAQSchema()` - Location-specific FAQ schema generation
- `validateFAQSchemaCompleteness()` - FAQ data validation
- `generateFAQSchemaManifest()` - FAQ schema manifest generation

#### `utils/__tests__/siteUtils.test.ts`
Tests for site utility functions:
- `getAbsoluteUrl()` - Relative to absolute URL conversion
- `formatSEO()` - SEO data formatting and URL generation

#### `hooks/__tests__/useSEO.test.tsx`
Tests for the useSEO React hook:
- Default behavior with no options
- Custom options handling
- Skip flags for browser tab and meta tag updates
- Partial options handling

### Backend Tests (`backend/routes/__tests__/`)

#### `seo.test.js`
Tests for SEO API endpoints:
- `GET /robots.txt` - Robots.txt generation for different domains
- `GET /sitemap.xml` - Sitemap XML generation with tenant data
- Error handling and fallback behavior
- Cache headers and content type validation

## Running Tests

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm run test:ui            # Run with UI
npm test schemaUtils       # Run specific test file
```

### Backend Tests
```bash
cd backend
npm test                   # Run all tests
npm test seo              # Run SEO route tests
```

## Test Setup

The tests use:
- **Vitest** for frontend testing with React Testing Library
- **Jest** for backend testing with Supertest
- **Mocked dependencies** for database, logger, and browser APIs
- **Comprehensive fixtures** for realistic test data

## Key Test Scenarios

1. **Schema Generation**: Validates proper Schema.org structure and required fields
2. **URL Handling**: Tests relative/absolute URL conversion and domain handling
3. **Error Handling**: Ensures graceful fallbacks when data is missing
4. **SEO Metadata**: Validates proper meta tag and Open Graph generation
5. **API Endpoints**: Tests HTTP responses, headers, and XML generation
6. **Edge Cases**: Handles empty data, malformed input, and missing dependencies

## Mock Data

Tests use realistic mock data that mirrors production structure:
- Complete `MainSiteConfig` objects
- Valid `LocationPage` data with service areas
- FAQ items with proper structure
- Tenant data with service areas and approval status

## Coverage Goals

- ✅ 100% function coverage for schema utilities
- ✅ 100% branch coverage for error handling
- ✅ Edge case testing for malformed data
- ✅ Integration testing for React hooks
- ✅ API endpoint testing with various scenarios

This test suite ensures the SEO modules are robust, maintainable, and production-ready.
