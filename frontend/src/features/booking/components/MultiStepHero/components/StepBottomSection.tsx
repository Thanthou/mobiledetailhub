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
    <>
      {/* Step Counter */}
      {currentStep && totalSteps && (
        <div className="flex justify-center mb-4">
          <div className="bg-stone-700/50 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-semibold ${currentStep >= 1 ? 'text-orange-500' : 'text-stone-400'}`}>
                Vehicle
              </span>
              <span className="text-stone-500">•</span>
              <span className={`text-sm font-semibold ${currentStep >= 2 ? 'text-orange-500' : 'text-stone-400'}`}>
                Service
              </span>
              <span className="text-stone-500">•</span>
              <span className={`text-sm font-semibold ${currentStep >= 3 ? 'text-orange-500' : 'text-stone-400'}`}>
                Addons
              </span>
              <span className="text-stone-500">•</span>
              <span className={`text-sm font-semibold ${currentStep >= 4 ? 'text-orange-500' : 'text-stone-400'}`}>
                Schedule
              </span>
              <span className="text-stone-500">•</span>
              <span className={`text-sm font-semibold ${currentStep >= 5 ? 'text-orange-500' : 'text-stone-400'}`}>
                Payment
              </span>
            </div>
          </div>
        </div>
      )}


      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {showBack && onBack && (
          <Button
            onClick={onBack}
            variant="outline-white"
            size="lg"
            className="px-8 min-w-[120px]"
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Back
          </Button>
        )}

        {showNext && (
          <Button
            onClick={disabled ? undefined : (onNext || (() => {}))}
            variant="primary"
            size="lg"
            className={`px-8 min-w-[120px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={disabled ? { cursor: 'not-allowed' } : {}}
            rightIcon={<ArrowRight className="h-5 w-5" />}
            disabled={disabled}
          >
            {nextText}
          </Button>
        )}
      </div>

      {/* Trust Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 place-items-center">
          <div className="flex items-center text-white">
            <div className="flex items-center">
              <span className="text-xl mr-2">⭐</span>
              <span className="font-semibold text-sm">{averageRating}/5 ({totalReviews} reviews)</span>
            </div>
          </div>
          <div className="flex items-center text-white">
            <div className="flex items-center">
              <span className="text-xl mr-2">🔒</span>
              <span className="font-semibold text-sm">Secure with Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepBottomSection;
