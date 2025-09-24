import { Header } from "@/features/header";
import { HomePage } from "@/features/home";
import { loadMergedLocationDataSync } from "@/shared/utils/locationDataLoader";
import siteData from "@/data/mdh/site.json";
import bullheadCityData from "@/data/areas/az/bullhead-city.json";
import lasVegasData from "@/data/areas/nv/las-vegas.json";

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
