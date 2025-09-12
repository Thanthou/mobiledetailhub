import React from 'react';

import { Button } from '@/shared/ui';

import type { SectionProps } from '../../types/service';

const ServiceHero: React.FC<SectionProps> = ({ serviceData }) => {

  return (
    <section className="relative h-96 bg-gray-900 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${serviceData.heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {serviceData.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {serviceData.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
              className="px-8 py-3"
            >
              Get Quote
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
