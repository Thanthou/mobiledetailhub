import { Header } from "@/features/header";
import { HomePage } from "@/features/home";
import { loadMergedLocationDataSync } from "@/shared/utils/locationDataLoader";
import siteData from "@/data/mobile-detailing/site.json";
import bullheadCityData from "@/data/locations/az/bullhead-city.json";
import lasVegasData from "@/data/locations/nv/las-vegas.json";

// Merge location data with main site config
const mergedBullheadCityData = loadMergedLocationDataSync(siteData, bullheadCityData);
const mergedLasVegasData = loadMergedLocationDataSync(siteData, lasVegasData);

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
