import React, { useState } from 'react';
import { Check, CreditCard, DollarSign } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { Payment } from '../schemas/booking.schemas';

interface StepPaymentProps {
  onNext: (paymentData: Payment) => void;
  onPrevious: () => void;
  initialData?: Payment;
  totalAmount: number;
}

const StepPayment: React.FC<StepPaymentProps> = ({ 
  onNext, 
  onPrevious, 
  initialData,
  totalAmount 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>(
    initialData?.method || 'card'
  );
  const [cardNumber, setCardNumber] = useState(initialData?.cardNumber || '');
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || '');
  const [cvv, setCvv] = useState(initialData?.cvv || '');
  const [billingAddress, setBillingAddress] = useState(initialData?.billingAddress || {
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleNext = () => {
    const paymentData: Payment = {
      method: paymentMethod,
      ...(paymentMethod === 'card' && {
        cardNumber,
        expiryDate,
        cvv,
        billingAddress
      })
    };
    onNext(paymentData);
  };

  const isComplete = paymentMethod !== 'card' || 
    (cardNumber && expiryDate && cvv);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] ?? '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
      
      {/* Total Amount */}
      <div className="mb-6 p-4 bg-orange-400/10 border border-orange-400/20 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total Amount</span>
          <span className="text-2xl font-bold text-orange-400">
            ${totalAmount.toFixed(0)}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <div className="block text-sm font-medium text-gray-300 mb-3">
          Payment Method
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => { setPaymentMethod('card'); }}
            className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
              paymentMethod === 'card'
                ? 'border-orange-400 bg-orange-400/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Credit Card</span>
          </button>
          <button
            onClick={() => { setPaymentMethod('cash'); }}
            className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
              paymentMethod === 'cash'
                ? 'border-orange-400 bg-orange-400/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Cash</span>
          </button>
          <button
            onClick={() => { setPaymentMethod('check'); }}
            className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
              paymentMethod === 'check'
                ? 'border-orange-400 bg-orange-400/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>Check</span>
          </button>
        </div>
      </div>

      {/* Card Information */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-2">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={(e) => { setExpiryDate(formatExpiryDate(e.target.value)); }}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-2">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => { setCvv(e.target.value.replace(/\D/g, '').substring(0, 4)); }}
                placeholder="123"
                maxLength={4}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Billing Address</h4>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
                Street Address
              </label>
              <input
                id="street"
                type="text"
                value={billingAddress.street}
                onChange={(e) => { setBillingAddress(prev => ({ ...prev, street: e.target.value })); }}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={billingAddress.city}
                  onChange={(e) => { setBillingAddress(prev => ({ ...prev, city: e.target.value })); }}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={billingAddress.state}
                  onChange={(e) => { setBillingAddress(prev => ({ ...prev, state: e.target.value })); }}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-2">
                ZIP Code
              </label>
              <input
                id="zipCode"
                type="text"
                value={billingAddress.zipCode}
                onChange={(e) => { setBillingAddress(prev => ({ ...prev, zipCode: e.target.value })); }}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cash/Check Payment Info */}
      {(paymentMethod === 'cash' || paymentMethod === 'check') && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-semibold mb-2">
            {paymentMethod === 'cash' ? 'Cash Payment' : 'Check Payment'}
          </h4>
          <p className="text-gray-300 text-sm">
            {paymentMethod === 'cash' 
              ? 'Payment will be collected upon completion of service.'
              : 'Please have your check ready for the service technician.'
            }
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="mb-6 p-4 bg-green-400/10 border border-green-400/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-semibold">Secure Payment</span>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="secondary"
          size="md"
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="primary"
          size="md"
          className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg"
          disabled={!isComplete}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Complete Booking
        </Button>
      </div>
    </div>
  );
};

export default StepPayment;
