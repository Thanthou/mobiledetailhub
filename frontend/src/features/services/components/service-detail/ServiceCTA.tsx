import React from 'react';

import { Button } from '@/shared/ui';

import type { SectionProps } from '../../types/service';

const ServiceCTA: React.FC<SectionProps> = ({ serviceData }) => {
  
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {serviceData.action.title}
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          {serviceData.action.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="secondary"
            size="xl"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
          >
            {serviceData.action.bookLabel}
          </Button>
          <Button 
            variant="outline-white"
            size="xl"
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold"
          >
            {serviceData.action.quoteLabel}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCTA;
