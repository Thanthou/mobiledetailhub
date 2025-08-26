import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin } from 'lucide-react';
import { useLocation } from '../../contexts/LocationContext';
import { useSiteContext } from '../../hooks/useSiteContext';
import GetStarted from './LocationSearchBar';

interface LocationEditModalProps {
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  modalTitle?: string;
  onLocationChange?: (location: string, zipCode?: string, city?: string, state?: string) => void;
  displayText?: string;
  showIcon?: boolean;
  gapClassName?: string;
}

const LocationEditModal: React.FC<LocationEditModalProps> = ({
  placeholder = 'Enter your city or zip code',
  className = '',
  buttonClassName = '',
  modalTitle = 'Update your location',
  onLocationChange,
  displayText = 'Set Location',
  showIcon = true,
  gapClassName = 'space-x-6',
}) => {
  const { selectedLocation, hasValidLocation } = useLocation();
  const { isAffiliate } = useSiteContext();
  const [showModal, setShowModal] = useState(false);

  let buttonText = displayText;
  // On affiliate pages, always show the affiliate's location (displayText)
  // On MDH pages, use selectedLocation if available and displayText is default
  if (isAffiliate) {
    // Always use displayText on affiliate pages to show the affiliate's location
    buttonText = displayText;
  } else if (hasValidLocation() && (displayText === 'Set Location' || displayText === 'Select Location')) {
    // On MDH pages, use selectedLocation if displayText is default
    buttonText = `${selectedLocation!.city}, ${selectedLocation!.state}`;
  }



  return (
    <>
      <button
        className={`flex items-center ${gapClassName} text-lg hover:text-orange-400 transition-colors duration-200 hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-left ${buttonClassName}`}
        onClick={() => setShowModal(true)}
        type="button"
      >
        {showIcon && <MapPin className="h-5 w-5 text-orange-400" />}
        <span>{buttonText}</span>
      </button>
      {showModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">{modalTitle}</h3>
            <GetStarted
              onLocationSubmit={(location, zipCode, city, state) => {
                setShowModal(false);
                if (onLocationChange) {
                  onLocationChange(location, zipCode, city, state);
                }
              }}
              placeholder={placeholder}
              className="w-full"
            />
            <button
              onClick={() => setShowModal(false)}
              className="text-xs text-gray-500 hover:text-gray-700 mt-2"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LocationEditModal;
