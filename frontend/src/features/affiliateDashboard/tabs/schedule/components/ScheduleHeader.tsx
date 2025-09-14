import React from 'react';
import { Calendar, Plus } from 'lucide-react';

import { Button } from '@/shared/ui';

interface ScheduleHeaderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  viewMode: 'day' | 'week' | 'month';
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  onCreateAppointment: () => void;
  onGoToToday: () => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  onCreateAppointment,
  onGoToToday
}) => {
  return (
    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-white">Schedule</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-stone-700 rounded-lg p-1">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <Button
                key={mode}
                onClick={() => { setViewMode(mode); }}
                variant={viewMode === mode ? 'primary' : 'ghost'}
                size="sm"
                className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${
                  viewMode === mode
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {mode}
              </Button>
            ))}
          </div>
          
          {/* Date Picker */}
          <input
            type="date"
            id="schedule-date"
            name="selectedDate"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); }}
            className="bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-2 text-sm"
          />
          
          {/* Today Button */}
          <Button 
            variant="secondary"
            size="sm"
            className="bg-stone-700 hover:bg-stone-600 text-white px-3 py-2 rounded-lg text-sm"
            onClick={onGoToToday}
          >
            Today
          </Button>
          
          {/* Add Appointment Button */}
          <Button 
            variant="primary"
            size="md"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={onCreateAppointment}
          >
            New Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};