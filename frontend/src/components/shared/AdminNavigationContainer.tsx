import React from 'react';
import DevNavigation from './DevNavigation';
import AffiliateNavigation from './AffiliateNavigation';

const AdminNavigationContainer: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-row space-x-2">
      <DevNavigation />
      <AffiliateNavigation />
    </div>
  );
};

export default AdminNavigationContainer;
