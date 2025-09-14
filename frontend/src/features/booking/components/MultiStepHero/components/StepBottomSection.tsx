import React from 'react';
import { Button } from '@/shared/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepBottomSectionProps {
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextText?: string;
  averageRating: number;
  totalReviews: number;
  currentStep?: number;
  totalSteps?: number;
  disabled?: boolean;
}

const StepBottomSection: React.FC<StepBottomSectionProps> = ({
  onBack,
  onNext,
  showBack = true,
  showNext = true,
  nextText = 'Continue',
  averageRating,
  totalReviews,
  currentStep,
  totalSteps,
  disabled = false,
}) => {
  return (
    <div className="-mt-8">
      {/* Step Counter */}
      {currentStep && totalSteps && (
        <div className="flex justify-center mb-6">
          <div className="bg-stone-700/50 backdrop-blur-sm rounded-xl px-6 py-3">
            <div className="flex items-center space-x-6">
              <span className={`text-lg font-semibold ${currentStep >= 1 ? 'text-orange-500' : 'text-stone-400'}`}>
                Vehicle
              </span>
              <span className="text-stone-500 text-lg">•</span>
              <span className={`text-lg font-semibold ${currentStep >= 2 ? 'text-orange-500' : 'text-stone-400'}`}>
                Service
              </span>
              <span className="text-stone-500 text-lg">•</span>
              <span className={`text-lg font-semibold ${currentStep >= 3 ? 'text-orange-500' : 'text-stone-400'}`}>
                Addons
              </span>
              <span className="text-stone-500 text-lg">•</span>
              <span className={`text-lg font-semibold ${currentStep >= 4 ? 'text-orange-500' : 'text-stone-400'}`}>
                Schedule
              </span>
              <span className="text-stone-500 text-lg">•</span>
              <span className={`text-lg font-semibold ${currentStep >= 5 ? 'text-orange-500' : 'text-stone-400'}`}>
                Payment
              </span>
            </div>
          </div>
        </div>
      )}


      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {showBack && onBack && (
          <Button
            onClick={onBack}
            variant="outline-white"
            size="lg"
            className="px-12 min-w-[180px] text-lg py-4"
            leftIcon={<ArrowLeft className="h-7 w-7" />}
          >
            Back
          </Button>
        )}

        {showNext && (
          <Button
            onClick={disabled ? undefined : (onNext || (() => {}))}
            variant="primary"
            size="lg"
            className={`px-12 min-w-[180px] text-lg py-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={disabled ? { cursor: 'not-allowed' } : {}}
            rightIcon={<ArrowRight className="h-7 w-7" />}
            disabled={disabled}
          >
            {nextText}
          </Button>
        )}
      </div>

      {/* Trust Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 place-items-center">
          <div className="flex items-center text-white">
            <div className="flex items-center">
              <span className="text-3xl mr-3">⭐</span>
              <span className="font-semibold text-lg">{averageRating}/5 ({totalReviews} reviews)</span>
            </div>
          </div>
          <div className="flex items-center text-white">
            <div className="flex items-center">
              <span className="text-3xl mr-3">🔒</span>
              <span className="font-semibold text-lg">Secure with Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBottomSection;
