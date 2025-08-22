import React, { useState } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { VehicleSelector } from './components/VehicleSelector';
import { CategorySelector } from './components/CategorySelector';
import { ServiceSelector } from './components/ServiceSelector';
import { ServiceTierCards } from './components/ServiceTierCards';
import { useServicesData } from './hooks/useServicesData';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

const ServicesTab: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('cars');
  const [selectedCategory, setSelectedCategory] = useState<string>('interior');
  const [selectedService, setSelectedService] = useState<string>('clean');

  const { vehicles, toggleTierEnabled } = useServicesData();

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  const selectedCategoryData = selectedVehicleData?.categories.find(c => c.id === selectedCategory);
  const selectedServiceData = selectedCategoryData?.services.find(s => s.id === selectedService);

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle && vehicle.categories.length > 0) {
      setSelectedCategory(vehicle.categories[0].id);
      if (vehicle.categories[0].services.length > 0) {
        setSelectedService(vehicle.categories[0].services[0].id);
      }
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = selectedVehicleData?.categories.find(c => c.id === categoryId);
    if (category && category.services.length > 0) {
      setSelectedService(category.services[0].id);
    }
  };

  const handleTierUpdate = (tierId: string, updates: Partial<ServiceTier>) => {

    // Implementation for updating tier data
  };

  return (
    <div className="space-y-6">
      {/* Unified Three Column Container with Action Buttons */}
      <div className="bg-stone-800 rounded-lg border border-stone-700 overflow-hidden">
        {/* Header Row with Column Titles and Action Buttons */}
        <div className="p-4 border-b border-stone-700">
          <div className="grid grid-cols-[200px_200px_200px_auto] gap-0">
            <h3 className="text-lg font-semibold text-white px-4">Vehicle</h3>
            <h3 className="text-lg font-semibold text-white px-4">Category</h3>
            <h3 className="text-lg font-semibold text-white px-4">Service</h3>
            <div className="flex items-center justify-end space-x-2">
              <button 
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Edit Service"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                title="Add Service"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                title="Delete Service"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[200px_200px_200px_auto] gap-0 min-h-[400px]">
          <div>
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onVehicleChange={handleVehicleChange}
            />
          </div>
          
          <div>
            <CategorySelector
              categories={selectedVehicleData?.categories || []}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          <div>
            <ServiceSelector
              services={selectedCategoryData?.services || []}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />
          </div>
          <div></div>
        </div>
      </div>

      {/* Service Tier Cards */}
      {selectedServiceData && (
        <ServiceTierCards
          service={selectedServiceData}
          onToggleTier={toggleTierEnabled}
          onUpdateTier={handleTierUpdate}
        />
      )}

      {/* Empty State */}
      {!selectedServiceData && selectedCategoryData && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No services configured</h3>
          <p className="text-gray-400 mb-4">Add services to this category to get started</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
            Add Service
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;