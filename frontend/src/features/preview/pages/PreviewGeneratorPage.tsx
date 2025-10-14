/**
 * Preview Generator Page
 * 
 * Internal sales tool to quickly generate preview links.
 * Form inputs for business info → generates token → navigates to preview.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Loader2, Sparkles, Zap } from 'lucide-react';

import { useBrowserTab } from '@/shared/hooks';
import { formatPhoneNumber } from '@/shared/utils/phoneFormatter';

import { createPreview } from '../api/preview.api';
import type { PreviewPayload } from '../types/preview.types';

const INDUSTRIES = [
  { value: 'mobile-detailing', label: 'Mobile Detailing' },
  { value: 'maid-service', label: 'Maid Service' },
  { value: 'lawncare', label: 'Lawn Care' },
  { value: 'pet-grooming', label: 'Pet Grooming' },
] as const;

// Test data for quick autofill by industry
const TEST_DATA = {
  'mobile-detailing': {
    businessName: "JP's Mobile Detail",
    phone: '(702) 420-3140',
    city: 'Bullhead City',
    state: 'AZ'
  },
  'maid-service': {
    businessName: 'Sparkle Clean Maids',
    phone: '(602) 555-5678',
    city: 'Phoenix',
    state: 'AZ'
  },
  'lawncare': {
    businessName: 'Green Horizons Lawn Care',
    phone: '(928) 555-9012',
    city: 'Flagstaff',
    state: 'AZ'
  },
  'pet-grooming': {
    businessName: 'Pampered Paws Grooming',
    phone: '(520) 555-3456',
    city: 'Tucson',
    state: 'AZ'
  }
} as const;

const PreviewGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set browser tab title and favicon for preview generator page
  useBrowserTab({
    title: 'Preview Generator - That Smart Site',
    useBusinessName: false,
  });
  
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    city: '',
    state: '',
    industry: 'mobile-detailing' as PreviewPayload['industry'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    void (async () => {
      try {
        const response = await createPreview(formData);
        
        // Navigate to the preview page with the token
        void navigate(response.url);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create preview';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 2); // Max 2 chars, uppercase
    setFormData((prev) => ({ ...prev, state: value }));
  };

  const handleAutofill = () => {
    const testData = TEST_DATA[formData.industry];
    setFormData({
      industry: formData.industry,
      businessName: testData.businessName,
      phone: testData.phone,
      city: testData.city,
      state: testData.state
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Tenant Preview Generator</h1>
          <p className="text-gray-400">
            Create instant preview sites for sales demos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-200 mb-2">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              placeholder="JP's Mobile Detail"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              minLength={14}
              maxLength={14}
              placeholder="(928) 555-1234"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-200 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                placeholder="Phoenix"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-200 mb-2">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                required
                minLength={2}
                maxLength={2}
                placeholder="AZ"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
              />
            </div>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-200 mb-2">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {INDUSTRIES.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>

          {/* Autofill Button */}
          <button
            type="button"
            onClick={handleAutofill}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors border border-blue-500"
          >
            <Zap className="h-4 w-4" />
            <span>Quick Fill Test Data</span>
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-md p-4">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Preview...</span>
              </>
            ) : (
              <>
                <Eye className="h-5 w-5" />
                <span>Generate Preview</span>
              </>
            )}
          </button>

          {/* Help Text */}
          <p className="text-xs text-gray-400 text-center">
            Preview links expire after 7 days
          </p>
        </form>

          {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => { void navigate('/'); }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewGeneratorPage;

