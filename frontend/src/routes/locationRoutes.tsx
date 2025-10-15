// import HomePage from "@/app/pages/HomePage";
// import bullheadCityData from "@/data/locations/az/bullhead-city.json";
// import lasVegasData from "@/data/locations/nv/las-vegas.json";
// import type { LocationPage, MainSiteConfig } from "@/shared/types/location";
// import { loadMergedLocationDataSync } from "@/shared/utils/locationDataLoader";

// TODO: Legacy location routes - these are static and don't fit multi-tenant architecture
// Should be refactored to dynamic routes like /:businessSlug/locations/:state/:city
// or removed entirely if location pages are handled differently per tenant

// Merge location data with main site config
// const mergedBullheadCityData = loadMergedLocationDataSync(
//   siteData as MainSiteConfig, 
//   bullheadCityData as LocationPage
// );
// const mergedLasVegasData = loadMergedLocationDataSync(
//   siteData as MainSiteConfig, 
//   lasVegasData as LocationPage
// );

export const locationRoutes: Array<{ path: string; element: JSX.Element }> = [
  // Legacy location routes - disabled until refactored for multi-tenant
  // {
  //   path: "/az/bullhead-city",
  //   element: <HomePage locationData={mergedBullheadCityData.data} />
  // },
  // {
  //   path: "/nv/las-vegas",
  //   element: <HomePage locationData={mergedLasVegasData.data} />
  // }
];
