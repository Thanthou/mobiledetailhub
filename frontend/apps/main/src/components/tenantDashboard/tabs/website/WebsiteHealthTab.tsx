import React from 'react';

import { HealthTab } from './components';

interface WebsiteHealthTabProps {
  tenantSlug?: string;
}

const WebsiteHealthTab: React.FC<WebsiteHealthTabProps> = ({ tenantSlug }) => {
  return <HealthTab tenantSlug={tenantSlug} />;
};

export default WebsiteHealthTab;
