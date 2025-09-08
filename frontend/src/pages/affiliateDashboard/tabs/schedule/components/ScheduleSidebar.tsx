import React from 'react';

export const ScheduleSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
            Add Appointment
          </button>
          <button className="w-full bg-stone-700 hover:bg-stone-600 text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors border border-stone-600">
            Block Time
          </button>
          <button className="w-full bg-stone-700 hover:bg-stone-600 text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors border border-stone-600">
            View Calendar
          </button>
        </div>
      </div>

      {/* Schedule Stats */}
      <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today&rsquo;s Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Appointments</span>
            <span className="text-white font-semibold">8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Confirmed</span>
            <span className="text-green-400 font-semibold">6</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Pending</span>
            <span className="text-yellow-400 font-semibold">2</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Revenue Goal</span>
            <span className="text-white font-semibold">$600</span>
          </div>
          <div className="w-full bg-stone-700 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <p className="text-gray-400 text-xs">80% of daily goal achieved</p>
        </div>
      </div>
    </div>
  );
};