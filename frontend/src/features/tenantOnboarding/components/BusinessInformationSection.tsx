import React from 'react';
import { Building2 } from 'lucide-react';

import { Input } from '@/shared/ui';

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
  };
  handleInputChange: (field: string, value: string) => void;
  handleAddressChange: (field: keyof BusinessInformationSectionProps['formData']['businessAddress'], value: string) => void;
}

const BusinessInformationSection: React.FC<BusinessInformationSectionProps> = ({
  formData,
  handleInputChange,
  handleAddressChange
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Business Information
        </h2>
        <p className="text-gray-400 text-sm mt-1">Tell us about your business</p>
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

        {/* Business Phone */}
        <div>
          <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-300 mb-2">
            Business Phone *
          </label>
          <Input
            id="businessPhone"
            type="tel"
            value={formData.businessPhone}
            onChange={(e) => { handleInputChange('businessPhone', e.target.value); }}
            placeholder="(555) 123-4567"
            required
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
