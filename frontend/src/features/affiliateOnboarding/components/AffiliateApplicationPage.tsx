import React, { useEffect, useRef, useState } from 'react';

import { onboardingApi } from '@/features/affiliateOnboarding/api/onboarding.api';
import { useFileUpload, useFormHandlers, useLocalDraft } from '@/features/affiliateOnboarding/hooks';
import type { AffiliateApplication } from '@/features/affiliateOnboarding/types';
import { defaultValues } from '@/features/affiliateOnboarding/types';
import { Button } from '@/shared/ui';

import {
  ApplicationHeader,
  IdentityContactSection,
  LegalTermsSection,
  OperatingBasicsSection,
  ProofOfWorkSection,
  SocialMediaSection,
  SubmitSection,
  SuccessPage
} from './index';

const AffiliateApplicationPage: React.FC = () => {
  const [formData, setFormData] = useState<AffiliateApplication>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasLoadedDraft = useRef(false);
  
  const { saveDraft, loadDraft, clearDraft, emergencyCleanup } = useLocalDraft();
  const { handleInputChange, handleArrayChange } = useFormHandlers(setFormData);
  const { uploadedFiles, handleFileUpload, removeFile } = useFileUpload(handleInputChange);

  // Test data for auto-filling the form
  const testData: AffiliateApplication = {
    legal_name: 'Test Mobile Detail Pro LLC',
    primary_contact: 'John Smith',
    phone: '(555) 123-4567',
    email: 'john@testmobiledetailpro.com',
    base_location: {
      city: 'Bullhead City',
      state: 'AZ',
      zip: '86442'
    },
    categories: ['Auto Detailing', 'Ceramic Coating', 'Paint Correction'],
    gbp_url: 'https://g.page/test-mobile-detail-pro',
    instagram_url: 'https://instagram.com/testmobiledetailpro',
    tiktok_url: 'https://tiktok.com/@testmobiledetailpro',
    facebook_url: 'https://facebook.com/testmobiledetailpro',
    youtube_url: 'https://youtube.com/@testmobiledetailpro',
    website_url: 'https://testmobiledetailpro.com',
    uploads: [],
    has_insurance: true,
    accept_terms: true,
    consent_notifications: true,
    source: 'Google Search',
    notes: 'Test application for development and testing purposes. This is a sample affiliate application.'
  };

  // Function to auto-fill form with test data
  const handleTestFill = () => {
    setFormData(testData);
    // Save to draft so it persists
    saveDraft(testData);
  };

  // Function to clear form and reset to defaults
  const handleClearForm = () => {
    setFormData(defaultValues);
    clearDraft();
  };

  // Load draft on mount (only once)
  useEffect(() => {
    if (!hasLoadedDraft.current) {
      const draft = loadDraft();
      if (draft) {
        // Check if draft contains corrupted data
        const hasCorruptedData = Object.values(draft).some(value => {
          if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed.length === 1 && /^[a-z]$/i.test(trimmed);
          }
          return false;
        });
        
        if (hasCorruptedData) {
          localStorage.removeItem('affiliate-application-draft');
          setFormData(defaultValues); // Reset to clean defaults
        } else {
          // Only load data that looks legitimate
          const validatedDraft = Object.keys(draft).reduce<Partial<AffiliateApplication>>((acc, key) => {
            const value = draft[key as keyof AffiliateApplication];
            
            // For strings, only accept if they're reasonable length and don't look corrupted
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed.length > 1 && trimmed.length < 100 && !/^[a-z]$/i.test(trimmed)) {
                (acc as Record<string, unknown>)[key] = trimmed;
              }
            } 
            // For arrays, only accept if they have meaningful content
            else if (Array.isArray(value) && value.length > 0) {
              (acc as Record<string, unknown>)[key] = value;
            } 
            // For booleans, always accept
            else if (typeof value === 'boolean') {
              (acc as Record<string, unknown>)[key] = value;
            } 
            // For nested objects, validate each property
            else if (value && typeof value === 'object' && !Array.isArray(value)) {
              const nestedObj = value as Record<string, unknown>;
              const hasValidContent = Object.values(nestedObj).some(v => 
                typeof v === 'string' && v.trim().length > 1 && v.trim().length < 100
              );
              if (hasValidContent) {
                (acc as Record<string, unknown>)[key] = value;
              }
            }
            return acc;
          }, {});
          
          if (Object.keys(validatedDraft).length > 0) {
            setFormData(prev => ({ ...prev, ...validatedDraft }));
          }
        }
      }
      hasLoadedDraft.current = true;
    }
  }, [loadDraft]); // Include loadDraft in dependencies

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFieldsCheck = {
      legal_name: !!formData.legal_name,
      primary_contact: !!formData.primary_contact,
      phone: !!formData.phone,
      email: !!formData.email,
      base_location: !!(formData.base_location.city && formData.base_location.state),
      accept_terms: formData.accept_terms,
      consent_notifications: formData.consent_notifications
    };
    
    // Check if all required fields are filled
    const missingFields = Object.entries(requiredFieldsCheck)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      setSubmitError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await onboardingApi.submitApplication(formData);
      
      if (typeof result === 'object' && 'ok' in result && result.ok) {
        setIsSuccess(true);
        clearDraft();
      } else {
        const errorMessage = typeof result === 'object' && 'message' in result && typeof result.message === 'string' 
          ? result.message 
          : 'Application submission failed';
        setSubmitError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return <SuccessPage formData={formData} />;
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white" style={{ margin: 0, padding: 0 }}>
      <ApplicationHeader />
      
      {/* Test Controls */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pt-24">
        <div className="bg-amber-900/50 border border-amber-600 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-amber-200">🧪 Development Testing</h3>
            <span className="text-sm text-amber-300">Click to auto-fill form for testing</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleTestFill}
              variant="primary"
              size="md"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 font-medium rounded-md"
            >
              📝 Auto-Fill Test Data
            </Button>
            <Button
              type="button"
              onClick={handleClearForm}
              variant="destructive"
              size="md"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 font-medium rounded-md"
            >
              🗑️ Clear Form
            </Button>
            <Button
              type="button"
              onClick={() => {/* Form data logging removed */}}
              variant="secondary"
              size="md"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-medium rounded-md"
            >
              📊 Log Form Data
            </Button>
          </div>
          <p className="text-sm text-amber-200 mt-2">
            Use these buttons to quickly test the form functionality. Test data includes realistic values for all required fields.
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <form onSubmit={(e) => { void onSubmit(e); }} className="space-y-8" id="affiliate-form">
          <IdentityContactSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <OperatingBasicsSection 
            formData={formData} 
            handleArrayChange={handleArrayChange} 
          />
          
          <SocialMediaSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <ProofOfWorkSection 
            formData={formData}
            uploadedFiles={uploadedFiles}
            handleFileUpload={handleFileUpload}
            removeFile={removeFile}
          />
          
          <LegalTermsSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <SubmitSection 
            isSubmitting={isSubmitting}
            submitError={submitError}
            formData={formData}
            onSubmit={(e) => { void onSubmit(e); }}
            emergencyCleanup={emergencyCleanup}
          />
        </form>
      </div>
    </div>
  );
};

export default AffiliateApplicationPage;
