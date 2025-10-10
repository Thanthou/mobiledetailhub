import React from 'react';
import { CreditCard } from 'lucide-react';

import { Input } from '@/shared/ui';

interface PaymentSectionProps {
  formData: {
    paymentMethod: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: {
      address: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  handleInputChange: (field: string, value: string) => void;
  handleAddressChange: (field: string, value: string) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  formData,
  handleInputChange,
  handleAddressChange
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </h2>
        <p className="text-gray-400 text-sm mt-1">Complete your tenant application</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Method */}
          <div className="md:col-span-2">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300 mb-2">
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => { handleInputChange('paymentMethod', e.target.value); }}
              className="w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">
              Card Number *
            </label>
            <Input
              id="cardNumber"
              type="text"
              value={formData.cardNumber}
              onChange={(e) => { handleInputChange('cardNumber', e.target.value); }}
              placeholder="1234 5678 9012 3456"
              required
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date *
            </label>
            <Input
              id="expiryDate"
              type="text"
              value={formData.expiryDate}
              onChange={(e) => { handleInputChange('expiryDate', e.target.value); }}
              placeholder="MM/YY"
              required
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* CVV */}
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-2">
              CVV *
            </label>
            <Input
              id="cvv"
              type="text"
              value={formData.cvv}
              onChange={(e) => { handleInputChange('cvv', e.target.value); }}
              placeholder="123"
              required
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Billing Address Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Street Address */}
              <div className="md:col-span-2">
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-300 mb-2">
                  Street Address *
                </label>
                <Input
                  id="billingAddress"
                  type="text"
                  value={formData.billingAddress.address}
                  onChange={(e) => { handleAddressChange('address', e.target.value); }}
                  placeholder="123 Main Street"
                  required
                  className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="billingCity" className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <Input
                  id="billingCity"
                  type="text"
                  value={formData.billingAddress.city}
                  onChange={(e) => { handleAddressChange('city', e.target.value); }}
                  placeholder="Phoenix"
                  required
                  className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* State */}
              <div>
                <label htmlFor="billingState" className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <Input
                  id="billingState"
                  type="text"
                  value={formData.billingAddress.state}
                  onChange={(e) => { handleAddressChange('state', e.target.value); }}
                  placeholder="AZ"
                  required
                  className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={2}
                />
              </div>

              {/* ZIP Code */}
              <div>
                <label htmlFor="billingZip" className="block text-sm font-medium text-gray-300 mb-2">
                  ZIP Code *
                </label>
                <Input
                  id="billingZip"
                  type="text"
                  value={formData.billingAddress.zip}
                  onChange={(e) => { handleAddressChange('zip', e.target.value); }}
                  placeholder="85001"
                  required
                  className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
