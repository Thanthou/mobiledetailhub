import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScheduleOptions, useTimeSlots } from '@/features/booking/hooks';
import { useBookingSchedule, useBookingData } from '@/features/booking/state';

interface StepScheduleProps {
  onScheduleSelected?: (schedule: { date: string; time: string }) => void;
}

const StepSchedule: React.FC<StepScheduleProps> = ({ onScheduleSelected }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get booking data from narrow selectors
  const { bookingData } = useBookingData();
  const { schedule, setSchedule } = useBookingSchedule();
  
  // Extract dates and time from schedule
  const selectedDates = schedule.dates || [];
  const selectedTime = schedule.time || '';
  
  // Load schedule options (using mock location/service IDs for now)
  const { data: scheduleOptions, isLoading, error } = useScheduleOptions('mock-location', 'mock-service');
  
  // Get time slots for first selected date (if any)
  const { timeSlots } = useTimeSlots(selectedDates[0] || '', 'mock-location', 'mock-service');
  
  // Convert schedule options to date options
  const availableDates = useMemo(() => {
    if (!scheduleOptions) return [];
    
    return scheduleOptions
      .filter(option => option.available)
      .map(option => ({
        value: option.date,
        label: new Date(option.date).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      }));
  }, [scheduleOptions]);

  const handleDateSelect = (date: string) => {
    // Toggle selection - if already selected, remove it; if not selected, add it
    const newDates = selectedDates.includes(date)
      ? selectedDates.filter(d => d !== date) // Remove date from selection
      : [...selectedDates, date].sort(); // Add date to selection
    
    // Update store immediately
    setSchedule({ dates: newDates, time: selectedTime });
  };

  const handleTimeSelect = (time: string) => {
    // Update store immediately
    setSchedule({ dates: selectedDates, time });
  };


  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Check if we can navigate to previous month
  const canNavigatePrev = () => {
    const today = new Date();
    const currentMonthYear = currentMonth.getFullYear() * 12 + currentMonth.getMonth();
    const todayMonthYear = today.getFullYear() * 12 + today.getMonth();
    return currentMonthYear > todayMonthYear;
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-300 mb-8">Loading available times...</p>
        <div className="animate-pulse bg-gray-700 h-32 rounded-lg max-w-4xl mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-xl text-red-400 mb-8">Error loading schedule options</p>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-300">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      
      <div className="max-w-4xl mx-auto">
        {/* Date Selection - Calendar */}
        <div className="mb-8 mt-48">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-gray-600/50">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                disabled={!canNavigatePrev()}
                className={`p-2 rounded-lg border transition-all ${
                  canNavigatePrev()
                    ? 'border-gray-600 hover:border-gray-500 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg border border-gray-600 hover:border-gray-500 text-white transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {/* Calendar Header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-300 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {(() => {
                const today = new Date();
                const month = currentMonth.getMonth();
                const year = currentMonth.getFullYear();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());
                
                const calendarDays = [];
                const currentDate = new Date(startDate);
                
                // Generate 6 weeks of calendar
                for (let week = 0; week < 6; week++) {
                  for (let day = 0; day < 7; day++) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const isCurrentMonth = currentDate.getMonth() === month;
                    const isPast = currentDate < today;
                    const isAvailable = scheduleOptions?.some(option => option.date === dateStr && option.available) || false;
                    const isSelected = selectedDates.includes(dateStr);
                    
                    calendarDays.push(
                      <button
                        key={dateStr}
                        onClick={() => isAvailable && !isPast && handleDateSelect(dateStr)}
                        disabled={!isAvailable || isPast}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          isSelected
                            ? 'border-green-500 bg-green-500/20 text-white'
                            : isAvailable && !isPast
                            ? 'border-gray-600 hover:border-gray-500 text-white'
                            : 'border-gray-700 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                        } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                      >
                        {currentDate.getDate()}
                      </button>
                    );
                    
                    currentDate.setDate(currentDate.getDate() + 1);
                  }
                }
                
                return calendarDays;
              })()}
            </div>
            
          </div>
          
          {/* Arrival Time Information */}
          <div className="text-center text-gray-300 mt-6">
            <ul className="inline-block text-left list-disc list-inside space-y-1 text-lg md:text-xl">
              <li>Arrival times are typically between 6am - 9am.</li>
              <li>You do not need to be present for vehicle service.</li>
              <li>We will contact you to discuss the specifics about your service.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StepSchedule;
