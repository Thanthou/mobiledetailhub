import React from 'react';
import { User } from 'lucide-react';

import { Input } from '@/shared/ui';

interface PersonalInformationSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    personalPhone: string;
    personalEmail: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <User className="h-5 w-5 mr-2" />
          Personal Information
        </h2>
        <p className="text-gray-400 text-sm mt-1">Tell us about yourself</p>
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
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            onChange={(e) => { handleInputChange('personalPhone', e.target.value); }}
            placeholder="(555) 123-4567"
            required
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationSection;
