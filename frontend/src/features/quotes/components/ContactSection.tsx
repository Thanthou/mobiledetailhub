import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

import { formatPhoneNumberAsTyped } from '@/shared/utils';

import { type QuoteFormData } from '../types';

interface ContactSectionProps {
  formData: QuoteFormData;
  fieldErrors: Record<string, string[]>;
  isSubmitting: boolean;
  isAffiliate: boolean;
  businessLocation: string;
  serviceAreas: Array<{ city: string; state: string; primary?: boolean }>;
  onInputChange: (field: keyof QuoteFormData, value: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  formData,
  fieldErrors,
  isSubmitting,
  isAffiliate,
  businessLocation,
  serviceAreas,
  onInputChange
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <User className="mr-2 text-orange-500" size={20} /> Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                fieldErrors.name ? 'border-red-500' : 'border-stone-600'
              }`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-300">{fieldErrors.name[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                fieldErrors.email ? 'border-red-500' : 'border-stone-600'
              }`}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-300">{fieldErrors.email[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhoneNumberAsTyped(e.target.value, e.target.selectionStart || 0);
                onInputChange('phone', formatted.value);
              }}
              className={`w-full pl-10 pr-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                fieldErrors.phone ? 'border-red-500' : 'border-stone-600'
              }`}
              placeholder="(555) 123-4567"
              disabled={isSubmitting}
            />
          </div>
          {fieldErrors.phone && (
            <p className="mt-1 text-sm text-red-300">{fieldErrors.phone[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-white mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              id="location"
              value={formData.location}
              onChange={(e) => onInputChange('location', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                fieldErrors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting || (isAffiliate && businessLocation !== '')}
            >
              <option value="">Select a location</option>
              {isAffiliate && businessLocation ? (
                <option value={businessLocation}>{businessLocation}</option>
              ) : (
                serviceAreas.map((area, index) => (
                  <option key={index} value={`${area.city}, ${area.state}`}>
                    {area.city}, {area.state} {area.primary && '(Primary)'}
                  </option>
                ))
              )}
            </select>
          </div>
          {fieldErrors.location && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.location[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
