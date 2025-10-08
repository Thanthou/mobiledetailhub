import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-orange-600 border-orange-600 text-white' 
                      : isActive 
                        ? 'bg-orange-600 border-orange-600 text-white' 
                        : 'bg-stone-700 border-stone-600 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium transition-colors duration-300 ${
                    isActive || isCompleted ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className={`
                  flex-1 h-0.5 mx-4 transition-colors duration-300
                  ${isCompleted ? 'bg-orange-600' : 'bg-stone-600'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
