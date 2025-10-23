import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { HomePage } from './routes/HomePage';
import { DevDashboard } from './routes/DevDashboard';
import { LoginPage } from './routes/LoginPage';
import { TenantOnboardingPage } from './routes/TenantOnboardingPage';
import { PricingPage } from './routes/PricingPage';

// Admin redirect component
function AdminRedirect() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🔐</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Admin Access
        </h1>
        <p className="text-gray-600 mb-6">
          To access the admin panel, you need to start the admin app separately.
        </p>
        <div className="bg-white rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Development Setup:</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Open a new terminal</li>
            <li>2. Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev:admin</code></li>
            <li>3. Visit: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5177</code></li>
          </ol>
        </div>
        <div className="space-y-3">
          <a 
            href="http://localhost:5177" 
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Open Admin Panel
          </a>
          <a 
            href="/" 
            className="block text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MainSiteApp() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Root path - marketing homepage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dev dashboard (temporary) */}
        <Route path="/dev" element={<DevDashboard />} />
        
        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Tenant onboarding */}
        <Route path="/onboard" element={<TenantOnboardingPage />} />
        
        {/* Marketing pages */}
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Admin redirect */}
        <Route path="/admin" element={<AdminRedirect />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}