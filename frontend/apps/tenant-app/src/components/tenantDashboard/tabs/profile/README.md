# Profile Tab - Subtabs Implementation

**Date:** 2025-10-25  
**Status:** ✅ Complete

## Overview

The Profile tab uses a **subtabs pattern** to organize business information into focused sections. Each subtab has its own form and save button for simple, independent updates.

## Structure

```
Profile Tab
├── 👤 Personal      (First Name, Last Name, Personal Email, Personal Phone)
├── 🏢 Business      (Business Name, Email, Phone, Website, Start Date)
└── 📱 Social Media  (Facebook, Instagram, YouTube, TikTok, GBP)
```

## Components

### SubTabNavigation
Clean tab navigation with icons and active states.

**Location:** `components/SubTabNavigation.tsx`

### PersonalSubTab
Manage personal contact information.

**Fields:**
- First Name
- Last Name  
- Personal Email
- Personal Phone

**Location:** `components/PersonalSubTab.tsx`

### BusinessSubTab
Manage business details and contact info.

**Fields:**
- Business Name (required)
- Business Email (required)
- Business Phone (required)
- Website
- Business Start Date

**Location:** `components/BusinessSubTab.tsx`

### SocialMediaSubTab
Connect social media profiles.

**Fields:**
- Google Business Profile
- Facebook
- Instagram
- YouTube
- TikTok

**Location:** `components/SocialMediaSubTab.tsx`

## Features

✅ **Single column layout** - Mobile-first, clean design  
✅ **Independent saves** - Each subtab saves separately  
✅ **Change detection** - Save button only active when changed  
✅ **Success feedback** - Green banner confirms save  
✅ **Error handling** - Clear error messages  
✅ **Cancel button** - Revert unsaved changes  
✅ **Phone formatting** - Auto-formats phone numbers  
✅ **Authentication** - Includes credentials in API calls  

## User Experience

### Save Flow
1. User navigates to subtab
2. Updates one or more fields
3. Save button becomes active (orange)
4. Click "Save Changes"
5. Shows "Saving..." state
6. Success banner appears for 3 seconds
7. Save button becomes inactive

### Cancel Flow
1. User makes changes
2. Clicks "Cancel"
3. Form reverts to original values
4. Save button becomes inactive

### Mobile Optimization
- Single column layout (no breakpoints needed)
- Touch-friendly inputs (larger tap targets)
- Horizontal scrollable tabs on small screens
- Maximum width constrained (`max-w-2xl`)

## API Integration

### Authentication
All API calls include `credentials: 'include'` to send auth cookies:

```typescript
const response = await fetch(`${config.apiUrl}/api/tenants/${slug}`, {
  credentials: 'include',
  // ...
});
```

### Endpoints

**GET** `/api/tenants/:slug` - Fetch business data  
**PUT** `/api/tenants/:slug` - Update business data

### Update Strategy
Only sends changed fields (partial updates):

```typescript
const updateData = {
  first_name: firstName,
  last_name: lastName,
  // ... only changed fields
};
```

## Design Decisions

### Why Subtabs?
- ✅ **Smaller components** - Easier to maintain
- ✅ **Focused editing** - One section at a time
- ✅ **Independent saves** - No complex form state
- ✅ **Lazy loading ready** - Can optimize later
- ✅ **Scalable** - Easy to add more subtabs

### Why Manual Save?
- ✅ **Clear feedback** - Users know when data is saved
- ✅ **Control** - Users decide when to commit
- ✅ **Fewer API calls** - Save once, not per field
- ✅ **Standard UX** - Matches industry patterns (Stripe, Shopify)
- ✅ **Better error handling** - Validate before save

### Why Single Column?
- ✅ **Mobile-first** - Works on all screen sizes
- ✅ **Clarity** - Natural top-to-bottom flow
- ✅ **Accessibility** - Screen reader friendly
- ✅ **Less code** - No responsive breakpoints

## Future Enhancements

Potential improvements:
- [ ] Field validation (email format, phone format, URL format)
- [ ] Required field indicators (*)
- [ ] Unsaved changes warning (prevent navigation)
- [ ] Keyboard shortcuts (Cmd+S to save)
- [ ] Optimistic updates (instant UI feedback)
- [ ] Undo/redo functionality
- [ ] Auto-save as optional toggle

## Related Files

**Hooks:**
- `hooks/useProfileData.ts` - Data fetching and updates
- `hooks/useAutoSaveField.ts` - Legacy auto-save (not used in subtabs)

**Utilities:**
- `@shared/utils` - Phone formatting helpers

**Types:**
- `types/index.ts` - TypeScript interfaces

## Migration Notes

**From:** Auto-save individual fields  
**To:** Manual save per subtab

**Breaking Changes:** None (new implementation)

**Benefits:**
- Fixed "stuck saving" bug (auth issue)
- Clearer UX (explicit save buttons)
- Better error handling
- More maintainable code

