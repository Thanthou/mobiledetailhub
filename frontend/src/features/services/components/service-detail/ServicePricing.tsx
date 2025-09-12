import React from 'react';

import { Button } from '@/shared/ui';

import type { SectionProps } from '../../types/service';
import { isServiceData, isServicePricing } from '../../utils/typeGuards';

const ServicePricing: React.FC<SectionProps> = ({ serviceData }) => {
  // Type guard checks
  if (!isServiceData(serviceData)) {
    return null;
  }

  if (!isServicePricing(serviceData.pricing)) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {serviceData.pricing.title}
          </h2>
          <p className="text-lg text-gray-600">
            Choose the package that best fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {serviceData.pricing.tiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative bg-white rounded-lg shadow-lg p-8 ${
                tier.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {tier.price}
                </div>
                <p className="text-gray-600">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.popular ? 'primary' : 'secondary'}
                size="lg"
                className={`w-full py-3 px-6 rounded-lg font-semibold ${
                  tier.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </div>

        {serviceData.pricing.note && (
          <div className="text-center mt-8">
            <p className="text-gray-600 italic">
              {serviceData.pricing.note}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicePricing;
