import React from 'react';
import { X } from 'lucide-react';

import { getToday, getWeekDates, parseLocalDate } from '@shared/utils';

import type { Appointment, TimeBlock } from '../types';
import { AppointmentCard } from './AppointmentCard';

interface WeekViewProps {
  selectedDate: string;
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
  blockedDays: Set<string>;
  onEditAppointment: (appointment: Appointment) => void;
  onCreateAppointment: (time?: string, date?: string) => void;
  onToggleDayBlock: (date: string) => Promise<void>;
}

export const WeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  appointments,
  timeBlocks,
  blockedDays,
  onEditAppointment,
  onCreateAppointment,
  onToggleDayBlock
}) => {
  const weekDates = getWeekDates(selectedDate);
  const today = getToday();

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDates.map((date) => {
        const dateObj = parseLocalDate(date);
        const isToday = date === today;
        const isCurrentMonth = dateObj.getMonth() === parseLocalDate(selectedDate).getMonth();
        const isBlocked = blockedDays.has(date);
        
        // Get appointment for this date (since only one per day)
        const dayAppointment = appointments.find(apt => {
          const aptDate = new Date(apt.start_time).toISOString().split('T')[0];
          return aptDate === date;
        });
        
        // Get time block for this date
        const dayTimeBlock = timeBlocks.find(block => {
          const blockDate = new Date(block.start_time).toISOString().split('T')[0];
          return blockDate === date;
        });
        
        return (
          <button 
            type="button"
            key={date}
            className={`min-h-[200px] p-4 rounded-xl border-2 transition-all duration-200 relative cursor-pointer text-left w-full ${
              isToday 
                ? 'border-orange-500 bg-orange-500/10' 
                : isCurrentMonth 
                  ? 'border-stone-600 bg-stone-800/50' 
                  : 'border-stone-700 bg-stone-900/30'
            } ${isBlocked ? 'bg-red-900/20 border-red-500' : ''}`}
            onClick={() => {
              alert('CLICKED: ' + date);
              void onToggleDayBlock(date).catch((err: unknown) => { console.error(err); });
            }}
          >
            {/* Day header */}
            <div className="mb-3">
              <div className={`flex items-center justify-between text-sm font-medium ${
                isToday ? 'text-orange-300' : isCurrentMonth ? 'text-white' : 'text-gray-500'
              }`}>
                <div>
                  {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                {!dayAppointment && !dayTimeBlock && !isBlocked && (
                  <button 
                    type="button"
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-orange-500/20 rounded-full transition-all duration-200 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateAppointment(undefined, date);
                    }}
                    aria-label="Add appointment"
                  >
                    <span className="text-lg font-light">+</span>
                  </button>
                )}
              </div>
              <div className={`text-lg font-bold ${
                isToday ? 'text-orange-300' : isCurrentMonth ? 'text-white' : 'text-gray-500'
              }`}>
                {dateObj.getDate()}
              </div>
            </div>
            
            {/* Day content */}
            <div className="flex-1">
              {dayAppointment ? (
                <AppointmentCard 
                  appointment={dayAppointment}
                  onEdit={onEditAppointment}
                />
              ) : dayTimeBlock ? (
                <div className="p-3 rounded-lg border-l-4 bg-gray-900/30 border-gray-500">
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{dayTimeBlock.title}</p>
                      <p className="text-gray-300 text-xs">{dayTimeBlock.description}</p>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {dayTimeBlock.block_type}
                    </div>
                    
                    <div className="pt-2">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                        {dayTimeBlock.block_type}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  {/* Empty day - no content needed since + button is in header */}
                </div>
              )}
            </div>
            
            {/* Red X overlay for blocked days */}
            {isBlocked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <X className="w-16 h-16 text-red-500 opacity-80" strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

