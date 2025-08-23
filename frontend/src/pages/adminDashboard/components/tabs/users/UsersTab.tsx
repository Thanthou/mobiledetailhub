import React from 'react';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';

export const UsersTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              User Management
            </h2>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center text-gray-300">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold mb-2">User Management Coming Soon</h3>
            <p>This section will allow you to manage users, roles, and permissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
