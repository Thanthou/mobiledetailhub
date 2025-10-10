import React from 'react';
import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';

import { formatMonthYear, formatWeekRange, parseLocalDate } from '@/shared/utils';

interface ScheduleNavigationHeaderProps {
  selectedDate: string;
  viewMode: 'day' | 'week' | 'month';
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export const ScheduleNavigationHeader: React.FC<ScheduleNavigationHeaderProps> = ({
  selectedDate,
  viewMode,
  onNavigateMonth,
  onNavigateWeek
}) => {
  // Get title based on view mode
  const getTitle = () => {
    const date = parseLocalDate(selectedDate);
    switch (viewMode) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'week':
      case 'month':
        return ''; // No title for week/month view since it's shown in center navigation
      default:
        return '';
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between relative">
      {getTitle() && (
        <h3 className="text-lg font-semibold text-white">
          {getTitle()}
        </h3>
      )}
      
      {/* Week Navigation - centered, only show in week view */}
      {viewMode === 'week' && (
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          <button
            onClick={() => { onNavigateWeek('prev'); }}
            className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <span className="text-lg font-semibold text-white">
            {formatWeekRange(selectedDate)}
          </span>
          
          <button
            onClick={() => { onNavigateWeek('next'); }}
            className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Month Navigation - centered, only show in month view */}
      {viewMode === 'month' && (
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          <button
            onClick={() => { onNavigateMonth('prev'); }}
            className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <span className="text-lg font-semibold text-white">
            {formatMonthYear(selectedDate)}
          </span>
          
          <button
            onClick={() => { onNavigateMonth('next'); }}
            className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <Search className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

