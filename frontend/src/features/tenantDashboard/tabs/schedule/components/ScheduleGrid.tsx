import React from 'react';

import type { Appointment, TimeBlock } from '../types';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { ScheduleLoadingState } from './ScheduleLoadingState';
import { ScheduleNavigationHeader } from './ScheduleNavigationHeader';
import { WeekView } from './WeekView';

interface ScheduleGridProps {
  selectedDate: string;
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
  loading: boolean;
  viewMode: 'day' | 'week' | 'month';
  onEditAppointment: (appointment: Appointment) => void;
  onCreateAppointment: (time?: string, date?: string) => void;
  blockedDays: Set<string>;
  onToggleDayBlock: (date: string) => Promise<void>;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedDate,
  appointments,
  timeBlocks,
  loading,
  viewMode,
  onEditAppointment,
  onCreateAppointment,
  blockedDays,
  onToggleDayBlock,
  onNavigateMonth,
  onNavigateWeek
}) => {
  if (loading) {
    return <ScheduleLoadingState viewMode={viewMode} />;
  }

  return (
    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
      <ScheduleNavigationHeader
        selectedDate={selectedDate}
        viewMode={viewMode}
        onNavigateMonth={onNavigateMonth}
        onNavigateWeek={onNavigateWeek}
      />
      
      {viewMode === 'day' && (
        <DayView
          selectedDate={selectedDate}
          appointments={appointments}
          timeBlocks={timeBlocks}
          onEditAppointment={onEditAppointment}
          onCreateAppointment={onCreateAppointment}
        />
      )}
      
      {viewMode === 'week' && (
        <WeekView
          selectedDate={selectedDate}
          appointments={appointments}
          timeBlocks={timeBlocks}
          blockedDays={blockedDays}
          onEditAppointment={onEditAppointment}
          onCreateAppointment={onCreateAppointment}
          onToggleDayBlock={onToggleDayBlock}
        />
      )}
      
      {viewMode === 'month' && (
        <MonthView
          selectedDate={selectedDate}
          appointments={appointments}
          blockedDays={blockedDays}
          onEditAppointment={onEditAppointment}
          onToggleDayBlock={onToggleDayBlock}
        />
      )}
    </div>
  );
};