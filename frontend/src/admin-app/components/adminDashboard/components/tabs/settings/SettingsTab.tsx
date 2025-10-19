import React from 'react';
import { Settings, Shield } from 'lucide-react';

import { Button } from '@/shared/ui';

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              System Settings
            </h2>
            <Button 
              variant="primary"
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              leftIcon={<Shield className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center text-gray-300">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
            <p>This section will allow you to configure system settings and preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
