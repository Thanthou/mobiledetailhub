# Locations Tab - Archived

**Status:** 🚫 Disabled  
**Date:** 2025-10-25  
**Reason:** Google Maps integration not currently in use

## Why Disabled?

This tab uses Google Maps API which:
- Requires `VITE_GOOGLE_MAPS_API_KEY` environment variable
- Throws console errors when key is missing
- Not currently part of the product feature set

## Code Status

✅ Code is preserved but disabled via configuration  
✅ Can be re-enabled by setting `locations: true` in `tabConfig.ts`  
✅ Will need Google Maps API key to function properly  

## Re-enabling

If you want to use this feature again:

1. **Get Google Maps API Key:**
   - Visit: https://console.cloud.google.com/
   - Enable Maps JavaScript API
   - Create credentials → API key
   - Restrict key to your domains

2. **Add to environment:**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

3. **Enable in config:**
   ```typescript
   // frontend/apps/tenant-app/src/components/tenantDashboard/config/tabConfig.ts
   export const DEFAULT_TAB_CONFIG: TabConfig = {
     // ...
     locations: true, // Re-enable
     // ...
   };
   ```

4. **Restart dev server** to pick up new env var

## Features

When enabled, this tab provides:
- Primary service area management
- Multiple service areas with Google Places autocomplete
- Map visualization of service coverage
- Address validation and geocoding

## Technical Details

**Dependencies:**
- `@googlemaps/js-api-loader`
- Google Maps JavaScript API
- Google Places API

**Components:**
- `LocationsTab.tsx` - Main tab component
- `LocationCard.tsx` - Service area card
- `LocationSearch.tsx` - Google Places autocomplete
- `AddLocationModal.tsx` - Add new service area
- `DeleteLocationModal.tsx` - Confirm deletion

**Hooks:**
- `useGoogleMaps.ts` - Google Maps SDK loader
- `useLocationSearch.ts` - Places autocomplete
- `useLocationState.ts` - Local state management

