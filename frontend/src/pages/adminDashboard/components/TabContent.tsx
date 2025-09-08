import React from 'react';

import type { AdminTab } from '../types';
import { AnalyticsTab } from './tabs/analytics/AnalyticsTab';
import { DatabaseTab } from './tabs/database/DatabaseTab';
import ReviewsTab from './tabs/reviews/ReviewsTab';
import { SettingsTab } from './tabs/settings/SettingsTab';
import { UsersTab } from './tabs/users/UsersTab';

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
