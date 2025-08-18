import React from 'react';
import { DASHBOARD_TABS } from '../utils/constants';
import type { DashboardTab } from '../types';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="mb-6">
      <nav className="flex space-x-1 bg-stone-800 rounded-xl p-1 shadow-lg border border-stone-700">
        {DASHBOARD_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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