import React from 'react';
import { Route } from 'react-router-dom';
import { TenantPage } from '../pages/TenantPage';

export const tenantRoutes = [
  <Route 
    key="tenant-page" 
    path="/:slug" 
    element={<TenantPage />} 
  />
];
