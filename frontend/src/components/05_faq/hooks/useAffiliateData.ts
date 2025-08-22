import { useMemo } from 'react';
import { FAQItem } from '../types';
import { AFFILIATE_FAQ_ITEMS } from '../data/affiliate';
import { useLocation } from '../../../contexts/LocationContext';

export const useAffiliateData = () => {
  const { selectedLocation } = useLocation();

  // Create geo config from selected location even without business config
  const geoConfig = useMemo(() => {
    if (selectedLocation) {
      return {
        business: {
          city: selectedLocation.city,
          state: selectedLocation.state,
          zip: selectedLocation.zipCode,
          address: `${selectedLocation.city}, ${selectedLocation.state} ${selectedLocation.zipCode || ''}`.trim(),
        },
        serviceLocations: [], // Empty array for nearby locations
      };
    }
    return null;
  }, [selectedLocation]);

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