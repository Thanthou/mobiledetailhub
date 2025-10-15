import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, Shield, AlertCircle } from 'lucide-react';

import { Input } from '@/shared/ui';
import { env, config } from '@/shared/env';

import type { Address } from '../types';
import { addressSchema } from '../utils/validation';

interface PaymentSectionProps {
  formData: {
    selectedPlan: string;
    planPrice: number;
    billingAddress: Address;
    useSameAddress: boolean;
    firstName: string;
    lastName: string;
    personalEmail: string;
    personalPhone: string;
    businessName: string;
    businessPhone: string;
    businessEmail: string;
    businessAddress: Address;
    industry: string;
    defaults: unknown;
  };
  businessAddress: Address;
  onAddressChange: (field: keyof Address, value: string) => void;
  onToggleSameAddress: (value: boolean) => void;
  onPaymentSuccess: (data: { slug: string; websiteUrl: string; dashboardUrl: string }) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  formData,
  onAddressChange,
  onToggleSameAddress,
  onPaymentSuccess,
  errors,
  setErrors,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const validateField = (field: string, value: string) => {
    try {
      const addressField = field.split('.')[1] as keyof Address;
      switch (addressField) {
        case 'address':
          addressSchema.pick({ address: true }).parse({ address: value });
          break;
        case 'city':
          addressSchema.pick({ city: true }).parse({ city: value });
          break;
        case 'state':
          addressSchema.pick({ state: true }).parse({ state: value });
          break;
        case 'zip':
          addressSchema.pick({ zip: true }).parse({ zip: value });
          break;
      }
      setErrors({ ...errors, [field]: '' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid input';
      setErrors({ ...errors, [field]: message });
    }
  };

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
  };

  // Create payment intent when component mounts
  React.useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/payments/create-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: formData.planPrice,
            customerEmail: formData.personalEmail,
            businessName: formData.businessName,
            planType: formData.selectedPlan,
            metadata: {
              industry: formData.industry,
            }
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          setClientSecret(result.clientSecret);
        } else {
          setCardError(result.error || 'Failed to initialize payment');
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
          setCardError('Unable to connect to server. Please check your network connection.');
        } else {
          setCardError('Failed to initialize payment');
        }
      }
    };

    void createPaymentIntent();
  }, [formData.planPrice, formData.personalEmail, formData.businessName, formData.selectedPlan, formData.industry]);

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      setCardError('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    setCardError('');

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.personalEmail,
              phone: formData.personalPhone,
              address: {
                line1: formData.billingAddress.address,
                city: formData.billingAddress.city,
                state: formData.billingAddress.state,
                postal_code: formData.billingAddress.zip,
                country: 'US',
              },
            },
          },
        }
      );

      if (stripeError) {
        setCardError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Generate a temporary password for the user
        const tempPassword = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);

        // Confirm payment and create tenant (let backend handle password hashing)
        const confirmResponse = await fetch(`${config.apiBaseUrl}/api/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            tenantData: {
              ...formData,
              tempPassword, // Send plain password, let backend hash it
            }
          }),
        });

        const confirmResult = await confirmResponse.json();
        
        if (confirmResult.success) {
          // Store the temporary password for the success page
          sessionStorage.setItem('tempPassword', tempPassword);
          sessionStorage.setItem('tenantEmail', formData.personalEmail);
          
          // Call success callback
          onPaymentSuccess(confirmResult.data);
        } else {
          setCardError(confirmResult.error || 'Failed to create your account');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setCardError('Unable to connect to server. Please check your network connection.');
      } else {
        setCardError('Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };


  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#78716c',
        },
      },
      invalid: {
        color: '#f87171',
        iconColor: '#f87171',
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-stone-800 border border-stone-700 rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-stone-700">
          <h2 className="text-white text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            Payment Information
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="bg-stone-700/50 border border-stone-600 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Selected Plan</p>
                <p className="text-xl font-bold text-white capitalize mt-1">
                  {formData.selectedPlan}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Monthly</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  ${(formData.planPrice / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-600">
              <p className="text-xs text-gray-400">
                Billed monthly. Cancel anytime. 14-day money-back guarantee.
              </p>
            </div>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-300 mb-3">
              Card Information <span className="text-orange-500">*</span>
            </div>
            <div className="bg-stone-700 border border-stone-600 rounded-lg p-4">
              <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
            </div>
            {cardError && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{cardError}</span>
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span>Your payment information is encrypted and secure</span>
            </div>
            
            {/* Test Card Information for Development */}
            {env.DEV && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-400 mb-2">🧪 Test Cards (Development)</h4>
                <div className="text-xs text-yellow-300 space-y-1">
                  <p><strong>Success:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Decline:</strong> 4000 0000 0000 0002</p>
                  <p><strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sameAddress"
                checked={formData.useSameAddress}
                onChange={(e) => { onToggleSameAddress(e.target.checked); }}
                className="w-4 h-4 rounded border-stone-600 text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-800 bg-stone-700"
              />
              <label htmlFor="sameAddress" className="text-sm text-gray-300 cursor-pointer">
                Billing address same as business address
              </label>
            </div>

            {!formData.useSameAddress && (
              <div className="space-y-4 pt-2">
                <h3 className="text-white text-base sm:text-lg font-medium">Billing Address</h3>

                <Input
                  label="Street Address"
                  type="text"
                  value={formData.billingAddress.address}
                  onChange={(e) => { onAddressChange('address', e.target.value); }}
                  onBlur={() => { validateField('billingAddress.address', formData.billingAddress.address); }}
                  error={errors['billingAddress.address'] || ''}
                  placeholder="123 Main Street"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="City"
                      type="text"
                      value={formData.billingAddress.city}
                      onChange={(e) => { onAddressChange('city', e.target.value); }}
                      onBlur={() => { validateField('billingAddress.city', formData.billingAddress.city); }}
                      error={errors['billingAddress.city'] || ''}
                      placeholder="San Francisco"
                      required
                    />
                  </div>

                  <Input
                    label="State"
                    type="text"
                    value={formData.billingAddress.state}
                    onChange={(e) => { onAddressChange('state', e.target.value.toUpperCase()); }}
                    onBlur={() => { validateField('billingAddress.state', formData.billingAddress.state); }}
                    error={errors['billingAddress.state'] || ''}
                    placeholder="CA"
                    required
                    maxLength={2}
                    helperText="2 letters"
                  />
                </div>

                <Input
                  label="ZIP Code"
                  type="text"
                  value={formData.billingAddress.zip}
                  onChange={(e) => { onAddressChange('zip', e.target.value); }}
                  onBlur={() => { validateField('billingAddress.zip', formData.billingAddress.zip); }}
                  error={errors['billingAddress.zip'] || ''}
                  placeholder="94102"
                  required
                  maxLength={10}
                />
              </div>
            )}
          </div>

          {/* Payment Button */}
          <div className="pt-4 border-t border-stone-700">
            <button
              type="button"
              onClick={handlePayment}
              disabled={!stripe || !clientSecret || isProcessing}
              className={`
                w-full py-4 px-6 rounded-lg font-semibold text-lg
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800
                ${
                  !stripe || !clientSecret || isProcessing
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
                }
              `}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                `Complete Purchase - $${(formData.planPrice / 100).toFixed(2)}`
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-2">
              You'll be charged ${(formData.planPrice / 100).toFixed(2)} monthly. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-700">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">PCI Compliant</p>
                <p className="text-xs text-gray-400 mt-0.5">Bank-level security</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">256-bit SSL</p>
                <p className="text-xs text-gray-400 mt-0.5">Encrypted connection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Money-back</p>
                <p className="text-xs text-gray-400 mt-0.5">14-day guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
