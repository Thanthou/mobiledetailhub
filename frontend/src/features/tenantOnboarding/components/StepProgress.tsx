import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  steps: Array<{ id: number; label: string }>;
  currentStep: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6 sm:py-8">
      <div className="flex justify-center items-center px-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2
                    transition-all duration-300 relative
                    ${
                      isCompleted
                        ? 'bg-orange-600 border-orange-600 text-white scale-100'
                        : isActive
                        ? 'bg-orange-600 border-orange-600 text-white scale-110 shadow-lg shadow-orange-600/50'
                        : 'bg-stone-800 border-stone-600 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <span className="text-sm sm:text-base font-semibold">{step.id + 1}</span>
                  )}
                </div>
                <div
                  className={`
                    text-xs sm:text-sm font-medium mt-2 text-center transition-colors
                    ${isActive ? 'text-orange-600' : isCompleted ? 'text-gray-300' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </div>
              </div>

              {!isLast && (
                <div
                  className={`
                    h-0.5 w-12 sm:w-20 lg:w-24 mx-2 sm:mx-4 mb-6 transition-all duration-500
                    ${isCompleted ? 'bg-orange-600' : 'bg-stone-700'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
