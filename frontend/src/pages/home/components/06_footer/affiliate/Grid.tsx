import { Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import LocationEditModal from 'shared/LocationEditModal';

import CTAButtonsContainer from '@/components/Book_Quote/CTAButtonsContainer';
import { useLocation } from '@/contexts/useLocation';
import { getAffiliateDisplayLocation } from '@/utils/affiliateLocationHelper';
import { formatPhoneNumber } from '@/utils/fields/phoneFormatter';

// Define the location interface locally to avoid import issues
interface LocationData {
  city: string;
  state: string;
  zipCode: string;
  fullLocation: string;
}

interface LocationContextType {
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  clearLocation: () => void;
  updateLocationWithState: (city: string, state: string) => void;
  hasValidLocation: () => boolean;
}

import TikTokIcon from '../icons/TikTokIcon';

interface ServiceArea {
  city: string;
  state: string;
  primary?: boolean;
}

interface FooterGridProps {
  parentConfig: {
    phone?: string;
    email?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    base_location?: {
      city?: string;
      state_name?: string;
    };
    name?: string;
  };
  businessSlug?: string;
  serviceAreas: ServiceArea[];
  serviceAreasData?: unknown; // Raw service areas data for location checking
  onRequestQuote: () => void;
  onBookNow?: () => void;
  onQuoteHover?: () => void;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig, serviceAreas, serviceAreasData, onRequestQuote, onBookNow, onQuoteHover }) => {
  const locationContext: LocationContextType = useLocation();
  const selectedLocation = locationContext.selectedLocation;
  const setSelectedLocation = locationContext.setSelectedLocation;
  
  // Get the appropriate location to display (selected location if served, otherwise primary)
  const displayLocation = React.useMemo(() => {
    if (!serviceAreasData || !selectedLocation) return null;
    return getAffiliateDisplayLocation(serviceAreasData as ServiceArea[] | string | null, selectedLocation);
  }, [serviceAreasData, selectedLocation]);
  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow();
    }
  };

  const handleLocationChange = (location: string, zipCode?: string, city?: string, state?: string) => {
    if (city && state) {
      setSelectedLocation({
        city: city,
        state: state,
        zipCode: zipCode || '',
        fullLocation: `${city}, ${state}`
      });
    }
  };

  return (
    <>
      {/* 3-Column Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Column A: Get in Touch */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-orange-400 text-xl mb-6">Get in Touch</h3>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="h-5 w-5 flex-shrink-0 text-orange-400" />
              <a 
                href={`tel:${parentConfig.phone ?? '+18885551234'}`}
                className="text-lg hover:text-orange-400 transition-colors duration-200"
              >
                {parentConfig.phone ? formatPhoneNumber(parentConfig.phone) : '(888) 555-1234'}
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="h-5 w-5 flex-shrink-0 text-orange-400" />
              <button 
                onClick={onRequestQuote}
                onMouseEnter={onQuoteHover}
                onFocus={onQuoteHover}
                className="text-lg hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer text-left"
              >
                {parentConfig.email || 'service@mobiledetailhub.com'}
              </button>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="h-5 w-5 flex-shrink-0 text-orange-400" />
              {displayLocation ? (
                <LocationEditModal
                  displayText={displayLocation.fullLocation ?? 'Select Location'}
                  buttonClassName="text-lg hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer text-left"
                  showIcon={false}
                  gapClassName="space-x-0"
                  onLocationChange={handleLocationChange}
                />
              ) : (
                <LocationEditModal
                  displayText="Select Location"
                  buttonClassName="text-lg hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer text-left"
                  showIcon={false}
                  gapClassName="space-x-0"
                  onLocationChange={handleLocationChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* Column B: Follow Us */}
        <div className="text-center">
          <h3 className="font-bold text-orange-400 text-xl mb-6">Follow Us</h3>
          <div className="inline-flex flex-col space-y-3 items-start">
            {parentConfig.facebook && (
              <a 
                href={parentConfig.facebook}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-lg">Facebook</span>
              </a>
            )}
            {parentConfig.instagram && (
              <a 
                href={parentConfig.instagram}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243s.122-.928.49-1.243c.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243s-.122.928-.49 1.243c-.369.315-.807.49-1.297.49z"/>
                </svg>
                <span className="text-lg">Instagram</span>
              </a>
            )}
            {parentConfig.tiktok && (
              <a 
                href={parentConfig.tiktok}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
              >
                <TikTokIcon className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">TikTok</span>
              </a>
            )}
            {parentConfig.youtube && (
              <a 
                href={parentConfig.youtube}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-lg">YouTube</span>
              </a>
            )}
          </div>
        </div>

        {/* Column C: Service Areas */}
        <div className="text-center md:text-right">
          <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
          {serviceAreas.length > 0 ? (
            <div className="space-y-1">
              {serviceAreas.map((area, index) => {
                // Check if this area matches the display location (selected if served, otherwise primary)
                const isDisplayLocation = displayLocation && 
                  area.city.toLowerCase() === displayLocation.city.toLowerCase() && 
                  area.state.toLowerCase() === displayLocation.state.toLowerCase();
                
                // Determine styling based on selection
                let className = 'text-lg';
                if (isDisplayLocation) {
                  className += ' text-orange-400 font-semibold';
                } else if (area.primary) {
                  className += ' text-white font-semibold';
                } else {
                  className += ' text-white';
                }
                
                return (
                  <div 
                    key={`${area.city}-${area.state}-${String(index)}`} 
                    className={className}
                  >
                    {area.city}, {area.state}
                  </div>
                );
              })}
            </div>
          ) : parentConfig.base_location?.city && parentConfig.base_location.state_name ? (
            <div className="text-lg text-orange-400 font-semibold">
              {parentConfig.base_location.city}, {parentConfig.base_location.state_name}
            </div>
          ) : (
            <div className="text-lg text-orange-400 font-semibold">
              {parentConfig.name || 'Metropolitan Area'}
            </div>
          )}
        </div>
      </div>

      {/* Get Started Section - Centered Below Columns */}
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold mb-6 text-orange-400">
          Ready to Get Started?
        </h3>
        <CTAButtonsContainer 
          className="max-w-md ml-[31%] [&>*]:w-48 [&>*]:justify-center"
          variant="side-by-side"
          onBookNow={handleBookNow}
          onRequestQuote={onRequestQuote}
          onQuoteHover={onQuoteHover}
        />
      </div>
    </>
  );
};

export default FooterGrid;