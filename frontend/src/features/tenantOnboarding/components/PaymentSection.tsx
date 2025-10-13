import React, { useState } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, Shield } from 'lucide-react';

import { Input } from '@/shared/ui';

import type { Address } from '../types';
import { addressSchema } from '../utils/validation';

interface PaymentSectionProps {
  formData: {
    selectedPlan: string;
    planPrice: number;
    billingAddress: Address;
    useSameAddress: boolean;
  };
  businessAddress: Address;
  onAddressChange: (field: keyof Address, value: string) => void;
  onToggleSameAddress: (value: boolean) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  formData,
  onAddressChange,
  onToggleSameAddress,
  errors,
  setErrors,
}) => {
  const [cardError, setCardError] = useState<string>('');

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

  const handleCardChange = (event: { error?: { message: string } }) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
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
            {cardError && <p className="mt-2 text-sm text-red-400">{cardError}</p>}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span>Your payment information is encrypted and secure</span>
            </div>
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
                  error={errors['billingAddress.address']}
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
                      error={errors['billingAddress.city']}
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
                    error={errors['billingAddress.state']}
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
                  error={errors['billingAddress.zip']}
                  placeholder="94102"
                  required
                  maxLength={10}
                />
              </div>
            )}
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
