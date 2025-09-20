import React from 'react';
import { Car } from 'lucide-react';

import { type QuoteFormData } from '../types';

interface VehicleSectionProps {
  formData: QuoteFormData;
  fieldErrors: Record<string, string[]>;
  isSubmitting: boolean;
  vehicleTypes: Array<{ id: string; name: string }>;
  availableMakes: string[];
  availableModels: string[];
  onInputChange: (field: keyof QuoteFormData, value: string) => void;
}

const VehicleSection: React.FC<VehicleSectionProps> = ({
  formData,
  fieldErrors,
  isSubmitting,
  vehicleTypes,
  availableMakes,
  availableModels,
  onInputChange
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <Car className="mr-2" size={20} /> Vehicle Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <select
            id="vehicleType"
            value={formData.vehicleType}
            onChange={(e) => onInputChange('vehicleType', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors.vehicleType ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select Type</option>
            {vehicleTypes.map(type => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
          {fieldErrors.vehicleType && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.vehicleType[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Make</label>
          <select
            id="vehicleMake"
            value={formData.vehicleMake}
            onChange={(e) => onInputChange('vehicleMake', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors.vehicleMake ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting || !formData.vehicleType}
          >
            <option value="">Select Make</option>
            {availableMakes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
          {fieldErrors.vehicleMake && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.vehicleMake[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
          <select
            id="vehicleModel"
            value={formData.vehicleModel}
            onChange={(e) => onInputChange('vehicleModel', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors.vehicleModel ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting || !formData.vehicleMake}
          >
            <option value="">Select Model</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          {fieldErrors.vehicleModel && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.vehicleModel[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Year</label>
          <input
            type="number"
            id="vehicleYear"
            value={formData.vehicleYear}
            onChange={(e) => onInputChange('vehicleYear', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors.vehicleYear ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 2020"
            min="1900"
            max={new Date().getFullYear()}
            disabled={isSubmitting}
          />
          {fieldErrors.vehicleYear && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.vehicleYear[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleSection;
