import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AdminProviders } from './AdminProviders';
import AdminApp from './AdminApp';
import { injectAllSchemas } from '@/shared/utils/schemaUtils';
import { defaultOrganizationSchema, defaultWebsiteSchema } from '@/shared/seo/defaultSchemas';
import '../index.css';

// Component to inject schemas
const SchemaInjector: React.FC = () => {
  useEffect(() => {
    injectAllSchemas([defaultOrganizationSchema, defaultWebsiteSchema]);
  }, []);
  return null;
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProviders>
        <SchemaInjector />
        <AdminApp />
      </AdminProviders>
    </BrowserRouter>
  </React.StrictMode>
);
