import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/shared/ui';

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
import {
  ApplicationHeader,
  BusinessInformationSection,
  PersonalInformationSection,
  PlanSelectionSection,
  StepProgress,
  SuccessPage,
} from './index';
import PaymentSection from './PaymentSection';

// Initialize Stripe (will be configured later)
const stripePromise = loadStripe(
  (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) || 'pk_test_placeholder'
);

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

  const { loadFromLocalStorage, clearSavedData } = useAutoSave({
    formData,
    enabled: currentStep > 0,
  });

  // Load saved draft or preview data on mount
  useEffect(() => {
    const loadSavedData = () => {
      const localData = loadFromLocalStorage();

      if (localData) {
        const shouldRestore = window.confirm(
          'We found a saved draft. Would you like to continue where you left off?'
        );
        if (shouldRestore) {
          setFormData(localData);
          setCurrentStep(localData.step);
          return;
        }
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
  }, [loadFromLocalStorage, previewData]);

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

  const validateStep = (step: number): boolean => {
    try {
      switch (step) {
        case 0:
          planSelectionSchema.parse({
            selectedPlan: formData.selectedPlan,
            planPrice: formData.planPrice,
          });
          return true;

        case 1:
          personalInfoSchema.parse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            personalPhone: formData.personalPhone,
            personalEmail: formData.personalEmail,
          });
          return true;

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

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API submission
      const _applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        personal_phone: formData.personalPhone,
        personal_email: formData.personalEmail,
        business_name: formData.businessName,
        business_phone: formData.businessPhone,
        business_email: formData.businessEmail,
        business_address: formData.businessAddress.address,
        business_city: formData.businessAddress.city,
        business_state: formData.businessAddress.state,
        business_zip: formData.businessAddress.zip,
        industry: formData.industry,
        selected_plan: formData.selectedPlan,
        plan_price: formData.planPrice,
        billing_address: formData.useSameAddress
          ? formData.businessAddress.address
          : formData.billingAddress.address,
        billing_city: formData.useSameAddress
          ? formData.businessAddress.city
          : formData.billingAddress.city,
        billing_state: formData.useSameAddress
          ? formData.businessAddress.state
          : formData.billingAddress.state,
        billing_zip: formData.useSameAddress
          ? formData.businessAddress.zip
          : formData.billingAddress.zip,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => { setTimeout(resolve, 2000); });
      
      // TODO: Replace with proper API call
      // await submitApplication(_applicationData);

      clearSavedData();
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
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

          <form onSubmit={(e) => { void handleSubmit(e); }} className="pb-12">
            <div className="min-h-[500px] flex items-center justify-center">
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
                    onClick={goToNextStep}
                    variant="primary"
                    size="lg"
                    fullWidth={currentStep === 0}
                    disabled={currentStep === 0 && !formData.selectedPlan}
                  >
                    {currentStep === 0 ? 'Get Started' : 'Continue'}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                  </Button>
                )}
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

      <div className="border-t border-stone-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-400">
            <span>100+ businesses trust us</span>
            <span className="hidden sm:inline">•</span>
            <span>SSL Secure</span>
            <span className="hidden sm:inline">•</span>
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantApplicationPage;
