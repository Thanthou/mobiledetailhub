import React from 'react';
import { Database, Settings, Users, BarChart3 } from 'lucide-react';
import type { AdminTab } from '../types';
import { ADMIN_TABS } from '../utils/constants';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const iconMap = {
  Database,
  Users,
  BarChart3,
  Settings,
};

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex space-x-8 mb-8">
      {ADMIN_TABS.map((tab) => {
        const Icon = iconMap[tab.icon as keyof typeof iconMap];
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as AdminTab)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-900 text-blue-300 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};
