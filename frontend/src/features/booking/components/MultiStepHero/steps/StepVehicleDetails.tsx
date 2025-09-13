import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/shared/ui';

interface StepVehicleDetailsProps {
  selectedVehicle: string;
  vehicleMakes: string[];
  vehicleModels: { [make: string]: string[] };
  vehicleYears: string[];
  vehicleColors: string[];
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  };
  averageRating: number;
  totalReviews: number;
  onVehicleDetailsChange: (details: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
  onBackToHome: () => void;
}

const StepVehicleDetails: React.FC<StepVehicleDetailsProps> = ({
  selectedVehicle,
  vehicleMakes,
  vehicleModels,
  vehicleYears,
  vehicleColors,
  vehicleDetails,
  averageRating,
  totalReviews,
  onVehicleDetailsChange,
  onNext,
  onBack,
  onBackToHome,
}) => {
  // Check if vehicle details are complete
  const isVehicleDetailsComplete = () => {
    if (!selectedVehicle) return false;
    
    const shouldShowVehicleDetails = ['car', 'truck', 'boat', 'rv'].includes(selectedVehicle);
    if (!shouldShowVehicleDetails) return true; // For non-detailed vehicle types, always complete
    
    const hasMake = vehicleDetails.make !== '';
    const hasModel = vehicleDetails.model !== '';
    const hasYear = vehicleDetails.year !== '';
    
    if (['boat', 'rv'].includes(selectedVehicle)) {
      const hasLength = vehicleDetails.length !== '';
      return hasMake && hasModel && hasYear && hasLength;
    } else {
      const hasColor = vehicleDetails.color !== '';
      return hasMake && hasModel && hasYear && hasColor;
    }
  };

  return (
    <div className="text-center">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Vehicle Details
        </h1>
        <p className="text-xl text-stone-300">
          Provide details about your {selectedVehicle}
        </p>
      </div>

      {/* Vehicle Details Form */}
      <div className="mb-12">
        {!selectedVehicle ? (
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center max-w-md mx-auto">
            <p className="text-stone-300 text-lg">
              Please select a vehicle type first
            </p>
          </div>
        ) : !['car', 'truck', 'boat', 'rv'].includes(selectedVehicle) ? (
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center max-w-md mx-auto">
            <p className="text-stone-300 text-lg">
              No additional details required for this vehicle type
            </p>
          </div>
        ) : (
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make Dropdown */}
              <div>
                <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                <select
                  id="vehicle-make"
                  value={vehicleDetails.make}
                  onChange={(e) => {
                    onVehicleDetailsChange({
                      ...vehicleDetails,
                      make: e.target.value,
                      model: '', // Reset model when make changes
                    });
                  }}
                  className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Make</option>
                  {vehicleMakes.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Model Dropdown */}
              <div>
                <label htmlFor="vehicle-model" className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                <select
                  id="vehicle-model"
                  value={vehicleDetails.model}
                  onChange={(e) => onVehicleDetailsChange({
                    ...vehicleDetails,
                    model: e.target.value,
                  })}
                  disabled={!vehicleDetails.make}
                  className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Model</option>
                  {vehicleDetails.make && vehicleModels[vehicleDetails.make]?.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div>
                <label htmlFor="vehicle-year" className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                <select
                  id="vehicle-year"
                  value={vehicleDetails.year}
                  onChange={(e) => onVehicleDetailsChange({
                    ...vehicleDetails,
                    year: e.target.value,
                  })}
                  className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Year</option>
                  {vehicleYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Color or Length Dropdown */}
              {['boat', 'rv'].includes(selectedVehicle) ? (
                <div>
                  <label htmlFor="vehicle-length" className="block text-sm font-medium text-gray-300 mb-2">Length (ft)</label>
                  <select
                    id="vehicle-length"
                    value={vehicleDetails.length}
                    onChange={(e) => onVehicleDetailsChange({
                      ...vehicleDetails,
                      length: e.target.value,
                    })}
                    className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Length</option>
                    {Array.from({ length: 50 }, (_, i) => (i + 10).toString()).map((length) => (
                      <option key={length} value={length}>{length} ft</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label htmlFor="vehicle-color" className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                  <select
                    id="vehicle-color"
                    value={vehicleDetails.color}
                    onChange={(e) => onVehicleDetailsChange({
                      ...vehicleDetails,
                      color: e.target.value,
                    })}
                    className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Color</option>
                    {vehicleColors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <Button
          onClick={onBackToHome}
          variant="outline-white"
          size="lg"
          className="px-8"
        >
          Back to Home
        </Button>
        
        <Button
          onClick={onBack}
          variant="outline-white"
          size="lg"
          className="px-8"
          leftIcon={<ArrowLeft className="h-5 w-5" />}
        >
          Back
        </Button>
        
        {isVehicleDetailsComplete() && (
          <Button
            onClick={onNext}
            variant="primary"
            size="lg"
            className="px-8"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Continue
          </Button>
        )}
      </div>

      {/* Trust Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 place-items-center">
          <div className="flex items-center text-white">
            <div className="flex items-center">
              <span className="text-2xl mr-2">⭐</span>
              <span className="font-semibold">{averageRating}/5 ({totalReviews} reviews)</span>
            </div>
          </div>
          <div className="flex items-center text-white">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔒</span>
              <span>Secure checkout via <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors duration-200">Stripe</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepVehicleDetails;
