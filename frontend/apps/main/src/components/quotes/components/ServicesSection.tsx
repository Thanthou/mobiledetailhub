import React from 'react';
import { MessageSquare,Wrench } from 'lucide-react';

import { sanitizeText } from '@shared/utils';

import { type QuoteFormData } from '../types';

interface ServicesSectionProps {
  formData: QuoteFormData;
  fieldErrors: Record<string, string[]>;
  isSubmitting: boolean;
  onServiceToggle: (serviceName: string) => void;
  onInputChange: (field: keyof QuoteFormData, value: string) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  formData,
  fieldErrors,
  isSubmitting,
  onServiceToggle,
  onInputChange
}) => {
  // Define the specific service options in the requested layout
  const serviceOptions = [
    { label: 'Interior', value: 'Interior' },
    { label: 'Paint Correction', value: 'Paint Correction' },
    { label: 'Exterior', value: 'Exterior' },
    { label: 'Ceramic Coating', value: 'Ceramic Coating' },
    { label: 'Other', value: 'Other' },
    { label: 'Paint Protection Film (PPF)', value: 'Paint Protection Film (PPF)' }
  ];

  return (
    <>
      {/* Services Needed */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Wrench className="mr-2 text-orange-500" size={20} /> Services Needed
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {serviceOptions.map(service => (
            <label key={service.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.services.includes(service.value)}
                onChange={() => { onServiceToggle(service.value); }}
                className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500 bg-stone-700 border-stone-600"
                disabled={isSubmitting}
              />
              <span className="text-white text-sm">{service.label}</span>
            </label>
          ))}
        </div>
        {fieldErrors.services && (
          <p className="mt-1 text-sm text-red-300">{fieldErrors.services[0]}</p>
        )}
      </div>

      {/* Additional Message */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="mr-2 text-orange-500" size={20} /> Additional Message (Optional)
        </h3>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => { onInputChange('message', sanitizeText(e.target.value)); }}
          rows={4}
          className={`w-full px-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
            fieldErrors.message ? 'border-red-500' : 'border-stone-600'
          }`}
          placeholder="Tell us more about your needs..."
          disabled={isSubmitting}
        ></textarea>
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-300">{fieldErrors.message[0]}</p>
        )}
      </div>
    </>
  );
};

export default ServicesSection;
