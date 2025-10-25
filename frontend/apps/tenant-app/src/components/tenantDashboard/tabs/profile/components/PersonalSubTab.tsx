import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { formatPhoneNumber, getPhoneDigits } from '@shared/utils';
import { useProfileData } from '../hooks/useProfileData';

export const PersonalSubTab: React.FC = () => {
  const { businessData, updateBusiness } = useProfileData();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load initial data
  useEffect(() => {
    if (businessData) {
      setFirstName(businessData.first_name || '');
      setLastName(businessData.last_name || '');
      setPersonalEmail(businessData.personal_email || '');
      setPersonalPhone(businessData.personal_phone ? formatPhoneNumber(businessData.personal_phone) : '');
    }
  }, [businessData]);

  // Track changes
  useEffect(() => {
    if (!businessData) return;
    
    const changed = 
      firstName !== (businessData.first_name || '') ||
      lastName !== (businessData.last_name || '') ||
      personalEmail !== (businessData.personal_email || '') ||
      getPhoneDigits(personalPhone) !== (businessData.personal_phone || '');
    
    setHasChanges(changed);
  }, [firstName, lastName, personalEmail, personalPhone, businessData]);

  const handlePhoneChange = (value: string) => {
    setPersonalPhone(formatPhoneNumber(value));
  };

  const handleCancel = () => {
    if (businessData) {
      setFirstName(businessData.first_name || '');
      setLastName(businessData.last_name || '');
      setPersonalEmail(businessData.personal_email || '');
      setPersonalPhone(businessData.personal_phone ? formatPhoneNumber(businessData.personal_phone) : '');
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
        first_name: firstName,
        last_name: lastName,
        personal_email: personalEmail,
        personal_phone: getPhoneDigits(personalPhone),
      });

      if (success) {
        setSaveSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Failed to save personal information');
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
        <h3 className="text-lg font-semibold text-white mb-1">Personal Information</h3>
        <p className="text-sm text-gray-400">Your personal contact details</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Changes saved successfully</p>
            <p className="text-sm text-green-600 mt-1">Your personal information has been updated.</p>
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
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="John"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="Smith"
          />
        </div>

        <div>
          <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-200 mb-2">
            Personal Email
          </label>
          <input
            type="email"
            id="personalEmail"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="personalPhone" className="block text-sm font-medium text-gray-200 mb-2">
            Personal Phone
          </label>
          <input
            type="tel"
            id="personalPhone"
            value={personalPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="(555) 123-4567"
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

