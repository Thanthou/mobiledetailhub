import React, { useState, useEffect, useRef } from 'react';
import { 
  AffiliateApplication, 
  defaultValues 
} from './types';
import { postApplication } from './api';
import { useLocalDraft } from './useLocalDraft';
import { useFileUpload, useFormHandlers } from './hooks';
import {
  ApplicationHeader,
  IdentityContactSection,
  OperatingBasicsSection,
  ProofOfWorkSection,
  SocialMediaSection,
  LegalTermsSection,
  SuccessPage,
  SubmitSection
} from './components';

const AffiliateApplicationPage: React.FC = () => {
  const [formData, setFormData] = useState<AffiliateApplication>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasLoadedDraft = useRef(false);
  
  const { saveDraft, loadDraft, clearDraft, emergencyCleanup } = useLocalDraft();
  const { handleInputChange, handleArrayChange } = useFormHandlers(setFormData);
  const { uploadedFiles, handleFileUpload, removeFile } = useFileUpload(handleInputChange);


  // Load draft on mount (only once)
  useEffect(() => {
    if (!hasLoadedDraft.current) {
      const draft = loadDraft();
      if (draft) {
        console.log('Raw draft loaded:', draft); // Debug logging
        
        // Check if draft contains corrupted data
        const hasCorruptedData = Object.values(draft).some(value => {
          if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed.length === 1 && /^[a-z]$/i.test(trimmed);
          }
          return false;
        });
        
        if (hasCorruptedData) {
          console.log('Corrupted data detected, clearing localStorage and resetting form');
          localStorage.removeItem('affiliate-application-draft');
          setFormData(defaultValues); // Reset to clean defaults
        } else {
          // Only load data that looks legitimate
          const validatedDraft = Object.keys(draft).reduce((acc, key) => {
            const value = draft[key as keyof AffiliateApplication];
            
            // For strings, only accept if they're reasonable length and don't look corrupted
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed.length > 1 && trimmed.length < 100 && !/^[a-z]$/i.test(trimmed)) {
                (acc as any)[key] = trimmed;
              }
            } 
            // For arrays, only accept if they have meaningful content
            else if (Array.isArray(value) && value.length > 0) {
              (acc as any)[key] = value;
            } 
            // For booleans, always accept
            else if (typeof value === 'boolean') {
              (acc as any)[key] = value;
            } 
            // For nested objects, validate each property
            else if (value && typeof value === 'object' && !Array.isArray(value)) {
              const nestedObj = value as any;
              const hasValidContent = Object.values(nestedObj).some(v => 
                typeof v === 'string' && v.trim().length > 1 && v.trim().length < 100
              );
              if (hasValidContent) {
                (acc as any)[key] = value;
              }
            }
            return acc;
          }, {} as Partial<AffiliateApplication>);
          
          console.log('Validated draft:', validatedDraft); // Debug logging
          
          if (Object.keys(validatedDraft).length > 0) {
            setFormData(prev => ({ ...prev, ...validatedDraft }));
          }
        }
      }
      hasLoadedDraft.current = true;
    }

    // Cleanup function to clear corrupted data if needed
    return () => {
      // This will run when component unmounts
    };
  }, []); // Empty dependency array - only run once

  // Debug form submission events
  useEffect(() => {
    const form = document.getElementById('affiliate-form');
    if (form) {
      const handleFormSubmit = (e: Event) => {
        console.log('Form submit event detected:', e);
        console.log('Event target:', e.target);
        console.log('Event currentTarget:', e.currentTarget);
        console.log('Event type:', e.type);
      };
      
      form.addEventListener('submit', handleFormSubmit);
      
      return () => {
        form.removeEventListener('submit', handleFormSubmit);
      };
    }
  }, []);

  // Monitor state changes
  useEffect(() => {
    console.log('State changed - isSuccess:', isSuccess, 'isSubmitting:', isSubmitting);
  }, [isSuccess, isSubmitting]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission triggered');
    console.log('Form data:', formData);
    
    // Validate required fields
    const requiredFieldsCheck = {
      legal_name: !!formData.legal_name,
      primary_contact: !!formData.primary_contact,
      phone: !!formData.phone,
      email: !!formData.email,
      base_location: !!formData.base_location && !!formData.base_location.city && !!formData.base_location.state,
      accept_terms: formData.accept_terms,
      consent_notifications: formData.consent_notifications
    };
    
    console.log('Required fields check:', requiredFieldsCheck);
    
    // Check if all required fields are filled
    const missingFields = Object.entries(requiredFieldsCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      setSubmitError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await postApplication(formData);
      console.log('API result:', result);
      if (result.ok) {
        console.log('Setting success state');
        setIsSuccess(true);
        clearDraft();
      } else {
        console.log('Setting error state:', result.message);
        setSubmitError(result.message || 'Application submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      console.log('Setting submitting to false');
      setIsSubmitting(false);
    }
  };

  console.log('Current state - isSuccess:', isSuccess, 'isSubmitting:', isSubmitting);
  
  if (isSuccess) {
    console.log('Rendering SuccessPage');
    return <SuccessPage formData={formData} />;
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white" style={{ margin: 0, padding: 0 }}>
      <ApplicationHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <form onSubmit={onSubmit} className="space-y-8" id="affiliate-form">
          {/* Debug button - remove after testing */}
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
            <button
              type="button"
              onClick={() => {
                console.log('Debug: Setting isSuccess to true');
                setIsSuccess(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Debug: Force Success State
            </button>
            <p className="text-red-400 text-sm mt-2">Current isSuccess: {isSuccess.toString()}</p>
          </div>
          
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
            onSubmit={onSubmit}
            saveDraft={saveDraft}
            emergencyCleanup={emergencyCleanup}
          />
        </form>
      </div>
    </div>
  );
};

export default AffiliateApplicationPage;
