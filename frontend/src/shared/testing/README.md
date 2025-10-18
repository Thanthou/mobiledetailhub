# Shared Testing Utilities

This folder contains testing utilities and helpers that can be used across all features and apps.

## Structure

- `setup.ts` - Test setup and configuration
- `mocks/` - Shared mock data and functions
- `helpers/` - Testing helper functions
- `fixtures/` - Test data fixtures

## Usage

```typescript
import { renderWithProviders } from '@/shared/testing/setup';
import { mockTenantData } from '@/shared/testing/mocks/tenant';
```

## Guidelines

- Keep testing utilities framework-agnostic when possible
- Use descriptive names for test helpers
- Document complex testing scenarios
- Share common mocks and fixtures across features
