import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { ScheduleSelection } from '../schemas/booking.schemas';

interface StepScheduleProps {
  onNext: (scheduleData: ScheduleSelection) => void;
  onPrevious: () => void;
  initialData?: ScheduleSelection;
}

const StepSchedule: React.FC<StepScheduleProps> = ({ 
  onNext, 
  onPrevious, 
  initialData 
}) => {
  const [selectedDate, setSelectedDate] = useState(initialData?.date || '');
  const [selectedTime, setSelectedTime] = useState(initialData?.time || '');
  const [selectedDuration, setSelectedDuration] = useState(initialData?.duration || 2);

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext({
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration
      });
    }
  };

  const isComplete = selectedDate && selectedTime;

  // Generate available time slots (simplified)
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Schedule Your Service</h2>
      
      {/* Date Selection */}
      <div className="mb-6">
        <label htmlFor="date-select" className="block text-sm font-medium text-gray-300 mb-3">
          <Calendar className="w-4 h-4 inline mr-2" />
          Select Date
        </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
        >
          <option value="">Choose a date</option>
          {availableDates.map((date) => {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            return (
              <option key={date} value={date}>
                {formattedDate}
              </option>
            );
          })}
        </select>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="mb-6">
          <label htmlFor="time-buttons" className="block text-sm font-medium text-gray-300 mb-3">
            <Clock className="w-4 h-4 inline mr-2" />
            Select Time
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time);
                }}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedTime === time
                    ? 'border-orange-400 bg-orange-400/10 text-orange-400'
                    : 'border-gray-600 hover:border-gray-500 text-white'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Duration Selection */}
      {selectedTime && (
        <div className="mb-6">
          <label htmlFor="duration-select" className="block text-sm font-medium text-gray-300 mb-3">
            Estimated Duration
          </label>
          <select
            id="duration-select"
            value={selectedDuration}
            onChange={(e) => {
              setSelectedDuration(parseInt(e.target.value));
            }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
          >
            <option value={1}>1 hour</option>
            <option value={2}>2 hours</option>
            <option value={3}>3 hours</option>
            <option value={4}>4 hours</option>
            <option value={5}>5+ hours</option>
          </select>
        </div>
      )}

      {/* Schedule Summary */}
      {isComplete && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Scheduled Service:</h4>
          <div className="text-gray-300 text-sm space-y-1">
            <p>
              <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Duration:</strong> {selectedDuration} hour{selectedDuration > 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="secondary"
          size="md"
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="primary"
          size="md"
          className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg"
          disabled={!isComplete}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepSchedule;
