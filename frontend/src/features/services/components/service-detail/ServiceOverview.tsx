import React from 'react';

import type { SectionProps } from '../../types/service';
import { isServiceData, isServiceOverview } from '../../utils/typeGuards';

const ServiceOverview: React.FC<SectionProps> = ({ serviceData }) => {
  // Type guard checks
  if (!isServiceData(serviceData)) {
    return null;
  }

  if (!isServiceOverview(serviceData.overview)) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {serviceData.overview.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {serviceData.overview.content}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Benefits */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Why Choose Our {serviceData.title}?
            </h3>
            <ul className="space-y-4">
              {serviceData.overview.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              What&rsquo;s Included
            </h3>
            <ul className="space-y-4">
              {serviceData.overview.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
