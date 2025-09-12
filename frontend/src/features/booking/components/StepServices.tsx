import React, { useState } from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { ServiceSelection } from '../schemas/booking.schemas';

interface Service {
  id: string;
  name: string;
  description: string;
  base_price_cents: string;
  duration: number;
}

interface StepServicesProps {
  onNext: (serviceData: ServiceSelection) => void;
  onPrevious: () => void;
  initialData?: ServiceSelection;
  services: Service[];
}

const StepServices: React.FC<StepServicesProps> = ({ 
  onNext, 
  onPrevious, 
  initialData,
  services 
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialData?.services || []
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    initialData?.addons || []
  );

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleNext = () => {
    onNext({
      services: selectedServices,
      addons: selectedAddons
    });
  };

  const isComplete = selectedServices.length > 0;

  const formatPrice = (priceCents: string) => {
    const price = parseInt(priceCents) / 100;
    return `$${price.toFixed(0)}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Select Services</h2>
      
      {/* Main Services */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Choose Your Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                handleServiceToggle(service.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleServiceToggle(service.id);
                }
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedServices.includes(service.id)
                  ? 'border-orange-400 bg-orange-400/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {service.name}
                  </h4>
                  <p className="text-gray-300 text-sm mb-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{formatPrice(service.base_price_cents)}</span>
                    <span>{service.duration} hours</span>
                  </div>
                </div>
                {selectedServices.includes(service.id) && (
                  <Check className="w-5 h-5 text-orange-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons (if any) */}
      {selectedServices.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Add-ons (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Example add-ons - these would come from props or API */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                handleAddonToggle('wax');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAddonToggle('wax');
                }
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedAddons.includes('wax')
                  ? 'border-orange-400 bg-orange-400/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Premium Wax
                  </h4>
                  <p className="text-gray-300 text-sm mb-2">
                    Extra protection and shine
                  </p>
                  <span className="text-sm text-gray-400">+$50</span>
                </div>
                {selectedAddons.includes('wax') && (
                  <Check className="w-5 h-5 text-orange-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Selected Services:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            {selectedServices.map(serviceId => {
              const service = services.find(s => s.id === serviceId);
              return service ? (
                <li key={serviceId}>
                  {service.name} - {formatPrice(service.base_price_cents)}
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="secondary"
          size="md"
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="primary"
          size="md"
          className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg"
          disabled={!isComplete}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepServices;
