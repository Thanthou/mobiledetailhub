import React from 'react';
import type { AdminTab } from '../types';
import { DatabaseTab } from './DatabaseTab';
import { PlaceholderTab } from './PlaceholderTab';

interface TabContentProps {
  activeTab: AdminTab;
}

export const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  return (
    <main>
      {activeTab === 'database' && <DatabaseTab />}
      {activeTab === 'users' && <PlaceholderTab title="User Management" />}
      {activeTab === 'analytics' && <PlaceholderTab title="Analytics" />}
      {activeTab === 'settings' && <PlaceholderTab title="Settings" />}
    </main>
  );
};
