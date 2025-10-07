import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/shared/ui';

// Disabled affiliate services imports
// import { CAR_SERVICE_OPTIONS, type ServiceOption } from '@/data/affiliate-services/cars/service/features';
// import { 
//   CAR_ADDON_SERVICE_OPTIONS,
//   CAR_INTERIOR_TRIM_SERVICE_OPTIONS,
//   CAR_WINDOWS_SERVICE_OPTIONS,
//   CAR_WHEELS_SERVICE_OPTIONS,
//   type AddonServiceOption 
// } from '@/data/affiliate-services/cars/addons/features';

// Fallback types and data
interface ServiceOption {
  id: string;
  name: string;
  description: string;
  explanation: string;
  image: string;
  duration: number;
  features: string[];
}

interface AddonServiceOption {
  id: string;
  name: string;
  description: string;
  explanation: string;
  image: string;
  duration: number;
  features: string[];
}

// Empty fallback data
const CAR_SERVICE_OPTIONS: ServiceOption[] = [];
const CAR_ADDON_SERVICE_OPTIONS: AddonServiceOption[] = [];
const CAR_INTERIOR_TRIM_SERVICE_OPTIONS: AddonServiceOption[] = [];
const CAR_WINDOWS_SERVICE_OPTIONS: AddonServiceOption[] = [];
const CAR_WHEELS_SERVICE_OPTIONS: AddonServiceOption[] = [];

// TODO: Add other vehicle types as they are implemented
const VEHICLE_SERVICES = {
  cars: CAR_SERVICE_OPTIONS,
  // trucks: TRUCK_SERVICE_OPTIONS,
  // rvs: RV_SERVICE_OPTIONS,
  // boats: BOAT_SERVICE_OPTIONS,
  // motorcycles: MOTORCYCLE_SERVICE_OPTIONS,
  // offroad: OFFROAD_SERVICE_OPTIONS,
  // other: OTHER_SERVICE_OPTIONS,
};

// Addon services for different vehicle types (flattened)
const VEHICLE_ADDON_SERVICES = {
  cars: CAR_ADDON_SERVICE_OPTIONS,
  // trucks: TRUCK_ADDON_SERVICE_OPTIONS,
  // rvs: RV_ADDON_SERVICE_OPTIONS,
  // boats: BOAT_ADDON_SERVICE_OPTIONS,
  // motorcycles: MOTORCYCLE_ADDON_SERVICE_OPTIONS,
  // offroad: OFFROAD_ADDON_SERVICE_OPTIONS,
  // other: OTHER_ADDON_SERVICE_OPTIONS,
};

// Map service names to specific addon categories
const getAddonServicesForService = (serviceName: string): AddonServiceOption[] => {
  const serviceNameLower = serviceName.toLowerCase();
  
  // Map service names to addon categories
  if (serviceNameLower.includes('trim') || 
      serviceNameLower.includes('interior-trim') ||
      serviceNameLower.includes('interior trim') ||
      serviceNameLower.includes('dash') ||
      serviceNameLower.includes('console') ||
      serviceNameLower.includes('panel')) {
    return CAR_INTERIOR_TRIM_SERVICE_OPTIONS;
  } else if (serviceNameLower.includes('window') || 
             serviceNameLower.includes('glass') ||
             serviceNameLower.includes('windshield') ||
             serviceNameLower.includes('tinted') ||
             serviceNameLower.includes('tint')) {
    return CAR_WINDOWS_SERVICE_OPTIONS;
  } else if (serviceNameLower.includes('wheel') || 
             serviceNameLower.includes('rim') ||
             serviceNameLower.includes('tire') ||
             serviceNameLower.includes('brake') ||
             serviceNameLower.includes('caliper')) {
    return CAR_WHEELS_SERVICE_OPTIONS;
  }
  
  // Default to all addon services if no specific match
  return CAR_ADDON_SERVICE_OPTIONS;
};

interface FeatureDropdownProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  vehicleType?: string;
  categoryType?: 'service-packages' | 'addons';
  serviceName?: string;
  disabled?: boolean;
}

export const FeatureDropdown: React.FC<FeatureDropdownProps> = ({
  selectedFeatures,
  onFeaturesChange,
  vehicleType = 'cars',
  categoryType = 'service-packages',
  serviceName,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get services for the current vehicle type and category
  const availableServices = categoryType === 'addons' 
    ? (serviceName ? getAddonServicesForService(serviceName) : VEHICLE_ADDON_SERVICES[vehicleType as keyof typeof VEHICLE_ADDON_SERVICES] || [])
    : VEHICLE_SERVICES[vehicleType as keyof typeof VEHICLE_SERVICES] || CAR_SERVICE_OPTIONS;

  // Use all available services since we removed search
  const filteredServices = availableServices;

  // Get selected service objects (only service IDs)
  const selectedServiceObjects = selectedFeatures
    .map(id => availableServices.find(s => s.id === id))
    .filter(Boolean) as (ServiceOption | AddonServiceOption)[];

  // Handle service selection
  const handleServiceToggle = (serviceId: string) => {
    console.log('Service toggle clicked:', serviceId);
    if (selectedFeatures.includes(serviceId)) {
      // Remove service
      onFeaturesChange(selectedFeatures.filter(id => id !== serviceId));
    } else {
      // Add service
      onFeaturesChange([...selectedFeatures, serviceId]);
    }
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the button and the dropdown
      const target = event.target as Node;
      const isInsideButton = dropdownRef.current?.contains(target);
      const isInsideDropdown = document.querySelector('[data-dropdown-portal]')?.contains(target);
      
      if (!isInsideButton && !isInsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        {categoryType === 'addons' ? 'Addon Services' : 'Service Options'}
      </label>
      
      {/* Selected Services Display */}
      {selectedServiceObjects.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-400">
            {selectedServiceObjects.length} service{selectedServiceObjects.length !== 1 ? 's' : ''} selected:
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedServiceObjects.map((service) => (
              <div
                key={service.id}
                className="inline-flex items-center gap-2 bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                <span>{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            if (!isOpen && dropdownRef.current) {
              const rect = dropdownRef.current.getBoundingClientRect();
              setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX
              });
            }
            setIsOpen(!isOpen);
          }}
          disabled={disabled}
          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-left text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
        >
          <span className="text-gray-300">
            {selectedServiceObjects.length > 0 
              ? `Add more ${categoryType === 'addons' ? 'addons' : 'services'} (${selectedServiceObjects.length} selected)`
              : `Select ${categoryType === 'addons' ? 'addons' : 'services'}...`
            }
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && createPortal(
          <div 
            data-dropdown-portal
            className="fixed z-[60] w-96 bg-gray-700 border border-gray-600 rounded-lg shadow-lg" 
            style={{ 
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
          >
            {/* Services List */}
            <div onClick={(e) => e.stopPropagation()}>
              {filteredServices.length > 0 ? (
                <div className="py-1">
                  <div className="grid grid-cols-2 gap-0">
                    {filteredServices.map((service) => {
                      const isSelected = selectedFeatures.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceToggle(service.id);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-600 transition-colors flex items-center gap-2 ${
                            isSelected ? 'bg-blue-900 text-blue-200' : 'text-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-400'
                          }`}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </div>
                          <span className="text-sm">{service.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-gray-400 text-sm">
                  No services available
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-600 bg-gray-800">
              <div className="text-xs text-gray-400 text-center">
                Select {categoryType === 'addons' ? 'addons' : 'services'} to add to this service tier
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-400">
        Choose from our standardized {categoryType === 'addons' ? 'addon' : 'service'} list to ensure consistent service descriptions for customers.
      </div>
    </div>
  );
};
