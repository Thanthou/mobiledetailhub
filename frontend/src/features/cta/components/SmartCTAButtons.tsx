import React from 'react';

import { useSiteState } from '@/shared/contexts';
import { CTAButtons } from '@/shared/ui';
import MobileCTAButtons from './MobileCTAButtons';
import { useBookingCapabilities } from '../hooks/useBookingCapabilities';

interface SmartCTAButtonsProps {
  onRequestQuote?: () => void;
  onBookNow?: () => void;
  onQuoteHover?: () => void;
  className?: string;
  forceMobile?: boolean; // Force mobile layout even on desktop
}

/**
 * Smart CTA buttons component that changes based on site state:
 * - MDH state: Generic "Request a Quote" and "Book Now" buttons
 * - Affiliate state: Location-specific buttons with business context
 */
const SmartCTAButtons: React.FC<SmartCTAButtonsProps> = ({ 
  onRequestQuote, 
  onBookNow, 
  onQuoteHover,
  className,
  forceMobile = false
}) => {
  const { siteState, currentLocation, businessData } = useSiteState();
  const bookingCapabilities = useBookingCapabilities();
  
  // Detect if we're on mobile or should use mobile layout
  const isMobile = forceMobile || (typeof window !== 'undefined' && window.innerWidth < 768);

  // Default CTA configuration for MDH state
  const mdhButtons = [
    {
      text: 'Request a Quote',
      onClick: onRequestQuote || (() => {}),
      variant: 'primary' as const,
    },
    {
      text: 'Find Location',
      onClick: () => {
        // Scroll to location search or open location modal
        const locationSection = document.getElementById('location-search');
        if (locationSection) {
          locationSection.scrollIntoView({ behavior: 'smooth' });
        }
      },
      variant: 'secondary' as const,
    },
  ];

  // Location-specific CTA configuration for affiliate state
  const affiliateButtons = [
    {
      text: 'Request a Quote',
      onClick: onRequestQuote || (() => {}),
      variant: 'primary' as const,
    },
    {
      text: 'Book Now',
      onClick: onBookNow || (() => {}),
      variant: 'secondary' as const,
    },
  ];

  // Choose buttons based on site state
  const buttons = siteState === 'affiliate' ? affiliateButtons : mdhButtons;

  // Use mobile-optimized CTAs for mobile devices or when forced
  if (isMobile) {
    return (
      <MobileCTAButtons
        className={className}
        onRequestQuote={onRequestQuote}
        onBookNow={onBookNow}
        layout="stacked"
      />
    );
  }

  // Desktop layout
  return (
    <CTAButtons 
      className={className}
      bookNowProps={{
        onClick: buttons[0].onClick,
        variant: buttons[0].variant,
        children: buttons[0].text
      }}
      getQuoteProps={{
        onClick: buttons[1].onClick,
        variant: buttons[1].variant,
        children: buttons[1].text
      }}
    />
  );
};

export default SmartCTAButtons;
