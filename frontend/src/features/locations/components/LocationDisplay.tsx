/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { Edit3, MapPin } from 'lucide-react';

import { useLocation } from '@/shared/hooks';
import { Button } from '@/shared/ui';

import type { LocationData } from '../schemas/locations.schemas';

interface LocationDisplayProps {
  location?: LocationData;
  showIcon?: boolean;
  className?: string;
  onEdit?: () => void;
  editable?: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  showIcon = true,
  className = "",
  onEdit,
  editable = false
}) => {
  const locationContext = useLocation();
  const selectedLocation = locationContext.selectedLocation;
  const displayLocation = location || selectedLocation;

  if (!displayLocation) {
    return (
      <div className={`flex items-center ${className}`}>
        {showIcon && <MapPin className="h-4 w-4 text-gray-400 mr-2" />}
        <span className="text-gray-500">No location selected</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {showIcon && <MapPin className="h-4 w-4 text-gray-400 mr-2" />}
      <span className="text-gray-900">
        {displayLocation.fullLocation}
      </span>
      {editable && onEdit && (
        <Button
          onClick={onEdit}
          variant="ghost"
          size="sm"
          className="ml-2 p-1 hover:bg-gray-100 rounded"
          aria-label="Edit location"
          leftIcon={<Edit3 className="h-3 w-3 text-gray-400" />}
        />
      )}
    </div>
  );
};

export default LocationDisplay;
