import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

import { Button } from '@/shared/ui';
import { StepContainer, StepBottomSection } from '../components';

interface StepQuoteProps {
  averageRating: number;
  totalReviews: number;
  onBack: () => void;
  onBackToHome: () => void;
}

const StepQuote: React.FC<StepQuoteProps> = ({
  averageRating,
  totalReviews,
  onBack,
  onBackToHome,
}) => {
  return (
    <StepContainer
      bottomSection={
        <StepBottomSection
          onBack={onBack}
          onNext={() => {
            alert('Opening booking wizard...');
          }}
          showBack={true}
          showNext={true}
          nextText="Get Quote"
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      }
    >
      {/* 1. Header Container - Positioned at bottom of header area */}
      <div className="flex flex-col justify-end" style={{ height: '200px' }}>
        <div className="text-center px-4 py-8 border-2 border-yellow-400">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get Your Quote
          </h1>
          <p className="text-xl text-stone-300">
            Ready to book your service? Let's get you a quote
          </p>
        </div>
      </div>

      {/* 2. Green and Purple Side by Side */}
      <div className="flex px-4 py-8 gap-4">
        {/* Green Container - Quote Summary */}
        <div className="flex-1 border-2 border-green-500 p-4">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Quote Summary</h3>
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mr-4" />
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white">Service Selected</h3>
              <p className="text-stone-300">Your booking details are ready</p>
            </div>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center py-2 border-b border-stone-600">
              <span className="text-stone-300">Vehicle Type:</span>
              <span className="text-white font-semibold">Car</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-600">
              <span className="text-stone-300">Service:</span>
              <span className="text-white font-semibold">Premium Auto Detail</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-600">
              <span className="text-stone-300">Tier:</span>
              <span className="text-white font-semibold">Basic Package</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-stone-300">Estimated Price:</span>
              <span className="text-orange-500 font-bold text-xl">$150</span>
            </div>
          </div>
        </div>
        </div>

        {/* Purple Container - Additional Info */}
        <div className="flex-1 border-2 border-purple-500 p-4">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Next Steps</h3>
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-2">Ready to Book?</h4>
            <p className="text-stone-300 text-sm mb-4">
              Your quote is ready! Click "Get Quote" to proceed with booking your service.
            </p>
            <div className="text-green-500 font-bold text-lg">
              ✓ All details confirmed
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};

export default StepQuote;
