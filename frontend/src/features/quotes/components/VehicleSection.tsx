import React, { useMemo } from 'react';
import { Car } from 'lucide-react';

import { getMakesForType, getModelsForMake, getVehicleYears } from '@/data/vehicle_data';
import { type QuoteFormData } from '../types';

interface VehicleSectionProps {
  formData: QuoteFormData;
  fieldErrors: Record<string, string[]>;
  isSubmitting: boolean;
  onInputChange: (field: keyof QuoteFormData, value: string) => void;
}

const VehicleSection: React.FC<VehicleSectionProps> = ({
  formData,
  fieldErrors,
  isSubmitting,
  onInputChange
}) => {
  // Get available makes and models based on selected vehicle type
  const availableMakes = useMemo(() => {
    return getMakesForType(formData.vehicleType.toLowerCase());
  }, [formData.vehicleType]);

  const availableModels = useMemo(() => {
    if (!formData.vehicleMake) return [];
    return getModelsForMake(formData.vehicleType.toLowerCase(), formData.vehicleMake);
  }, [formData.vehicleType, formData.vehicleMake]);

  const vehicleYears = useMemo(() => {
    return getVehicleYears();
  }, []);

  // Determine if we should show Length instead of Color
  const showLength = ['RV', 'Boat'].includes(formData.vehicleType);
  const lengthOrColorLabel = showLength ? 'Length' : 'Color';
  const lengthOrColorField = showLength ? 'vehicleLength' : 'vehicleColor';
  const lengthOrColorValue = showLength ? formData.vehicleLength || '' : formData.vehicleColor || '';
  const lengthOrColorPlaceholder = showLength ? 'e.g., 25 ft, 30 ft' : 'e.g., White, Black, Silver';

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Car className="mr-2 text-orange-500" size={20} /> Vehicle Information
      </h3>
      
      {/* Vehicle Type */}
      <div className="mb-4">
        <label htmlFor="vehicleType" className="block text-sm font-medium text-white mb-1">Vehicle Type</label>
        <select
          id="vehicleType"
          value={formData.vehicleType}
          onChange={(e) => onInputChange('vehicleType', e.target.value)}
          className={`w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
            fieldErrors.vehicleType ? 'border-red-500' : 'border-stone-600'
          }`}
          disabled={isSubmitting}
        >
          <option value="" className="bg-stone-700 text-white">Select Type</option>
          <option value="Car" className="bg-stone-700 text-white">Car</option>
          <option value="Truck" className="bg-stone-700 text-white">Truck</option>
          <option value="SUV" className="bg-stone-700 text-white">SUV</option>
          <option value="RV" className="bg-stone-700 text-white">RV</option>
          <option value="Boat" className="bg-stone-700 text-white">Boat</option>
          <option value="Motorcycle" className="bg-stone-700 text-white">Motorcycle</option>
          <option value="Other" className="bg-stone-700 text-white">Other</option>
        </select>
        {fieldErrors.vehicleType && (
          <p className="mt-1 text-sm text-red-300">{fieldErrors.vehicleType[0]}</p>
        )}
      </div>

      {/* Make and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="vehicleMake" className="block text-sm font-medium text-white mb-1">Vehicle Make</label>
          <select
            id="vehicleMake"
            value={formData.vehicleMake}
            onChange={(e) => onInputChange('vehicleMake', e.target.value)}
            className={`w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors.vehicleMake ? 'border-red-500' : 'border-stone-600'
            }`}
            disabled={isSubmitting || !formData.vehicleType}
          >
            <option value="" className="bg-stone-700 text-white">Select Make</option>
            {availableMakes.map(make => (
              <option key={make} value={make} className="bg-stone-700 text-white">{make}</option>
            ))}
          </select>
          {fieldErrors.vehicleMake && (
            <p className="mt-1 text-sm text-red-300">{fieldErrors.vehicleMake[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="vehicleModel" className="block text-sm font-medium text-white mb-1">Vehicle Model</label>
          <select
            id="vehicleModel"
            value={formData.vehicleModel}
            onChange={(e) => onInputChange('vehicleModel', e.target.value)}
            className={`w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors.vehicleModel ? 'border-red-500' : 'border-stone-600'
            }`}
            disabled={isSubmitting || !formData.vehicleMake}
          >
            <option value="" className="bg-stone-700 text-white">Select Model</option>
            {availableModels.map(model => (
              <option key={model} value={model} className="bg-stone-700 text-white">{model}</option>
            ))}
          </select>
          {fieldErrors.vehicleModel && (
            <p className="mt-1 text-sm text-red-300">{fieldErrors.vehicleModel[0]}</p>
          )}
        </div>
      </div>

      {/* Year and Length/Color Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vehicleYear" className="block text-sm font-medium text-white mb-1">Vehicle Year</label>
          <select
            id="vehicleYear"
            value={formData.vehicleYear}
            onChange={(e) => onInputChange('vehicleYear', e.target.value)}
            className={`w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors.vehicleYear ? 'border-red-500' : 'border-stone-600'
            }`}
            disabled={isSubmitting}
          >
            <option value="" className="bg-stone-700 text-white">Select Year</option>
            {vehicleYears.map(year => (
              <option key={year} value={year.toString()} className="bg-stone-700 text-white">
                {year}
              </option>
            ))}
          </select>
          {fieldErrors.vehicleYear && (
            <p className="mt-1 text-sm text-red-300">{fieldErrors.vehicleYear[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor={lengthOrColorField} className="block text-sm font-medium text-white mb-1">{lengthOrColorLabel}</label>
          <input
            type={showLength ? 'number' : 'text'}
            id={lengthOrColorField}
            value={lengthOrColorValue}
            onChange={(e) => onInputChange(lengthOrColorField as keyof QuoteFormData, e.target.value)}
            className={`w-full px-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fieldErrors[lengthOrColorField] ? 'border-red-500' : 'border-stone-600'
            }`}
            placeholder={lengthOrColorPlaceholder}
            disabled={isSubmitting}
            {...(showLength && { min: '1', step: '1' })}
          />
          {fieldErrors[lengthOrColorField] && (
            <p className="mt-1 text-sm text-red-300">{fieldErrors[lengthOrColorField][0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleSection;
