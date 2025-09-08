import { Calendar, Plus } from 'lucide-react';
import React from 'react';

interface ScheduleHeaderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  viewMode: 'day' | 'week' | 'month';
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode
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
              <button
                key={mode}
                onClick={() => { setViewMode(mode); }}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {mode}
              </button>
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
          
          {/* Add Appointment Button */}
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>
    </div>
  );
};