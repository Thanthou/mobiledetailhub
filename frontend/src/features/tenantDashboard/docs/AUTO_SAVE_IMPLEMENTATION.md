# Auto-Save Implementation Guide

This guide explains how to implement auto-save functionality across all dashboard tabs using the `useAutoSave` hook.

## Overview

The `useAutoSave` hook provides:
- **Debounced auto-saving** (default 800ms delay)
- **Loading states** for UI feedback
- **Error handling** with user-friendly messages
- **Prevents initial save** on component mount
- **Value synchronization** when initial data changes

## Implementation Pattern

### 1. Import Required Dependencies

```typescript
import { useAutoSave } from '@/shared/utils/useAutoSave';
import AutoSaveStatus from '../../components/AutoSaveStatus';
```

### 2. Create API Function

```typescript
const saveTabData = async (data: any) => {
  // TODO: Replace with actual API call
  console.log('Saving data:', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate occasional errors for testing
  if (Math.random() < 0.1) {
    throw new Error('Failed to save data. Please try again.');
  }
  
  return { success: true };
};
```

### 3. Initialize Auto-Save Hook

```typescript
const initialData = {
  // Your initial data structure
};

const { value: data, setValue: setData, isSaving, error } = useAutoSave(
  initialData,
  saveTabData,
  { debounce: 1000 } // Optional: customize debounce delay
);
```

### 4. Add Visual Feedback

```typescript
// In your component's header
<div>
  <h2 className="text-2xl font-bold text-white">Tab Title</h2>
  <p className="text-gray-400 mt-1">Tab description</p>
  <AutoSaveStatus isSaving={isSaving} error={error} />
</div>
```

### 5. Update Data Functions

```typescript
const updateData = (field: string, value: any) => {
  setData(prev => ({
    ...prev,
    [field]: value
  }));
};
```

## Tab-Specific Implementations

### Website Content Tab ✅
- **Status**: Implemented
- **Data**: Hero, Services, Reviews, FAQ, Gallery sections
- **API**: `saveWebsiteContent()`

### Website Performance Tab
- **Data**: Analytics settings, tracking codes, performance metrics
- **API**: `savePerformanceData()`

### Website Health Tab
- **Data**: Health check settings, monitoring preferences
- **API**: `saveHealthData()`

### Website Domain Tab
- **Data**: Domain settings, DNS records, SSL configuration
- **API**: `saveDomainData()`

### Locations Tab
- **Data**: Service areas, primary location, coverage settings
- **API**: `saveLocationData()`, `saveServiceAreas()`

### Profile Tab
- **Data**: Business information, contact details, settings
- **API**: `saveProfileData()`

## API Endpoints Needed

Create these backend endpoints to support auto-save:

```typescript
// Website Content
POST /api/tenants/:slug/website/content
PUT /api/tenants/:slug/website/content

// Website Performance
POST /api/tenants/:slug/website/performance
PUT /api/tenants/:slug/website/performance

// Website Health
POST /api/tenants/:slug/website/health
PUT /api/tenants/:slug/website/health

// Website Domain
POST /api/tenants/:slug/website/domain
PUT /api/tenants/:slug/website/domain

// Locations
POST /api/tenants/:slug/locations
PUT /api/tenants/:slug/locations

// Profile
POST /api/tenants/:slug/profile
PUT /api/tenants/:slug/profile
```

## Benefits

1. **Better UX**: No need to remember to save changes
2. **Data Safety**: Automatic saving prevents data loss
3. **Real-time Feedback**: Users see save status immediately
4. **Error Handling**: Clear error messages when saves fail
5. **Consistent Pattern**: Same implementation across all tabs

## Testing

- **Debounce Testing**: Type quickly and verify only one save request is made
- **Error Handling**: Simulate network errors to test error display
- **Loading States**: Verify loading indicators appear during saves
- **Data Persistence**: Refresh page and verify data is preserved

## Next Steps

1. ✅ Implement Website Content tab auto-save
2. 🔄 Implement remaining tabs
3. 🔄 Create backend API endpoints
4. 🔄 Add comprehensive error handling
5. 🔄 Implement data validation
6. 🔄 Add offline support
