import React from 'react';
import { X } from 'lucide-react';

import { formatDateToYYYYMMDD, getToday, parseLocalDate } from '@/shared/utils';

import type { Appointment } from '../types';
import { AppointmentCard } from './AppointmentCard';

interface MonthViewProps {
  selectedDate: string;
  appointments: Appointment[];
  blockedDays: Set<string>;
  onEditAppointment: (appointment: Appointment) => void;
  onToggleDayBlock: (date: string) => Promise<void>;
}

export const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  appointments,
  blockedDays,
  onEditAppointment,
  onToggleDayBlock
}) => {
  const selectedDateObj = parseLocalDate(selectedDate);
  const yearNum = selectedDateObj.getFullYear();
  const monthNum = selectedDateObj.getMonth();
  
  // Get first day of month and calculate starting date (Monday of first week)
  const firstDay = new Date(yearNum, monthNum, 1);
  const firstDayOfWeek = firstDay.getDay();
  const mondayOffset = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() + mondayOffset);
  
  // Generate calendar days (6 weeks = 42 days)
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }
  
  // Get appointments for the month
  const monthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    return aptDate.getFullYear() === yearNum && aptDate.getMonth() === monthNum;
  });
  
  const today = getToday();
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Month header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center py-2 text-gray-400 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === monthNum;
            const dateString = formatDateToYYYYMMDD(date);
            const isToday = dateString === today;
            const isBlocked = blockedDays.has(dateString);
            const dayAppointments = monthAppointments.filter(apt => {
              const aptDate = new Date(apt.start_time).toISOString().split('T')[0];
              return aptDate === dateString;
            });
            
            return (
              <button 
                type="button"
                key={index}
                className={`w-full text-left min-h-[6rem] p-2 border border-stone-700 rounded-lg relative cursor-pointer transition-all duration-200 ${
                  isCurrentMonth ? 'bg-stone-800' : 'bg-stone-900/50'
                } ${isToday ? 'ring-2 ring-orange-500' : ''} ${isBlocked ? 'bg-red-900/20 border-red-500' : ''}`}
                onClick={() => { void onToggleDayBlock(dateString).catch((err: unknown) => { console.error(err); }); }}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-white' : 'text-gray-500'
                } ${isToday ? 'text-orange-300' : ''}`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {!isBlocked && dayAppointments.slice(0, 3).map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={onEditAppointment}
                      compact
                    />
                  ))}
                  {!isBlocked && dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
                
                {/* Red X overlay for blocked days */}
                {isBlocked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <X className="w-8 h-8 text-red-500 opacity-80" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

