import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

import { type PricingPlan,pricingPlans } from '../types';

interface PlanSelectionSectionProps {
  selectedPlan: string;
  onSelectPlan: (planId: 'starter' | 'metro' | 'pro', price: number) => void;
}

export const PlanSelectionSection: React.FC<PlanSelectionSectionProps> = ({
  selectedPlan,
  onSelectPlan,
}) => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Select the perfect plan for your business. All plans include a 14-day money-back guarantee.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 items-stretch">
        {pricingPlans.map((plan: PricingPlan) => {
          const isSelected = selectedPlan === plan.id;
          const isHovered = hoveredPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`
                relative rounded-2xl border-2 transition-all duration-300 flex flex-col h-full
                ${
                  isSelected
                    ? 'border-cyan-500 bg-gray-800 shadow-xl shadow-cyan-500/20 scale-105'
                    : isHovered
                    ? 'border-cyan-400 bg-gray-800/80 scale-102'
                    : 'border-gray-700 bg-gray-800/60'
                }
                ${plan.popular ? 'lg:scale-105 lg:z-10' : ''}
              `}
              onMouseEnter={() => { setHoveredPlan(plan.id); }}
              onMouseLeave={() => { setHoveredPlan(null); }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8 flex flex-col h-full">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-400 text-base sm:text-lg">/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => { onSelectPlan(plan.id, plan.price * 100); }}
                  className={`
                    w-full py-3 sm:py-3.5 px-6 rounded-lg font-semibold text-base sm:text-lg
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 focus:ring-cyan-500'
                        : 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'
                    }
                  `}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center px-4">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>14-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>No setup fees</span>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-gray-500 mt-4">
          <span>Powered by Stripe</span>
          <span className="hidden sm:inline">•</span>
          <span>SSL Secure</span>
          <span className="hidden sm:inline">•</span>
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  );
};

