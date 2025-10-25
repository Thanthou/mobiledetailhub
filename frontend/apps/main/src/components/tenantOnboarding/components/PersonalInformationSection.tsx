import React from 'react';
import { User, Zap } from 'lucide-react';

import { env } from '@shared/env';
import { Input } from '@shared/ui';
import { formatPhoneNumber } from '@shared/utils/phoneFormatter';

interface PersonalInformationSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    personalPhone: string;
    personalEmail: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  formData,
  handleInputChange,
  errors = {}
}) => {
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('personalPhone', formatted);
  };

  const handleAutoFill = () => {
    handleInputChange('firstName', 'John');
    handleInputChange('lastName', 'Doe');
    handleInputChange('personalPhone', formatPhoneNumber('5551112222'));
    handleInputChange('personalEmail', 'coleman143@hotmail.com');
  };

  return (
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h2>
            <p className="text-gray-400 text-sm mt-1">Tell us about yourself</p>
          </div>
          {env.DEV && (
            <button
              type="button"
              onClick={handleAutoFill}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
              title="Auto-fill with test data"
            >
              <Zap className="h-4 w-4" />
              Auto-fill
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => { handleInputChange('firstName', e.target.value); }}
            placeholder="Enter your first name"
            required
            className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
            Last Name *
          </label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => { handleInputChange('lastName', e.target.value); }}
            placeholder="Enter your last name"
            required
            className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Personal Phone */}
        <div>
          <label htmlFor="personalPhone" className="block text-sm font-medium text-gray-300 mb-2">
            Personal Phone *
          </label>
          <Input
            id="personalPhone"
            type="tel"
            value={formData.personalPhone}
            onChange={(e) => { handlePhoneChange(e.target.value); }}
            placeholder="(555) 123-4567"
            required
            maxLength={14}
            className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Personal Email */}
        <div>
          <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-300 mb-2">
            Personal Email *
          </label>
          <Input
            id="personalEmail"
            type="email"
            value={formData.personalEmail}
            onChange={(e) => { handleInputChange('personalEmail', e.target.value); }}
            placeholder="your.email@example.com"
            required
            className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          {errors['personalEmail'] && (
            <p className="mt-1 text-sm text-red-400">{errors['personalEmail']}</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationSection;
