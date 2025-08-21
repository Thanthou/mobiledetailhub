import React, { useState } from 'react';
import CTAButtonsContainer from '../../Book_Quote/CTAButtonsContainer';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';
import { useLocation } from '../../../contexts/LocationContext';
import LocationEditModal from '../../shared/LocationEditModal';

interface ServiceArea {
  city: string;
  state: string;
}

interface FooterGridProps {
  parentConfig: any;
  businessSlug?: string;
  serviceAreas: ServiceArea[];
  onRequestQuote: () => void;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig, businessSlug, serviceAreas, onRequestQuote }) => {
  const { selectedLocation } = useLocation();
  const handleBookNow = () => {
    // TODO: Implement booking functionality
    console.log('Book Now clicked');
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
                href={`tel:${parentConfig?.phone || '+18885551234'}`}
                className="text-lg hover:text-orange-400 transition-colors duration-200"
              >
                {parentConfig?.phone || '(888) 555-1234'}
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="h-5 w-5 flex-shrink-0 text-orange-400" />
              <a 
                href={`mailto:${parentConfig?.email || 'service@mobiledetailhub.com'}`}
                className="text-lg hover:text-orange-400 transition-colors duration-200"
              >
                {parentConfig?.email || 'service@mobiledetailhub.com'}
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="h-5 w-5 flex-shrink-0 text-orange-400" />
              <LocationEditModal
                fallbackText="Select Location"
                buttonClassName="text-lg hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer text-left"
                showIcon={false}
                gapClassName="space-x-0"
              />
            </div>
          </div>
        </div>

        {/* Column B: Follow Us */}
        <div className="text-center">
          <h3 className="font-bold text-orange-400 text-xl mb-6">Follow Us</h3>
          <div className="inline-flex flex-col space-y-3 items-start">
            {parentConfig?.facebook && (
              <a 
                href={parentConfig.facebook}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
              >
                <Facebook className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">Facebook</span>
              </a>
            )}
            {parentConfig?.instagram && (
              <a 
                href={parentConfig.instagram}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
              >
                <Instagram className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">Instagram</span>
              </a>
            )}
            {parentConfig?.tiktok && (
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
            {parentConfig?.youtube && (
              <a 
                href={parentConfig.youtube}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
              >
                <Youtube className="h-5 w-5 flex-shrink-0" />
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
              {serviceAreas.slice(0, 3).map((area, index) => (
                <div key={index} className="text-lg text-white">
                  {area.city}, {area.state}
                </div>
              ))}
              {serviceAreas.length > 3 && (
                <div className="text-sm text-gray-300">
                  +{serviceAreas.length - 3} more areas
                </div>
              )}
            </div>
          ) : (
            <div className="text-lg text-orange-400 font-semibold">
              {parentConfig?.name || 'Metropolitan Area'}
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
        />
      </div>
    </>
  );
};

export default FooterGrid;