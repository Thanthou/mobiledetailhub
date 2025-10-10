import React from 'react';

import { Button } from '@/shared/ui';

import { type QuoteFormData } from '../types';
import ContactSection from './ContactSection';
import ServicesSection from './ServicesSection';
import VehicleSection from './VehicleSection';

interface QuoteFormProps {
  formData: QuoteFormData;
  fieldErrors: Record<string, string[]>;
  isSubmitting: boolean;
  error: string | null;
  services: string[];
  serviceAreas: Array<{ city: string; state: string; primary?: boolean }>;
  isAffiliate: boolean;
  businessLocation: string;
  handleInputChange: (field: keyof QuoteFormData, value: string) => void;
  handleServiceToggle: (serviceName: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  formData,
  fieldErrors,
  isSubmitting,
  error,
  services,
  serviceAreas,
  isAffiliate,
  businessLocation,
  handleInputChange,
  handleServiceToggle,
  handleSubmit
}) => {
  return (
    <form onSubmit={(e) => { handleSubmit(e); }} className="space-y-6">
      {error && (
        <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <ContactSection
        formData={formData}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
        isAffiliate={isAffiliate}
        businessLocation={businessLocation}
        serviceAreas={serviceAreas}
        onInputChange={handleInputChange}
      />

      <VehicleSection
        formData={formData}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
      />

      <ServicesSection
        formData={formData}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
        services={services}
        onServiceToggle={handleServiceToggle}
        onInputChange={handleInputChange}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="min-w-[150px] bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Submit Quote
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
