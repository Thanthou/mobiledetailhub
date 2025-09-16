import React, { useState } from 'react';

interface DateOption {
  value: string;
  label: string;
}

interface StepScheduleProps {
  onScheduleSelected?: (schedule: { date: string; time: string }) => void;
}

const StepSchedule: React.FC<StepScheduleProps> = ({ onScheduleSelected }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // TODO: Replace with actual schedule data from API/config
  const availableDates: DateOption[] = [];
  const timeSlots: string[] = [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (selectedTime) {
      onScheduleSelected?.({ date, time: selectedTime });
    }
    console.log('📅 Date selected:', date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onScheduleSelected?.({ date: selectedDate, time });
    }
    console.log('⏰ Time selected:', time);
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Step 4: Schedule</h1>
      <p className="text-xl text-gray-300 mb-8">Pick your appointment time</p>
      
      <div className="max-w-4xl mx-auto">
        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Select Date</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {availableDates.map((date) => (
              <button
                key={date.value}
                onClick={() => handleDateSelect(date.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedDate === date.value
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-white text-sm">{date.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Select Time</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                disabled={!selectedDate}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTime === time
                    ? 'border-orange-500 bg-orange-500/20'
                    : selectedDate
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="text-white text-sm">{time}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg max-w-md mx-auto">
          <div className="text-white font-medium mb-2">Selected Appointment:</div>
          <div className="text-orange-500">
            📅 {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-orange-500">
            ⏰ {selectedTime}
          </div>
        </div>
      )}
      
      {!selectedDate && (
        <div className="mt-6 text-gray-400">
          Please select a date first
        </div>
      )}
    </div>
  );
};

export default StepSchedule;
