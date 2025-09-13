import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Lock } from 'lucide-react';

import { Button } from '@/shared/ui';
import { HERO_CONSTANTS, HeroBackground } from '@/features/hero';
import { useAffiliate } from '@/features/affiliateDashboard/hooks';

import type { Vehicle } from '../types';

interface VehicleSelectionHeroProps {
  availableVehicles: Vehicle[];
  selectedVehicle: string;
  loading: boolean;
  vehicleMakes: string[];
  vehicleModels: { [make: string]: string[] };
  vehicleYears: string[];
  vehicleColors: string[];
  averageRating: number;
  totalReviews: number;
  onVehicleSelect: (vehicleId: string) => void;
  onBackToHome: () => void;
  onVehicleDetailsChange: (details: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  }) => void;
}

const VehicleSelectionHero: React.FC<VehicleSelectionHeroProps> = ({
  availableVehicles,
  selectedVehicle,
  loading,
  vehicleMakes,
  vehicleModels,
  vehicleYears,
  vehicleColors,
  averageRating,
  totalReviews,
  onVehicleSelect,
  onBackToHome,
  onVehicleDetailsChange,
}) => {
  const { businessSlug } = useAffiliate();
  
  // Vehicle details state
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedLength, setSelectedLength] = useState<string>('');

  // Handle back to home navigation
  const handleBackToHome = () => {
    if (businessSlug) {
      // Navigate to the affiliate's home page
      window.location.href = `/${businessSlug}`;
    } else {
      // Fallback to main site
      onBackToHome();
    }
  };

  // Check if selected vehicle type should show detailed dropdowns
  const shouldShowVehicleDetails = selectedVehicle && ['car', 'truck', 'boat', 'rv'].includes(selectedVehicle);

  // Reset vehicle details when vehicle type changes
  useEffect(() => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedColor('');
    setSelectedLength('');
  }, [selectedVehicle]);

  // Notify parent of changes
  useEffect(() => {
    onVehicleDetailsChange({
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      color: selectedColor,
      length: selectedLength,
    });
  }, [selectedMake, selectedModel, selectedYear, selectedColor, selectedLength, onVehicleDetailsChange]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    if (selectedVehicle === vehicle.id) {
      // Clear selection if clicking the same vehicle
      onVehicleSelect('');
    } else {
      // Select the vehicle
      onVehicleSelect(vehicle.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, vehicle: Vehicle) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVehicleClick(vehicle);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-stone-900">
      {/* Rotating Background */}
      <HeroBackground images={HERO_CONSTANTS.IMAGES} />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-5" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your Vehicle
          </h1>
          <p className="text-xl text-stone-300">
            Select your vehicle type and provide details
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column - Vehicle Type Selection */}
          <div className="space-y-6">
            
            {loading ? (
              <div className="text-center py-12">
                <div className="text-white text-lg">Loading vehicles...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableVehicles.map((vehicle) => {
                  const isSelected = selectedVehicle === vehicle.id;
                  const IconComponent = vehicle.icon;
                  
                  return (
                    <div
                      key={vehicle.id}
                      className={`bg-stone-800/80 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-stone-700/80 ${
                        isSelected ? 'ring-2 ring-orange-500 bg-stone-700/80' : ''
                      }`}
                      onClick={() => handleVehicleClick(vehicle)}
                      onKeyDown={(e) => handleKeyDown(e, vehicle)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex flex-col items-center text-center">
                        <IconComponent className="h-12 w-12 text-orange-500 mb-3" />
                        <h3 className="text-lg font-bold text-white mb-2">{vehicle.name}</h3>
                        <p className="text-sm text-stone-300 mb-3">{vehicle.description}</p>
                        {isSelected && (
                          <div className="flex items-center text-green-500 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column - Vehicle Details */}
          <div className="space-y-6">
            
            {!selectedVehicle ? (
              <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center">
                <p className="text-stone-300 text-lg">
                  Please select a vehicle type to see details
                </p>
              </div>
            ) : !shouldShowVehicleDetails ? (
              <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center">
                <p className="text-stone-300 text-lg">
                  No additional details required for this vehicle type
                </p>
              </div>
            ) : (
              <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Make Dropdown */}
                  <div>
                    <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                    <select
                      id="vehicle-make"
                      value={selectedMake}
                      onChange={(e) => {
                        setSelectedMake(e.target.value);
                        setSelectedModel(''); // Reset model when make changes
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
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={!selectedMake}
                      className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Model</option>
                      {selectedMake && vehicleModels[selectedMake]?.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Dropdown */}
                  <div>
                    <label htmlFor="vehicle-year" className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                    <select
                      id="vehicle-year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
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
                        value={selectedLength}
                        onChange={(e) => setSelectedLength(e.target.value)}
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
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
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
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Button
            onClick={handleBackToHome}
            variant="outline-white"
            size="lg"
            className="px-8"
          >
            Back to Home
          </Button>
        </div>

        {/* Trust Strip */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 place-items-center">
              <div className="flex items-center text-white">
                <Star className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-semibold">{averageRating}/5 ({totalReviews} reviews)</span>
              </div>
              <div className="flex items-center text-white">
                <Lock className="h-5 w-5 text-orange-500 mr-2" />
                <span>Secure checkout via <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors duration-200">Stripe</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleSelectionHero;
