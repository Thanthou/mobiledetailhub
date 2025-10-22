import React from 'react';

interface PaymentSummaryProps {
  servicePrice: number;
  addonsPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  selectedService?: {
    name: string;
    price: number;
  };
  selectedAddons: Array<{
    name: string;
    price: number;
  }>;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  servicePrice,
  subtotal,
  tax,
  total,
  selectedService,
  selectedAddons
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        {/* Service */}
        {selectedService && (
          <div className="flex justify-between text-gray-300">
            <span>{selectedService.name}</span>
            <span>${servicePrice.toFixed(2)}</span>
          </div>
        )}
        
        {/* Addons */}
        {selectedAddons.map((addon) => (
          <div key={addon.name} className="flex justify-between text-gray-300">
            <span className="text-sm">+ {addon.name}</span>
            <span>${addon.price.toFixed(2)}</span>
          </div>
        ))}
        
        {/* Subtotal */}
        <div className="border-t border-gray-600 pt-3">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between text-gray-300">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        {/* Total */}
        <div className="border-t border-gray-600 pt-3">
          <div className="flex justify-between text-white font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
