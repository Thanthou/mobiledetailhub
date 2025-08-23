import React from 'react';
import { Settings } from 'lucide-react';

interface PlaceholderTabProps {
  title: string;
}

export const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title }) => (
  <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Settings className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title} Coming Soon</h3>
      <p className="text-gray-300">This section is under development and will be available in a future update.</p>
    </div>
  </div>
);
