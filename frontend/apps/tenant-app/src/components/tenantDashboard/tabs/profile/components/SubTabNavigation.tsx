import React from 'react';
import { User, Building2, Share2 } from 'lucide-react';

export type ProfileSubTab = 'personal' | 'business' | 'social';

interface SubTabNavigationProps {
  activeTab: ProfileSubTab;
  onTabChange: (tab: ProfileSubTab) => void;
}

const tabs: { id: ProfileSubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'social', label: 'Social Media', icon: Share2 },
];

export const SubTabNavigation: React.FC<SubTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-700">
      <nav className="flex -mb-px space-x-8" aria-label="Profile sections">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                transition-colors duration-150
                ${
                  isActive
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

