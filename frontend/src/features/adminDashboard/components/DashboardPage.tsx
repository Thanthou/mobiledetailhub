import React, { useState } from 'react';

import type { AdminTab } from '@/features/adminDashboard/types';

import { AdminLayout, AdminTabs, TabContent } from './';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('database');

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
  };

  return (
    <AdminLayout>
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