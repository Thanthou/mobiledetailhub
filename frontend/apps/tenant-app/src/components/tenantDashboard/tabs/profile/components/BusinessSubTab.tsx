import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { formatPhoneNumber, getPhoneDigits } from '@shared/utils';
import { useProfileData } from '../hooks/useProfileData';

export const BusinessSubTab: React.FC = () => {
  const { businessData, updateBusiness } = useProfileData();
  
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessStartDate, setBusinessStartDate] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load initial data
  useEffect(() => {
    if (businessData) {
      setBusinessName(businessData.business_name || '');
      setBusinessEmail(businessData.business_email || '');
      setBusinessPhone(businessData.business_phone ? formatPhoneNumber(businessData.business_phone) : '');
      setBusinessStartDate(
        businessData.business_start_date 
          ? new Date(businessData.business_start_date).toISOString().split('T')[0] 
          : ''
      );
    }
  }, [businessData]);

  // Track changes
  useEffect(() => {
    if (!businessData) return;
    
    const originalStartDate = businessData.business_start_date 
      ? new Date(businessData.business_start_date).toISOString().split('T')[0] 
      : '';
    
    const changed = 
      businessName !== (businessData.business_name || '') ||
      businessEmail !== (businessData.business_email || '') ||
      getPhoneDigits(businessPhone) !== (businessData.business_phone || '') ||
      businessStartDate !== originalStartDate;
    
    setHasChanges(changed);
  }, [businessName, businessEmail, businessPhone, businessStartDate, businessData]);

  const handlePhoneChange = (value: string) => {
    setBusinessPhone(formatPhoneNumber(value));
  };

  const handleCancel = () => {
    if (businessData) {
      setBusinessName(businessData.business_name || '');
      setBusinessEmail(businessData.business_email || '');
      setBusinessPhone(businessData.business_phone ? formatPhoneNumber(businessData.business_phone) : '');
      setBusinessStartDate(
        businessData.business_start_date 
          ? new Date(businessData.business_start_date).toISOString().split('T')[0] 
          : ''
      );
      setHasChanges(false);
      setSaveError(null);
      setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const success = await updateBusiness({
        business_name: businessName,
        business_email: businessEmail,
        business_phone: getPhoneDigits(businessPhone),
        business_start_date: businessStartDate || null, // Send null if empty, not empty string
      });

      if (success) {
        setSaveSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Failed to save business information');
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl py-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Business Information</h3>
        <p className="text-sm text-gray-400">Your business contact details and information</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Changes saved successfully</p>
            <p className="text-sm text-green-600 mt-1">Your business information has been updated.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Failed to save</p>
            <p className="text-sm text-red-600 mt-1">{saveError}</p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-200 mb-2">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="Acme Mobile Detailing"
            required
          />
        </div>

        <div>
          <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-200 mb-2">
            Business Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="businessEmail"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="contact@acme.com"
            required
          />
        </div>

        <div>
          <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-200 mb-2">
            Business Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="businessPhone"
            value={businessPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-200 mb-2">
            Website URL
            <span className="ml-2 text-xs text-gray-400">(Auto-generated, read-only)</span>
          </label>
          <div className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg">
            {businessData?.website || 'Not set'}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Contact support to set up a custom domain
          </p>
        </div>

        <div>
          <label htmlFor="businessStartDate" className="block text-sm font-medium text-gray-200 mb-2">
            Business Start Date
          </label>
          <input
            type="date"
            id="businessStartDate"
            value={businessStartDate}
            onChange={(e) => setBusinessStartDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

