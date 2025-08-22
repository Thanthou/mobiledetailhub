import React, { useState, useRef } from 'react';
import { User, Info } from 'lucide-react';
import { AffiliateApplication, US_STATES } from '../types';
import { formatPhoneNumberAsTyped, isCompletePhoneNumber } from '../../../utils/phoneFormatter';
import LocationInput from './LocationInput';

interface IdentityContactSectionProps {
  formData: AffiliateApplication;
  handleInputChange: (field: string, value: any) => void;
}

const IdentityContactSection: React.FC<IdentityContactSectionProps> = ({
  formData,
  handleInputChange
}) => {
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    // Use the phone formatter utility
    const { value: formattedValue, cursorPosition: newCursorPosition } = formatPhoneNumberAsTyped(input, cursorPosition);
    
    // Update the form data
    handleInputChange('phone', formattedValue);
    
    // Restore cursor position after React re-renders
    setTimeout(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleLocationSubmit = (location: string, zipCode?: string, city?: string, state?: string) => {
    if (city && state) {
      handleInputChange('base_location.city', city);
      handleInputChange('base_location.state', state);
      if (zipCode) {
        handleInputChange('base_location.zip', zipCode);
      }
    }
  };

  const isPhoneValid = isCompletePhoneNumber(formData.phone);

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <User className="w-5 h-5 mr-2 text-orange-400" />
          Identity & Contact
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Basic information about you and your business
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="legal_name" className="block text-gray-300 text-sm font-medium mb-2">
            Legal business name (or sole proprietor name) <span className="text-red-400">*</span>
          </label>
          <input 
            id="legal_name"
            name="legal_name"
            type="text"
            value={formData.legal_name}
            onChange={(e) => handleInputChange('legal_name', e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., John's Mobile Detailing LLC"
            required
          />
        </div>

        <div>
          <label htmlFor="primary_contact" className="block text-gray-300 text-sm font-medium mb-2">
            Owner / primary contact <span className="text-red-400">*</span>
          </label>
          <input 
            id="primary_contact"
            name="primary_contact"
            type="text"
            value={formData.primary_contact}
            onChange={(e) => handleInputChange('primary_contact', e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., John Smith"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
              Phone <span className="text-red-400">*</span>
              <Info className="w-4 h-4 ml-1 text-gray-400" />
            </label>
            <input 
              id="phone"
              name="phone"
              ref={phoneInputRef}
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`w-full bg-stone-700 border rounded-lg px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formData.phone && !isPhoneValid 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-stone-600'
              }`}
              placeholder="(555) 123-4567"
              autoComplete="tel"
              required
            />
            <div className="mt-1 space-y-1">
              <p className="text-gray-400 text-xs">SMS-capable phone number</p>
              {formData.phone && !isPhoneValid && (
                <p className="text-red-400 text-xs">
                  Please enter a complete 10-digit phone number
                </p>
              )}
              {isPhoneValid && (
                <p className="text-green-400 text-xs">
                  ✓ Valid phone number format
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="john@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="location-search" className="block text-gray-300 text-sm font-medium mb-3">
            Base Location <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <LocationInput
              onLocationSubmit={handleLocationSubmit}
              placeholder="Enter your city, state, or ZIP code"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityContactSection;
