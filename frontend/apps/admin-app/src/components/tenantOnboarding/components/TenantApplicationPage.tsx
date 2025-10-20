import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChevronLeft } from 'lucide-react';

import { config } from '@shared/env';
import { useBrowserTab } from '@shared/hooks';
import { Button } from '@shared/ui';
import { type IndustrySlug,loadDefaults } from '@shared/utils/loadDefaults';

import { useAutoSave } from '../hooks/useAutoSave';
import {
  type PreviewState,
  type TenantApplication,
  tenantApplicationDefaultValues,
} from '../types';
import {
  businessInfoSchema,
  personalInfoSchema,
  planSelectionSchema,
} from '../utils/validation';
import ApplicationHeader from './ApplicationHeader';
import BusinessInformationSection from './BusinessInformationSection';
import PaymentSection from './PaymentSection';
import PersonalInformationSection from './PersonalInformationSection';
import { PlanSelectionSection } from './PlanSelectionSection';
import { StepProgress } from './StepProgress';
import SuccessPage from './SuccessPage';

// Initialize Stripe
const stripePromise = loadStripe(config.stripePublishableKey);

const STEPS = [
  { id: 0, label: 'Plan' },
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Business' },
  { id: 3, label: 'Payment' },
];

const TenantApplicationPage: React.FC = () => {
  const location = useLocation();
  const previewData = location.state as PreviewState | null;

  const [formData, setFormData] = useState<TenantApplication>(tenantApplicationDefaultValues);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Set browser tab title and favicon for onboarding page
  // Automatically uses platform logo (/shared/icons/logo.png) and default title
  useBrowserTab({
    useBusinessName: false, // Platform page, not tenant-specific
  });

  const { loadFromLocalStorage, clearSavedData } = useAutoSave({
    formData,
    enabled: currentStep > 0,
  });

  // Load saved draft or preview data on mount
  useEffect(() => {
    const loadSavedData = () => {
      const localData = loadFromLocalStorage();

      if (localData) {
        // Automatically restore saved draft without confirmation popup
        setFormData(localData);
        setCurrentStep(localData.step);
        return;
      }

      // Pre-fill from preview data if available
      if (previewData?.fromPreview) {
        setFormData((prev) => ({
          ...prev,
          businessName: previewData.businessName || prev.businessName,
          businessPhone: previewData.phone || prev.businessPhone,
          businessAddress: {
            ...prev.businessAddress,
            city: previewData.city || prev.businessAddress.city,
            state: previewData.state || prev.businessAddress.state,
          },
          industry: previewData.industry,
        }));
      }
    };

    loadSavedData();
  }, [loadFromLocalStorage, previewData, clearSavedData]);

  // Warn user before leaving if form is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep > 0 && currentStep < STEPS.length - 1) {
        e.preventDefault();
        // Modern browsers will show a generic confirmation dialog
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => { window.removeEventListener('beforeunload', handleBeforeUnload); };
  }, [currentStep]);

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleAddressChange = (
    addressType: 'businessAddress' | 'billingAddress',
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [addressType]: { ...prev[addressType], [field]: value },
    }));
  };

  const handlePlanSelect = (planId: 'starter' | 'pro' | 'enterprise', price: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlan: planId,
      planPrice: price,
    }));
  };

  const handleToggleSameAddress = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      useSameAddress: value,
      billingAddress: value ? prev.businessAddress : prev.billingAddress,
    }));
  };

  const validateStep = async (step: number): Promise<boolean> => {
    try {
      switch (step) {
        case 0:
          planSelectionSchema.parse({
            selectedPlan: formData.selectedPlan,
            planPrice: formData.planPrice,
          });
          return true;

        case 1: {
          // First, validate the schema
          personalInfoSchema.parse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            personalPhone: formData.personalPhone,
            personalEmail: formData.personalEmail,
          });

          // Then check if email already exists
          try {
            // Debug API URL configuration
            // console.log('Check-email API URL config:', {
            //   apiUrl: config.apiUrl,
            //   apiBaseUrl: config.apiBaseUrl,
            //   isDevelopment: config.isDevelopment,
            //   fullUrl: `${config.apiUrl || ''}/api/auth/check-email?email=${encodeURIComponent(formData.personalEmail)}`
            // });
            
            // eslint-disable-next-line no-restricted-globals, no-restricted-syntax -- Isolated onboarding check, API client refactor planned
            const response = await fetch(`${config.apiUrl || ''}/api/auth/check-email?email=${encodeURIComponent(formData.personalEmail)}`);
            
            if (!response.ok) {
              throw new Error(`Email check failed: ${response.status} ${response.statusText}`);
            }
            
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Response typing improvement planned
            const result = await response.json();
            
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Response typing improvement planned
            if (result.exists) {
              setErrors({ personalEmail: 'An account with this email already exists' });
              return false;
            }
          } catch (emailCheckError) {
            console.error('Error checking email:', emailCheckError);
            // Show a warning but allow them to proceed
            setErrors({ personalEmail: 'Unable to verify email availability. You can still proceed - duplicates will be caught during signup.' });
            // Don't block the user, just warn them
          }
          
          return true;
        }

        case 2:
          businessInfoSchema.parse({
            businessName: formData.businessName,
            businessPhone: formData.businessPhone,
            businessEmail: formData.businessEmail,
            businessAddress: formData.businessAddress,
            industry: formData.industry,
          });
          return true;

        case 3:
          return true;

        default:
          return false;
      }
    } catch (error: unknown) {
      const newErrors: Record<string, string> = {};
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> };
        zodError.errors.forEach((err) => {
          const field = err.path.join('.');
          newErrors[field] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const goToNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      const nextStep = currentStep + 1;
      setFormData((prev) => ({ ...prev, step: nextStep }));
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setFormData((prev) => ({ ...prev, step: prevStep }));
      setCurrentStep(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePaymentSuccess = (data: { slug: string; websiteUrl: string; dashboardUrl: string }) => {
    // Store the new tenant information for the success page
    sessionStorage.setItem('newTenantSlug', data.slug);
    sessionStorage.setItem('newTenantWebsiteUrl', data.websiteUrl);
    sessionStorage.setItem('newTenantDashboardUrl', data.dashboardUrl);

    clearSavedData();
    setIsSuccess(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For payment step, the payment processing is handled by PaymentSection
    if (currentStep === 3) {
      return; // Payment is handled by the payment component
    }

    const isValid = await validateStep(currentStep);
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Load industry-specific defaults for non-payment steps
      if (currentStep === 2) { // Business info step
        const industry = (formData.industry || 'mobile-detailing') as IndustrySlug;
        const defaults = await loadDefaults(industry);
        setFormData(prev => ({ ...prev, defaults }));
      }

      // Move to next step
      const nextStep = currentStep + 1;
      setFormData((prev) => ({ ...prev, step: nextStep }));
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Step validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to proceed. Please try again.';
      alert(errorMessage);
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

      <div className="pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepProgress steps={STEPS} currentStep={currentStep} />

          <form onSubmit={(e) => { void handleSubmit(e); }} className="pb-6">
            <div className="min-h-[400px] flex items-center justify-center">
              {currentStep === 0 && (
                <PlanSelectionSection
                  selectedPlan={formData.selectedPlan}
                  onSelectPlan={handlePlanSelect}
                />
              )}

              {currentStep === 1 && (
                <PersonalInformationSection
                  formData={formData}
                  handleInputChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <BusinessInformationSection
                  formData={formData}
                  handleInputChange={handleFieldChange}
                  handleAddressChange={(field, value) => {
                    handleAddressChange('businessAddress', field, value);
                  }}
                />
              )}

              {currentStep === 3 && (
                <Elements stripe={stripePromise}>
                  <PaymentSection
                    formData={formData}
                    businessAddress={formData.businessAddress}
                    onAddressChange={(field, value) => {
                      handleAddressChange('billingAddress', field, value);
                    }}
                    onToggleSameAddress={handleToggleSameAddress}
                    onPaymentSuccess={handlePaymentSuccess}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </Elements>
              )}
            </div>

            <div className="max-w-2xl mx-auto mt-8 px-4">
              <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 sm:gap-4">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    onClick={goToPreviousStep}
                    variant="outline"
                    size="lg"
                    className="flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => { void goToNextStep(); }}
                    variant="primary"
                    size="lg"
                    className={currentStep === 0 ? 'w-full' : ''}
                    disabled={currentStep === 0 && !formData.selectedPlan}
                  >
                    {currentStep === 0 ? 'Get Started' : 'Continue'}
                  </Button>
                ) : currentStep !== 3 ? (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                  </Button>
                ) : null}
              </div>

              {currentStep > 0 && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  Your progress is automatically saved
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantApplicationPage;
