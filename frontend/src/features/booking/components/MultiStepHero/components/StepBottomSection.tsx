import React from 'react';
import { Button } from '@/shared/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepBottomSectionProps {
  onBackToHome: () => void;
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextText?: string;
  averageRating: number;
  totalReviews: number;
}

const StepBottomSection: React.FC<StepBottomSectionProps> = ({
  onBackToHome,
  onBack,
  onNext,
  showBack = true,
  showNext = true,
  nextText = 'Continue',
  averageRating,
  totalReviews,
}) => {
  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        <Button
          onClick={onBackToHome}
          variant="outline-white"
          size="lg"
          className="px-8"
        >
          Back to Home
        </Button>

        {showBack && onBack && (
          <Button
            onClick={onBack}
            variant="outline-white"
            size="lg"
            className="px-8"
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Back
          </Button>
        )}

        {showNext && (
          <Button
            onClick={onNext || (() => console.log('No onNext function provided'))}
            variant="primary"
            size="lg"
            className="px-8"
            rightIcon={<ArrowRight className="h-5 w-5" />}
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
