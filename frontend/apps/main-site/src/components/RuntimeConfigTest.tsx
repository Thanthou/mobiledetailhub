/**
 * Runtime Config Test Component
 * 
 * This component demonstrates and tests the runtime configuration system.
 * It shows how API URLs adapt to different environments and subdomains.
 */

import React, { useState, useEffect } from 'react';
import { apiCall, getApiUrl, getRuntimeApiBaseUrl } from '@shared/api';
import { useConfig } from '@shared/contexts/ConfigContext';

interface ConfigTestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

export const RuntimeConfigTest: React.FC = () => {
  const { config } = useConfig();
  const [results, setResults] = useState<ConfigTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, status: ConfigTestResult['status'], message: string, details?: any) => {
    setResults(prev => [...prev, { test, status, message, details }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Runtime API Base URL Detection
    try {
      const baseUrl = getRuntimeApiBaseUrl(config || undefined);
      addResult(
        'API Base URL Detection',
        'success',
        `Detected base URL: ${baseUrl || '(relative)'}`,
        { baseUrl, hostname: window.location.hostname }
      );
    } catch (error) {
      addResult('API Base URL Detection', 'error', `Failed: ${error}`);
    }

    // Test 2: API URL Construction
    try {
      const healthUrl = getApiUrl('/api/health', config || undefined);
      addResult(
        'API URL Construction',
        'success',
        `Health endpoint: ${healthUrl}`,
        { healthUrl }
      );
    } catch (error) {
      addResult('API URL Construction', 'error', `Failed: ${error}`);
    }

    // Test 3: Runtime API Call
    try {
      const healthData = await apiCall('/api/health', {}, config || undefined);
      addResult(
        'Runtime API Call',
        'success',
        'Health check successful',
        { response: healthData }
      );
    } catch (error) {
      addResult('Runtime API Call', 'error', `API call failed: ${error}`);
    }

    // Test 4: Environment Detection
    try {
      const isProduction = window.location.hostname.includes('thatsmartsite.com');
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.0.0.1');
      
      addResult(
        'Environment Detection',
        'success',
        `Environment: ${isProduction ? 'Production' : isLocalhost ? 'Development' : 'Custom'}`,
        { 
          hostname: window.location.hostname,
          isProduction,
          isLocalhost,
          protocol: window.location.protocol
        }
      );
    } catch (error) {
      addResult('Environment Detection', 'error', `Failed: ${error}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span>⚙️</span> Runtime Config Test
      </h2>
      
      <p className="text-white/70 mb-4">
        Test the runtime configuration system to verify API URLs adapt correctly to different environments.
      </p>

      <button
        onClick={runTests}
        disabled={isRunning}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors mb-4"
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Test Results:</h3>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border ${
                result.status === 'success' 
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : result.status === 'error'
                  ? 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-yellow-100 border-yellow-300 text-yellow-800'
              }`}
            >
              <div className="font-medium">{result.test}</div>
              <div className="text-sm">{result.message}</div>
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium">Details</summary>
                  <pre className="mt-1 text-xs bg-black/10 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-xs text-white/50">
        <p><strong>Current Environment:</strong> {window.location.hostname}</p>
        <p><strong>Protocol:</strong> {window.location.protocol}</p>
        <p><strong>Config Status:</strong> {config ? 'Loaded' : 'Not loaded'}</p>
        {config && (
          <p><strong>API Base URL:</strong> {config.apiBaseUrl || '(relative)'}</p>
        )}
      </div>
    </div>
  );
};
