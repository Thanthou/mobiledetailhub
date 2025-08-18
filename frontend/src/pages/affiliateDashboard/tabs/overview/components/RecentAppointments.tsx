import React from 'react';
import { useRecentAppointments } from '../hooks/useRecentAppointments';

export const RecentAppointments: React.FC = () => {
  const { appointments } = useRecentAppointments();

  return (
    <div className="lg:col-span-2 bg-stone-800 rounded-xl border border-stone-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Upcoming Appointments</h3>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-4 bg-stone-700 rounded-lg border border-stone-600">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {appointment.customer.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-white">{appointment.customer}</p>
                <p className="text-gray-300 text-sm">{appointment.service}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">{appointment.date}</p>
              <p className="text-white font-medium">{appointment.time}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                appointment.status === 'confirmed' 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-yellow-900 text-yellow-300'
              }`}>
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};