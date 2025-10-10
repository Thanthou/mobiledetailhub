import React from 'react';

import { generateTimeSlots } from './scheduleUtils';

interface ScheduleLoadingStateProps {
  viewMode: 'day' | 'week' | 'month';
}

export const ScheduleLoadingState: React.FC<ScheduleLoadingStateProps> = ({ viewMode }) => {
  const timeSlots = generateTimeSlots();

  return (
    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
      <div className="animate-pulse space-y-4">
        {viewMode === 'day' ? (
          timeSlots.map((time) => (
            <div key={time} className="h-12 bg-stone-700 rounded"></div>
          ))
        ) : viewMode === 'week' ? (
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="min-h-[200px] bg-stone-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="h-24 bg-stone-700 rounded"></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

