import React from 'react';

import type { DashboardTab } from '@/features/tenantDashboard/types';
import { DASHBOARD_TABS } from '@/features/tenantDashboard/utils/constants';
import { getTabConfig } from '../config/tabConfig';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  tenantSlug?: string;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab, 
  onTabChange,
  tenantSlug
}) => {
  // Get tab configuration for this tenant
  const tabConfig = getTabConfig(tenantSlug);
  
  // Filter tabs based on configuration
  const visibleTabs = DASHBOARD_TABS.filter(tab => {
    switch (tab.id) {
      case 'schedule':
        return tabConfig.schedule;
      case 'customers':
        return tabConfig.customers;
      case 'services':
        return tabConfig.services;
      case 'locations':
        return tabConfig.locations;
      case 'profile':
        return tabConfig.profile;
      case 'website':
        return tabConfig.website;
      case 'overview':
        return true; // Overview is always visible
      default:
        return true;
    }
  });

  return (
    <div className="mb-6">
      <nav className="flex space-x-1 bg-stone-800 rounded-xl p-1 shadow-lg border border-stone-700">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { onTabChange(tab.id); }}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'text-gray-300 hover:text-white hover:bg-stone-700'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
