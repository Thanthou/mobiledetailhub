import React, { useState } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

interface StepPaymentProps {
  onPaymentComplete?: () => void;
}

const StepPayment: React.FC<StepPaymentProps> = ({ onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  // TODO: Replace with actual payment methods from API/config
  const paymentMethods: PaymentMethod[] = [];

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    console.log('💳 Payment method selected:', method);
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompleteBooking = () => {
    console.log('🎉 Booking completed!', { paymentMethod, cardDetails });
    onPaymentComplete?.();
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return cardDetails.cardNumber && cardDetails.expiryDate && cardDetails.cvv && cardDetails.name;
    }
    return paymentMethod !== '';
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Step 5: Payment</h1>
      <p className="text-xl text-gray-300 mb-8">Complete your booking</p>
      
      <div className="max-w-2xl mx-auto">
        {/* Payment Method Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === method.id
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="text-white text-sm">{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="mb-8 p-6 bg-gray-800/50 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardDetails.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Booking Summary */}
        <div className="mb-8 p-6 bg-gray-800/50 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Booking Summary</h3>
          <div className="text-gray-300 space-y-2">
            <div>Service: Premium Package - $129</div>
            <div>Add-ons: $25</div>
            <div className="border-t border-gray-600 pt-2 text-orange-500 font-bold">
              Total: $154
            </div>
          </div>
        </div>

        {/* Complete Booking Button */}
        <button
          onClick={handleCompleteBooking}
          disabled={!isFormValid()}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
            isFormValid()
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Complete Booking - $154
        </button>
      </div>
      
      {paymentMethod && (
        <div className="mt-6 text-green-400">
          ✅ Payment method: {paymentMethods.find(m => m.id === paymentMethod)?.name}
        </div>
      )}
    </div>
  );
};

export default StepPayment;
