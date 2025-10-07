import React from 'react';

import type { Service } from '../types';

interface ServiceSelectorProps {
  services: Service[];
  selectedService: string;
  onServiceChange: (serviceId: string) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedService,
  onServiceChange
}) => {
  return (
    <div className="p-4">
      {services.map((service) => {
        const isSelected = selectedService === service.id;
        
        return (
          <button
            key={service.id}
            onClick={() => { onServiceChange(service.id); }}
              className={`w-full flex items-center space-x-3 p-3 mb-2 rounded-lg text-left transition-colors ${
              isSelected 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-stone-700 hover:text-white'
            }`}
          >
            <span>{service.name}</span>
          </button>
        );
      })}
    </div>
  );
};