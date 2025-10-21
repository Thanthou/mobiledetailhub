import React from 'react';

import type { BookingData } from '@tenant-app/components/booking/state';

interface VehicleSectionProps {
  bookingData: BookingData;
}

export const VehicleSection: React.FC<VehicleSectionProps> = ({ bookingData }) => {
  const { vehicle, vehicleDetails } = bookingData;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Vehicle Information</h3>
      </div>
      
      {/* Vehicle Details */}
      {(vehicleDetails.make || vehicle) && (
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4">Selected Vehicle</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
            <div>
              <span className="text-gray-400">Make:</span>
              <div className="text-white text-lg font-semibold">{vehicleDetails.make || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-400">Model:</span>
              <div className="text-white text-lg font-semibold">{vehicleDetails.model || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-400">Year:</span>
              <div className="text-white text-lg font-semibold">{vehicleDetails.year || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-400">
                {vehicleDetails.color ? 'Color:' : 'Length:'}
              </span>
              <div className="text-white text-lg font-semibold">
                {vehicleDetails.color ? 
                  vehicleDetails.color.charAt(0).toUpperCase() + vehicleDetails.color.slice(1) : 
                  vehicleDetails.length || 'N/A'
                }
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!vehicleDetails.make && !vehicle && (
        <div className="text-center py-8">
          <p className="text-gray-400">No vehicle information available</p>
        </div>
      )}
    </div>
  );
};

