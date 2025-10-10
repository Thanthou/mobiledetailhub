import bullheadCityData from "@/data/locations/az/bullhead-city.json";
import lasVegasData from "@/data/locations/nv/las-vegas.json";
import siteData from "@/data/mobile-detailing/site.json";
import { Header } from "@/features/header";
import { HomePage } from "@/features/home";
import type { LocationPage, MainSiteConfig } from "@/shared/types/location";
import { loadMergedLocationDataSync } from "@/shared/utils/locationDataLoader";

// Merge location data with main site config
const mergedBullheadCityData = loadMergedLocationDataSync(
  siteData as MainSiteConfig, 
  bullheadCityData as LocationPage
);
const mergedLasVegasData = loadMergedLocationDataSync(
  siteData as MainSiteConfig, 
  lasVegasData as LocationPage
);

export const locationRoutes = [
  // Location routes - use same components as main site
  {
    path: "/az/bullhead-city",
    element: (
      <>
        <Header locationData={mergedBullheadCityData.data} />
        <HomePage locationData={mergedBullheadCityData.data} />
      </>
    )
  },
  {
    path: "/nv/las-vegas",
    element: (
      <>
        <Header locationData={mergedLasVegasData.data} />
        <HomePage locationData={mergedLasVegasData.data} />
      </>
    )
  }
];
