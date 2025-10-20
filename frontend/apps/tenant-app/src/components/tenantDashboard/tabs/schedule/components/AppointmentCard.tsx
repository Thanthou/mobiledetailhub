import React from 'react';

import type { Appointment } from '../types';
import { getStatusStyles } from './scheduleUtils';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  compact?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  compact = false
}) => {
  const { background, badge } = getStatusStyles(appointment.status);

  if (compact) {
    return (
      <button 
        type="button"
        className={`w-full text-left p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${background}`}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(appointment);
        }}
      >
        <div className="truncate">{appointment.customer_name}</div>
        <div className="truncate text-xs opacity-75">{appointment.title}</div>
      </button>
    );
  }

  return (
    <button 
      type="button"
      className={`w-full text-left p-3 rounded-lg border-l-4 cursor-pointer hover:opacity-80 transition-opacity ${background}`}
      onClick={() => { onEdit(appointment); }}
    >
      <div className="space-y-2">
        <div>
          <p className="font-semibold text-white text-sm">{appointment.customer_name}</p>
          <p className="text-gray-300 text-xs">{appointment.title}</p>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-gray-400">
            {new Date(appointment.start_time).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })} - {new Date(appointment.end_time).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
          
          <div className="text-xs text-gray-400">
            {appointment.service_duration} minutes
          </div>
          
          <div className="text-xs text-gray-400">
            {appointment.customer_phone}
          </div>
        </div>
        
        <div className="pt-2">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badge}`}>
            {appointment.status.replace('_', ' ')}
          </span>
        </div>
      </div>
    </button>
  );
};

