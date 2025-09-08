import { Edit,MapPin, Trash2 } from 'lucide-react';
import React from 'react';

import type { ServiceArea } from '../types';

interface LocationCardProps {
  location: ServiceArea;
  onEdit?: (location: ServiceArea) => void;
  onDelete?: (locationId: string) => void;
  isDeleting?: boolean;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onEdit,
  onDelete,
  isDeleting = false
}) => {
  const formatLocation = () => {
    const parts = [location.city, location.state];
    if (location.zip) {
      parts.push(location.zip.toString());
    }
    return parts.join(', ');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {location.city}
              {location.primary && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  Primary
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatLocation()}
            </p>
            <div className="text-xs text-gray-400 mt-1 space-y-1">
              <p>Min: ${location.minimum} | Multiplier: {location.multiplier}x</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={() => { onEdit(location); }}
              className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
              title="Edit location"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => { onDelete(`${location.city}-${location.state}`); }}
              disabled={isDeleting}
              className="p-1 text-gray-400 hover:text-red-500 disabled:text-gray-300 transition-colors"
              title="Delete location"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
