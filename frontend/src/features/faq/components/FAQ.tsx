import React from 'react';

import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { getAffiliateDisplayLocation } from '@/features/affiliateDashboard/utils';
import { useLocation } from '@/shared/hooks';

import { useFAQData } from '../hooks/useFAQData';
import type { FAQProps, FAQRef } from '../types';
import FAQContent from './FAQContent';

const FAQ = React.forwardRef<FAQRef, FAQProps>(({ autoExpand = false }, ref) => {
  // Try to get affiliate context, but don't fail if it's not available
  let affiliateContext = null;
  try {
    affiliateContext = useAffiliate();
  } catch (error) {
    // Not in affiliate context, continue without affiliate data
    console.debug('FAQ: Not in affiliate context, using default FAQ data');
  }
  
  const locationContext = useLocation();
  
  // Get the display location for FAQ content
  const displayLocation = React.useMemo(() => {
    if (!affiliateContext?.affiliateData) return null;
    
    // If we have a selected location, try to use it
    if (locationContext.selectedLocation) {
      const locationFromSelected = getAffiliateDisplayLocation(affiliateContext.affiliateData.service_areas, locationContext.selectedLocation);
      if (locationFromSelected) return locationFromSelected;
    }
    
    // Fallback to primary service area
    return getAffiliateDisplayLocation(affiliateContext.affiliateData.service_areas, null);
  }, [affiliateContext?.affiliateData, locationContext.selectedLocation]);

  // Create affiliate config for FAQ data
  const affiliateConfig = React.useMemo(() => {
    if (!affiliateContext?.affiliateData || !displayLocation) return {};
    
    return {
      business: {
        city: displayLocation.city,
        state: displayLocation.state,
        locality: displayLocation.city,
        region: displayLocation.state,
      }
    };
  }, [affiliateContext?.affiliateData, displayLocation]);

  const { faqData, isExpanded, setIsExpanded, openItems, toggleItem } = useFAQData({ 
    autoExpand, 
    config: affiliateConfig 
  });

  return (
    <FAQContent
      ref={ref}
      data={faqData}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      openItems={openItems}
      toggleItem={toggleItem}
    />
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
