import React from 'react';
import { Building2, Zap } from 'lucide-react';

import { Input } from '@/shared/ui';
import { formatPhoneNumber } from '@/shared/utils/phoneFormatter';

interface BusinessInformationSectionProps {
  formData: {
    businessName: string;
    businessPhone: string;
    businessEmail: string;
    businessAddress: {
      address: string;
      city: string;
      state: string;
      zip: string;
    };
    industry?: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleAddressChange: (field: keyof BusinessInformationSectionProps['formData']['businessAddress'], value: string) => void;
}

const INDUSTRIES = [
  { value: 'mobile-detailing', label: 'Mobile Detailing' },
  { value: 'maid-service', label: 'Maid Service' },
  { value: 'lawncare', label: 'Lawn Care' },
  { value: 'pet-grooming', label: 'Pet Grooming' },
  { value: 'barber', label: 'Barber Shop' },
];

const BusinessInformationSection: React.FC<BusinessInformationSectionProps> = ({
  formData,
  handleInputChange,
  handleAddressChange
}) => {
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('businessPhone', formatted);
  };

  const handleAutoFill = () => {
    handleInputChange('businessName', "JP's Mobile Detail");
    handleInputChange('industry', 'mobile-detailing');
    handleInputChange('businessPhone', formatPhoneNumber('7024203140'));
    handleInputChange('businessEmail', 'jpsmobiledetailing@hotmail.com');
    handleAddressChange('address', '2550 Country Club Dr');
    handleAddressChange('city', 'Bullhead City');
    handleAddressChange('state', 'AZ');
    handleAddressChange('zip', '86442');
  };

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-semibold flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Business Information
            </h2>
            <p className="text-gray-400 text-sm mt-1">Tell us about your business</p>
          </div>
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={handleAutoFill}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
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
        {/* Business Name */}
        <div className="md:col-span-2">
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
            Business Name *
          </label>
          <Input
            id="businessName"
            type="text"
            value={formData.businessName}
            onChange={(e) => { handleInputChange('businessName', e.target.value); }}
            placeholder="Enter your business name"
            required
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Industry Selection */}
        <div className="md:col-span-2">
          <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
            Industry *
          </label>
          <select
            id="industry"
            value={formData.industry || 'mobile-detailing'}
            onChange={(e) => { handleInputChange('industry', e.target.value); }}
            required
            className="w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {INDUSTRIES.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">
            This determines your website template and features
          </p>
        </div>

        {/* Business Phone */}
        <div>
          <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-300 mb-2">
            Business Phone *
          </label>
          <Input
            id="businessPhone"
            type="tel"
            value={formData.businessPhone}
            onChange={(e) => { handlePhoneChange(e.target.value); }}
            placeholder="(555) 123-4567"
            required
            maxLength={14}
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Business Email */}
        <div>
          <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-300 mb-2">
            Business Email *
          </label>
          <Input
            id="businessEmail"
            type="email"
            value={formData.businessEmail}
            onChange={(e) => { handleInputChange('businessEmail', e.target.value); }}
            placeholder="business@example.com"
            required
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Business Address */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Business Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Street Address */}
            <div className="md:col-span-2">
              <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-300 mb-2">
                Street Address *
              </label>
              <Input
                id="businessAddress"
                type="text"
                value={formData.businessAddress.address}
                onChange={(e) => { handleAddressChange('address', e.target.value); }}
                placeholder="123 Main Street"
                required
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="businessCity" className="block text-sm font-medium text-gray-300 mb-2">
                City *
              </label>
              <Input
                id="businessCity"
                type="text"
                value={formData.businessAddress.city}
                onChange={(e) => { handleAddressChange('city', e.target.value); }}
                placeholder="Phoenix"
                required
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="businessState" className="block text-sm font-medium text-gray-300 mb-2">
                State *
              </label>
              <Input
                id="businessState"
                type="text"
                value={formData.businessAddress.state}
                onChange={(e) => { handleAddressChange('state', e.target.value); }}
                placeholder="AZ"
                required
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={2}
              />
            </div>

            {/* ZIP Code */}
            <div>
              <label htmlFor="businessZip" className="block text-sm font-medium text-gray-300 mb-2">
                ZIP Code *
              </label>
              <Input
                id="businessZip"
                type="text"
                value={formData.businessAddress.zip}
                onChange={(e) => { handleAddressChange('zip', e.target.value); }}
                placeholder="85001"
                required
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={10}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BusinessInformationSection;
