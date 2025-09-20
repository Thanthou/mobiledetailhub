import React from 'react';
import { Wrench, MessageSquare } from 'lucide-react';

import { sanitizeText } from '@/shared/utils';

import { type QuoteFormData } from '../types';

interface ServicesSectionProps {
  formData: QuoteFormData;
  fieldErrors: Record<string, string[]>;
  isSubmitting: boolean;
  services: string[];
  onServiceToggle: (serviceName: string) => void;
  onInputChange: (field: keyof QuoteFormData, value: string) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  formData,
  fieldErrors,
  isSubmitting,
  services,
  onServiceToggle,
  onInputChange
}) => {
  return (
    <>
      {/* Services Needed */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Wrench className="mr-2" size={20} /> Services Needed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map(service => (
            <label key={service} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={() => onServiceToggle(service)}
                className="form-checkbox h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                disabled={isSubmitting}
              />
              <span className="text-gray-700">{service}</span>
            </label>
          ))}
        </div>
        {fieldErrors.services && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.services[0]}</p>
        )}
      </div>

      {/* Additional Message */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <MessageSquare className="mr-2" size={20} /> Additional Message (Optional)
        </h3>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => onInputChange('message', sanitizeText(e.target.value))}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
            fieldErrors.message ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Tell us more about your needs..."
          disabled={isSubmitting}
        ></textarea>
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.message[0]}</p>
        )}
      </div>
    </>
  );
};

export default ServicesSection;
