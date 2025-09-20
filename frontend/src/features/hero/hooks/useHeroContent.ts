import { useSiteContext } from '@/shared/utils/siteContext';

interface UseHeroContentReturn {
  title: string;
  subtitle: string;
  isLocation: boolean;
  locationName: string;
}

export const useHeroContent = (): UseHeroContentReturn => {
  const { isLocation, locationData, siteData } = useSiteContext();
  
  // Determine content based on context
  const title = isLocation 
    ? locationData?.hero?.h1 ?? siteData?.hero?.h1 ?? 'Mobile Detailing'
    : siteData?.hero?.h1 ?? 'Mobile Detailing';
    
  const subtitle = isLocation
    ? locationData?.hero?.sub ?? siteData?.hero?.sub ?? 'Professional mobile detailing services'
    : siteData?.hero?.sub ?? 'Professional mobile detailing services';

  return {
    title,
    subtitle,
    isLocation: Boolean(isLocation),
    locationName: locationData?.city ?? ''
  };
};
