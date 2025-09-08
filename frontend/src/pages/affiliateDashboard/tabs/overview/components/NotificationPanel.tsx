import { AlertCircle } from 'lucide-react';
import React from 'react';

import { useNotifications } from '../hooks/useNotifications';

export const NotificationPanel: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className={`flex items-center p-3 rounded-lg border ${
            notification.type === 'info' ? 'bg-blue-900/30 border-blue-800' :
            notification.type === 'success' ? 'bg-green-900/30 border-green-800' :
            'bg-yellow-900/30 border-yellow-800'
          }`}>
            <div className={`h-2 w-2 rounded-full mr-3 ${
              notification.type === 'info' ? 'bg-blue-400' :
              notification.type === 'success' ? 'bg-green-400' :
              'bg-yellow-400'
            }`}></div>
            <p className="text-gray-300 text-sm">{notification.message}</p>
            <span className="ml-auto text-gray-400 text-xs">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};