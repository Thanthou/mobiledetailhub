import React, { useState } from 'react';

import type { AdminTab } from '@/features/adminDashboard/types';
import { useBrowserTab } from '@/shared/hooks';

import { AdminLayout, AdminTabs, TabContent } from './';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  // Set browser tab title and favicon for admin dashboard
  useBrowserTab({
    title: 'Admin Dashboard - That Smart Site',
    useBusinessName: false,
  });

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
  };

  return (
    <AdminLayout>
      <h1 className="sr-only">Admin Dashboard</h1>
      <AdminTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <TabContent 
        activeTab={activeTab}
      />
    </AdminLayout>
  );
};

export default DashboardPage;