import React from 'react';

interface ScheduleSidebarProps {
  viewMode: 'day' | 'week' | 'month';
}

export const ScheduleSidebar: React.FC<ScheduleSidebarProps> = ({ viewMode }) => {
  const renderSummary = () => {
    if (viewMode === 'month') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Summary */}
          <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Appointments</span>
                <span className="text-white font-semibold">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Confirmed</span>
                <span className="text-green-400 font-semibold">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Pending</span>
                <span className="text-yellow-400 font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Blocked Days</span>
                <span className="text-red-400 font-semibold">3</span>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Summary */}
          <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue Summary</h3>
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Booked</span>
              <span className="text-blue-400 font-semibold">$12,800</span>
            </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Collected</span>
                <span className="text-green-400 font-semibold">$9,600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Remaining</span>
                <span className="text-orange-400 font-semibold">$3,200</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default to weekly summary for day and week views
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Summary */}
        <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Summary</h3>
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
              <span className="text-gray-300">Blocked Days</span>
              <span className="text-red-400 font-semibold">1</span>
            </div>
          </div>
        </div>

        {/* Weekly Revenue Summary */}
        <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Revenue Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Booked</span>
              <span className="text-blue-400 font-semibold">$3,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Collected</span>
              <span className="text-green-400 font-semibold">$2,400</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Remaining</span>
              <span className="text-orange-400 font-semibold">$800</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSummary()}
    </div>
  );
};