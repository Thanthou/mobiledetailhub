import { useMemo } from 'react';
import { FAQItem } from '../types';
import { AFFILIATE_FAQ_ITEMS } from '../data/affiliate';
import { useLocation } from '../../../contexts/LocationContext';

export const useAffiliateData = (businessConfig: any) => {
  const { selectedLocation } = useLocation();

  // Merge selected location into businessConfig for geo context
  const geoConfig = useMemo(() => {
    if (!businessConfig) return null;
    if (selectedLocation) {
      // Clone businessConfig and override city/state/zip
      return {
        ...businessConfig,
        business: {
          ...businessConfig.business,
          city: selectedLocation.city,
          state: selectedLocation.state,
          zip: selectedLocation.zipCode,
          address: `${selectedLocation.city}, ${selectedLocation.state} ${selectedLocation.zipCode || ''}`.trim(),
        },
      };
    }
    return businessConfig;
  }, [businessConfig, selectedLocation]);

  const faqData: FAQItem[] = useMemo(() => {
    if (!geoConfig) return [];
    return AFFILIATE_FAQ_ITEMS(geoConfig);
  }, [geoConfig]);

  const groupedFAQs = useMemo(() => {
    return faqData.reduce((acc, item, index) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({ ...item, originalIndex: index });
      return acc;
    }, {} as Record<string, (FAQItem & { originalIndex: number })[]>);
  }, [faqData]);

  const categories = useMemo(() => Object.keys(groupedFAQs), [groupedFAQs]);

  return {
    faqData,
    groupedFAQs,
    categories,
    geoConfig
  };
};