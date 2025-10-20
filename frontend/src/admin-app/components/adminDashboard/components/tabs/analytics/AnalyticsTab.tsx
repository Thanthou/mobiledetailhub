import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

import { Button } from '@/shared/ui';
import { SEOHealthCard } from './SEOHealthCard';

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* SEO Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SEOHealthCard />
        
        {/* Performance Metrics Placeholder */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
          </div>
          <div className="text-center text-gray-400 py-8">
            <p>Core Web Vitals tracking coming soon...</p>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Analytics Dashboard
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary"
                size="sm"
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                leftIcon={<TrendingUp className="w-4 h-4" />}
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center text-gray-300">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
            <p>This section will provide comprehensive analytics and reporting capabilities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
