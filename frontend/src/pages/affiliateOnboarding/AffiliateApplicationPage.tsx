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
          
          if (Object.keys(validatedDraft).length > 0) {
            setFormData(prev => ({ ...prev, ...validatedDraft }));
          }
        }
      }
      hasLoadedDraft.current = true;
    }
  }, []); // Empty dependency array - only run once

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    // Check if all required fields are filled
    const missingFields = Object.entries(requiredFieldsCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      setSubmitError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await postApplication(formData);
      if (result.ok) {
        setIsSuccess(true);
        clearDraft();
      } else {
        setSubmitError(result.message || 'Application submission failed');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <form onSubmit={onSubmit} className="space-y-8" id="affiliate-form">
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
            emergencyCleanup={emergencyCleanup}
          />
        </form>
      </div>
    </div>
  );
};

export default AffiliateApplicationPage;
