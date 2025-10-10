import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

import type { TenantApplication } from '@/features/tenantOnboarding/types';
import { tenantApplicationDefaultValues } from '@/features/tenantOnboarding/types';
import { Button } from '@/shared/ui';

import {
  ApplicationHeader,
  BusinessInformationSection,
  PersonalInformationSection,
  SuccessPage
} from './index';
import PaymentSection from './PaymentSection';

interface PreviewState {
  fromPreview?: boolean;
  businessName?: string;
  phone?: string;
  city?: string;
  state?: string;
  industry?: string;
}

const TenantApplicationPage: React.FC = () => {
  const location = useLocation();
  const previewData = location.state as PreviewState | null;
  
  const [formData, setFormData] = useState<TenantApplication>(tenantApplicationDefaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Pre-fill form if coming from preview
  useEffect(() => {
    if (previewData?.fromPreview) {
      setFormData(prev => ({
        ...prev,
        businessName: previewData.businessName || prev.businessName,
        businessPhone: previewData.phone || prev.businessPhone,
        businessAddress: {
          ...prev.businessAddress,
          city: previewData.city || prev.businessAddress.city,
          state: previewData.state || prev.businessAddress.state,
        },
      }));
    }
  }, [previewData]);

  const steps = ['Personal', 'Business', 'Payment'];

  // Step navigation functions
  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle input changes for simple fields
  const handleInputChange = (field: keyof TenantApplication, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle business address changes
  const handleAddressChange = (field: keyof TenantApplication['businessAddress'], value: string) => {
    setFormData(prev => ({
      ...prev,
      businessAddress: {
        ...prev.businessAddress,
        [field]: value
      }
    }));
  };

  // Handle billing address changes
  const handleBillingAddressChange = (field: keyof TenantApplication['billingAddress'], value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  // Test data for auto-filling the form
  const testData: TenantApplication = {
    firstName: 'Jess',
    lastName: 'Brister',
    personalPhone: '(702) 420-3151',
    personalEmail: 'jessbrister27@gmail.com',
    businessName: "JP's Mobile Detailing",
    businessPhone: '(702) 420-3151',
    businessEmail: 'jpsmobiledetailing@hotmail.com',
    businessAddress: {
      address: '2550 Country Club Drive',
      city: 'Bullhead City',
      state: 'AZ',
      zip: '86442'
    },
    paymentMethod: 'credit_card',
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/25',
    cvv: '123',
    billingAddress: {
      address: '2550 Country Club Drive',
      city: 'Bullhead City',
      state: 'AZ',
      zip: '86442'
    }
  };

  // Function to auto-fill form with test data
  const handleTestFill = () => {
    setFormData(testData);
  };

  // Function to clear form
  const handleClearForm = () => {
    setFormData(tenantApplicationDefaultValues);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Implement actual submission logic
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit application. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessPage />;
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      <ApplicationHeader />
      
      {/* Development Tools */}
      <div className="fixed top-20 left-4 z-40 bg-amber-900/50 border border-amber-600 text-white p-4 rounded-lg max-w-xs">
        <h3 className="text-sm font-bold mb-2">🛠️ Dev Tools</h3>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleTestFill}
            variant="secondary"
            size="sm"
            className="px-3 py-1 bg-green-600 hover:bg-green-700 font-medium rounded-md text-xs"
          >
            📝 Fill Test Data
          </Button>
          <Button
            type="button"
            onClick={handleClearForm}
            variant="destructive"
            size="sm"
            className="px-3 py-1 bg-red-600 hover:bg-red-700 font-medium rounded-md text-xs"
          >
            🗑️ Clear Form
          </Button>
        </div>
        <p className="text-xs text-amber-200 mt-2">
          Use these buttons to quickly test the form functionality.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-8" id="tenant-form">
          {/* Step Container with Fixed Height */}
          <div className="h-[700px] flex flex-col justify-start">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="h-full flex flex-col justify-center">
                <PersonalInformationSection 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              </div>
            )}
            
            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="h-full flex flex-col justify-center">
                <BusinessInformationSection 
                  formData={formData} 
                  handleInputChange={handleInputChange}
                  handleAddressChange={handleAddressChange}
                />
              </div>
            )}
            
            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <div className="h-full flex flex-col justify-start">
                <PaymentSection 
                  formData={formData} 
                  handleInputChange={handleInputChange}
                  handleAddressChange={handleBillingAddressChange}
                />
              </div>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="py-6">
            {/* Step Numbers */}
            <div className="flex justify-center items-center mb-6">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                
                return (
                  <React.Fragment key={stepNumber}>
                    <div className="flex flex-col items-center">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
                        ${isCompleted 
                          ? 'bg-orange-600 border-orange-600 text-white' 
                          : isActive 
                            ? 'bg-orange-600 border-orange-600 text-white' 
                            : 'bg-stone-700 border-stone-600 text-gray-400'
                        }
                      `}>
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-semibold">{stepNumber}</span>
                        )}
                      </div>
                      <div className={`text-xs font-medium mt-1 transition-colors duration-300 ${
                        isActive || isCompleted ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`
                        w-8 h-0.5 mx-2 mt-4 transition-colors duration-300
                        ${isCompleted ? 'bg-orange-600' : 'bg-stone-600'}
                      `} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            {/* Previous/Next Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                variant="outline"
                className="px-6 py-2 border border-stone-600 text-gray-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
            
            {submitError && (
              <div className="mt-4 text-red-400 text-sm bg-red-900/20 border border-red-600 p-3 rounded-md max-w-md mx-auto">
                {submitError}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantApplicationPage;