import React from 'react';

import type { Appointment, TimeBlock } from '../types';
import { generateTimeSlots, getStatusStyles } from './scheduleUtils';

interface DayViewProps {
  selectedDate: string;
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
  onEditAppointment: (appointment: Appointment) => void;
  onCreateAppointment: (time?: string, date?: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  appointments,
  timeBlocks,
  onEditAppointment,
  onCreateAppointment
}) => {
  const timeSlots = generateTimeSlots();

  // Get appointments for a specific date and time
  const getAppointmentForDateTime = (date: string, time: string) => {
    return appointments.find(apt => {
      const startTime = new Date(apt.start_time);
      const appointmentDate = startTime.toISOString().split('T')[0];
      const timeString = startTime.toTimeString().slice(0, 5);
      return appointmentDate === date && timeString === time;
    });
  };

  // Get time block for a specific date and time
  const getTimeBlockForDateTime = (date: string, time: string) => {
    return timeBlocks.find(block => {
      const startTime = new Date(block.start_time);
      const endTime = new Date(block.end_time);
      const blockDate = startTime.toISOString().split('T')[0];
      const slotTime = new Date(`${date}T${time}:00`);
      return blockDate === date && slotTime >= startTime && slotTime < endTime;
    });
  };

  return (
    <div className="space-y-2">
      {timeSlots.map((time) => {
        const appointment = getAppointmentForDateTime(selectedDate, time);
        const timeBlock = getTimeBlockForDateTime(selectedDate, time);
        const { background, badge } = appointment ? getStatusStyles(appointment.status) : { background: '', badge: '' };

        return (
          <div key={time} className="flex items-center border-b border-stone-700 last:border-b-0">
            <div className="w-16 text-gray-400 text-sm font-medium py-3">
              {time}
            </div>
            <div className="flex-1 py-2">
              {appointment ? (
                <button 
                  type="button"
                  className={`w-full text-left p-3 rounded-lg border-l-4 cursor-pointer hover:opacity-80 transition-opacity ${background}`}
                  onClick={() => { onEditAppointment(appointment); }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{appointment.customer_name}</p>
                      <p className="text-gray-300 text-sm">{appointment.title}</p>
                      <p className="text-gray-400 text-xs">{appointment.service_duration} minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">{appointment.customer_phone}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badge}`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </button>
              ) : timeBlock ? (
                <div className="p-3 rounded-lg border-l-4 bg-gray-900/30 border-gray-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{timeBlock.title}</p>
                      <p className="text-gray-300 text-sm">{timeBlock.description}</p>
                      <p className="text-gray-400 text-xs">{timeBlock.block_type}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                        {timeBlock.block_type}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  type="button"
                  className="h-12 w-full text-left flex items-center text-gray-500 text-sm cursor-pointer hover:text-white hover:bg-stone-700/50 rounded-lg transition-colors"
                  onClick={() => { onCreateAppointment(time, selectedDate); }}
                >
                  Available - Click to add appointment
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

