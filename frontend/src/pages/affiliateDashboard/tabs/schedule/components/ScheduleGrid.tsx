import { Filter, Search } from 'lucide-react';
import React from 'react';

interface Appointment {
  id: number;
  time: string;
  duration: number;
  customer: string;
  service: string;
  phone: string;
  status: 'confirmed' | 'pending';
}

interface ScheduleGridProps {
  selectedDate: string;
  appointments: Appointment[];
  loading: boolean;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedDate,
  appointments,
  loading
}) => {
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // 8 AM to 7 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  if (loading) {
    return (
      <div className="lg:col-span-3 bg-stone-800 rounded-xl border border-stone-700 p-6">
        <div className="animate-pulse space-y-4">
          {timeSlots.map((time) => (
            <div key={time} className="h-12 bg-stone-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 bg-stone-800 rounded-xl border border-stone-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        {timeSlots.map((time) => {
          const appointment = appointments.find(apt => apt.time === time);
          return (
            <div key={time} className="flex items-center border-b border-stone-700 last:border-b-0">
              <div className="w-16 text-gray-400 text-sm font-medium py-3">
                {time}
              </div>
              <div className="flex-1 py-2">
                {appointment ? (
                  <div className={`p-3 rounded-lg border-l-4 ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-yellow-900/30 border-yellow-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{appointment.customer}</p>
                        <p className="text-gray-300 text-sm">{appointment.service}</p>
                        <p className="text-gray-400 text-xs">{appointment.duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">{appointment.phone}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-12 flex items-center text-gray-500 text-sm">
                    Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};