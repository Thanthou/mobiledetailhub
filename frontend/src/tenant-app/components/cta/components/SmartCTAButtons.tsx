import React from 'react';

import { useIsMobile } from '@/shared/hooks';
import { CTAButtons } from '@/shared/ui';

import { useBookingCapabilities } from '../hooks/useBookingCapabilities';
import MobileCTAButtons from './MobileCTAButtons';

interface SmartCTAButtonsProps {
  onRequestQuote?: () => void;
  onBookNow?: () => void;
  className?: string;
  forceMobile?: boolean; // Force mobile layout even on desktop
}

/**
 * Smart CTA buttons component for tenant-based sites:
 * - All sites are now tenant-based with business-specific context
 */
const SmartCTAButtons: React.FC<SmartCTAButtonsProps> = ({ 
  onRequestQuote, 
  onBookNow, 
  className,
  forceMobile = false
}) => {
  // Hook call kept for future use when booking capabilities are needed
  useBookingCapabilities();
  
  // Detect if we're on mobile or should use mobile layout
  const isMobileDetected = useIsMobile();
  const isMobile = forceMobile || isMobileDetected;

  // Tenant-specific CTA configuration (all sites are now tenant-based)
  const tenantButtons = [
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

  // Use tenant buttons (all sites are tenant-based now)
  const buttons = tenantButtons;

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
