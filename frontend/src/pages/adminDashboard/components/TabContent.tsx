import React from 'react';
import type { AdminTab } from '../types';
import { DatabaseTab } from './tabs/database/DatabaseTab';
import { UsersTab } from './tabs/users/UsersTab';
import ReviewsTab from './tabs/reviews/ReviewsTab';
import { AnalyticsTab } from './tabs/analytics/AnalyticsTab';
import { SettingsTab } from './tabs/settings/SettingsTab';

interface TabContentProps {
  activeTab: AdminTab;
}

export const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  return (
    <main>
      {activeTab === 'database' && <DatabaseTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'reviews' && <ReviewsTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </main>
  );
};
