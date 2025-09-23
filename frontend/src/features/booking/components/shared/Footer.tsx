// Footer component for booking flow
import React from 'react';
import { Star, Lock } from 'lucide-react';

interface FooterProps {
  // Step progress props
  currentStep?: string;
  completedSteps?: string[];
  showStepProgress?: boolean;
  
  // Trust strip props
  averageRating?: number;
  totalReviews?: number;
  showTrustStrip?: boolean;
  
  // Navigation props
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  onSkip?: () => void;
  canGoNext?: boolean;
  canGoBack?: boolean;
  canSkip?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  showNavigation?: boolean;
  
  // Styling
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  // Step progress
  currentStep,
  completedSteps = [],
  showStepProgress = true,
  
  // Trust strip
  averageRating = 4.9,
  totalReviews = 0,
  showTrustStrip = true,
  
  // Navigation
  onNext,
  onBack,
  onCancel,
  onSkip,
  canGoNext = true,
  canGoBack = false,
  canSkip = false,
  isLoading = false,
  nextLabel = 'Continue',
  backLabel = 'Back',
  skipLabel = 'Skip',
  showNavigation = true,
  
  className = '',
}) => {
  const stepOrder = ['vehicle-selection', 'location', 'service-tier', 'addons', 'schedule', 'payment'];
  const stepLabels = {
    'vehicle-selection': 'Vehicle',
    'location': 'Location',
    'service-tier': 'Service',
    'addons': 'Addons',
    'schedule': 'Schedule',
    'payment': 'Payment',
  };

  const getStepStatus = (step: string, _index: number) => {
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'current';
    if (stepOrder.indexOf(step) < stepOrder.indexOf(currentStep || '')) return 'completed';
    return 'upcoming';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Step Progress */}
      {showStepProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-6">
            {stepOrder.map((step, index) => {
              const status = getStepStatus(step, index);
              const isLast = index === stepOrder.length - 1;

              return (
                <div key={step} className="flex items-center">
                  {/* Step Label */}
                  <p
                    className={`
                      text-lg font-medium
                      ${
                        status === 'completed' || status === 'current'
                          ? 'text-orange-500'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {stepLabels[step as keyof typeof stepLabels]}
                  </p>

                  {/* Connector Dot */}
                  {!isLast && (
                    <div className="mx-4">
                      <div className="w-1 h-1 bg-gray-600 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {showNavigation && (
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Exit
          </button>
          
          {canGoBack && onBack && (
            <button
              onClick={onBack}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          
          {canSkip && onSkip && (
            <button
              onClick={onSkip}
              disabled={isLoading}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              {skipLabel}
            </button>
          )}
          
          <button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : nextLabel}
          </button>
        </div>
      )}

      {/* Trust Strip */}
      {showTrustStrip && (
        <div className="mt-8 mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 place-items-center">
              <div className="flex items-center text-white">
                <Star className="h-5 w-5 text-orange-500 mr-2" />
                <a 
                  href="https://share.google/dAerqNUgo3WpYeJwP" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-semibold hover:text-orange-400 transition-colors duration-200"
                >
                  {averageRating}/5 ({totalReviews} reviews)
                </a>
              </div>
              <div className="flex items-center text-white">
                <Lock className="h-5 w-5 text-orange-500 mr-2" />
                <span>Secure checkout via <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors duration-200">Stripe</a></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
