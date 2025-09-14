import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

import { Button } from '@/shared/ui';
import { StepContainer, StepBottomSection } from '../components';

interface BookingScheduleProps {
  averageRating: number;
  totalReviews: number;
  onBack: () => void;
  onBackToHome: () => void;
}

const BookingSchedule: React.FC<BookingScheduleProps> = ({
  averageRating,
  totalReviews,
  onBack,
  onBackToHome,
}) => {
  return (
    <StepContainer>
      <div className="flex-1 flex flex-col px-4 py-8">
        {/* Main Content */}
        <div className="flex flex-col justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          <div>
            {/* Scheduling Interface */}
            <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Schedule Your Service</h3>
              
              <div className="space-y-8">
                {/* Date Selection */}
                <div className="bg-stone-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-6 w-6 text-orange-500 mr-3" />
                    <h4 className="text-lg font-semibold text-orange-500">Select Date</h4>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-stone-300 text-lg">Calendar component will be implemented here</p>
                    <p className="text-stone-400 text-sm mt-2">Choose your preferred service date</p>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="bg-stone-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 text-orange-500 mr-3" />
                    <h4 className="text-lg font-semibold text-orange-500">Select Time</h4>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-stone-300 text-lg">Time slots will be displayed here</p>
                    <p className="text-stone-400 text-sm mt-2">Choose your preferred service time</p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-stone-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-orange-500 mr-3" />
                    <h4 className="text-lg font-semibold text-orange-500">Service Location</h4>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-stone-300 text-lg">Location details will be shown here</p>
                    <p className="text-stone-400 text-sm mt-2">Confirm your service address</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="-mt-52 pb-4">
          <StepBottomSection
            onBack={onBack}
            onNext={() => {
              // TODO: Implement scheduling logic
              console.log('Schedule confirmed!');
            }}
            showBack={true}
            showNext={true}
            nextText="Confirm Schedule"
            averageRating={averageRating}
            totalReviews={totalReviews}
            currentStep={4}
            totalSteps={5}
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default BookingSchedule;
