import React from 'react';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { Service } from '../types';

interface ServiceSelectionProps {
  availableServices: Service[];
  selectedService: string;
  loading: boolean;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  availableServices,
  selectedService,
  loading,
  onServiceSelect,
}) => {
  if (!availableServices.length && !loading) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your Service
          </h2>
          <p className="text-xl text-stone-300">
            Select the service you need for your vehicle
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading services...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServices.map((service) => {
              const isSelected = selectedService === service.id;
              
              return (
                <div
                  key={service.id}
                  className={`bg-stone-800 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-stone-700 ${
                    isSelected ? 'ring-2 ring-orange-500 bg-stone-700' : ''
                  }`}
                  onClick={() => {
                    if (selectedService === service.id) {
                      // Clear selection if clicking the same service
                      onServiceSelect('');
                    } else {
                      // Select the service
                      onServiceSelect(service.id);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (selectedService === service.id) {
                        onServiceSelect('');
                      } else {
                        onServiceSelect(service.id);
                      }
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{service.serviceName}</h3>
                    {isSelected && <CheckCircle className="h-6 w-6 text-green-500" />}
                  </div>
                  
                  <p className="text-stone-300 mb-4 text-sm">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-semibold">
                      Starting at ${service.startingPrice}
                    </span>
                    <Button 
                      variant={isSelected ? "primary" : "secondary"}
                      size="sm"
                      className={`px-4 py-2 ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-stone-700 hover:bg-orange-500'}`}
                    >
                      {isSelected ? 'Selected' : 'Choose'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceSelection;
