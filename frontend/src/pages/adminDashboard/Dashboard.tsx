import React, { useState } from 'react';
import { Database, Settings, Users, BarChart3, Terminal, Play, History, Download, Server } from 'lucide-react';
import { config } from '../../config/environment';

interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTime: number;
}

interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  success: boolean;
  executionTime?: number;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('database');
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([
    {
      id: '1',
      query: 'SELECT COUNT(*) FROM users;',
      timestamp: new Date(Date.now() - 300000),
      success: true,
      executionTime: 45
    },
    {
      id: '2',
      query: 'SELECT * FROM orders WHERE status = "pending";',
      timestamp: new Date(Date.now() - 600000),
      success: true,
      executionTime: 120
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveDatabase, setIsLiveDatabase] = useState(true); // Default to live database

  const tabs = [
    { id: 'database', label: 'Database', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log('Query change:', newValue); // Debug log
    setQuery(newValue);
  };

  // Alternative input handler
  const handleInputChange = (e: any) => {
    const value = e.target.value;
    console.log('Input change:', value);
    setQuery(value);
  };

  // Real database execution with toggle support
  const executeQuery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get query from the working input field
      const input = document.getElementById('working-query-input') as HTMLTextAreaElement;
      const currentQuery = input ? input.value.trim() : query.trim();
      
      if (!currentQuery) {
        throw new Error('No query entered');
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Debug: Log token and user info
      console.log('Token:', token);
      console.log('User from localStorage:', localStorage.getItem('user'));
      
      // Decode JWT token to see what's in it
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('JWT Payload:', payload);
        }
      } catch (e) {
        console.log('Could not decode JWT token');
      }

      // Use the appropriate API URL based on toggle state
      const apiUrl = isLiveDatabase ? config.apiUrls.live : config.apiUrls.local;
      const endpoint = `${apiUrl}/admin/query`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: currentQuery })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute query');
      }

      const data = await response.json();
      
      if (data.success) {
        const result: QueryResult = {
          columns: Array.isArray(data.fields) ? data.fields : [],
          rows: Array.isArray(data.rows) ? data.rows : [],
          rowCount: data.rowCount || 0,
          executionTime: Date.now() // We'll calculate this more accurately
        };
        
        setQueryResult(result);
        
        // Add to history
        const newHistoryItem: QueryHistory = {
          id: Date.now().toString(),
          query: currentQuery,
          timestamp: new Date(),
          success: true,
          executionTime: result.executionTime
        };
        setQueryHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      } else {
        throw new Error('Query execution failed');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      setError(errorMessage);
      
      const newHistoryItem: QueryHistory = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date(),
        success: false
      };
      setQueryHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatExecutionTime = (ms: number) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  const exportResults = () => {
    if (!queryResult) return;
    
    try {
      const csv = [
        Array.isArray(queryResult.columns) ? queryResult.columns.join(',') : '',
        ...(Array.isArray(queryResult.rows) ? queryResult.rows.map(row => 
          Array.isArray(row) ? row.join(',') : String(row)
        ) : [])
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'query_results.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export results');
    }
  };

  const DatabaseTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              SQL Query Console
            </h2>
            <div className="flex items-center gap-4">
              {/* Database Toggle Button */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Database:</span>
                <button
                  onClick={() => setIsLiveDatabase(!isLiveDatabase)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isLiveDatabase 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  {isLiveDatabase ? 'Live' : 'Local'}
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  Connected to: {isLiveDatabase ? 'Render PostgreSQL' : 'Local PostgreSQL'}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SQL Query
              </label>
              
              {/* Working input replacement */}
              <div className="space-y-4">
                <textarea
                  id="working-query-input"
                  className="w-full h-32 px-3 py-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none text-white placeholder-gray-400"
                  placeholder="Enter your SQL query here..."
                  defaultValue={query}
                />
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const input = document.getElementById('working-query-input') as HTMLTextAreaElement;
                      if (input) {
                        setQuery(input.value);
                        console.log('Query updated:', input.value);
                      }
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Update Query State
                  </button>
                  
                  <span className="text-xs text-gray-400">
                    Characters: {query.length} | Current: "{query}"
                  </span>
                </div>
              </div>
              
              {/* Remove the broken inputs */}
              {/* <textarea
                key="query-textarea"
                value={query}
                onChange={handleInputChange}
                onInput={handleInputChange}
                className="w-full h-32 px-3 py-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none text-white placeholder-gray-400"
                placeholder="Enter your SQL query here..."
                style={{ fontFamily: 'monospace' }}
                autoComplete="off"
                spellCheck="false"
              />
              
              <div className="text-xs text-gray-400 mt-1">
                Characters: {query.length} | Current value: "{query}"
              </div> */}
              
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={executeQuery}
                disabled={isLoading || !query.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                {isLoading ? 'Executing...' : 'Execute Query'}
              </button>
              
              <select
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
                defaultValue=""
              >
                <option value="" disabled>Quick Templates</option>
                <option value="SELECT * FROM users LIMIT 10;">Show Users</option>
                <option value="SELECT COUNT(*) FROM users;">Count Users</option>
                <option value="SELECT * FROM businesses LIMIT 10;">Show Businesses</option>
                <option value="SELECT * FROM mdh_config;">Show MDH Config</option>
                <option value="SELECT * FROM service_areas LIMIT 10;">Show Service Areas</option>
                <option value="SHOW TABLES;">Show Tables</option>
                <option value="SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';">List All Tables</option>
                <option value="SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';">Describe Users Table</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-300">
            <Terminal className="w-4 h-4 text-red-400" />
            <span className="font-medium">Query Error</span>
          </div>
          <p className="text-red-200 mt-1">{error}</p>
        </div>
      )}

      {queryResult && (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-white">Query Results</h3>
                <span className="text-sm text-gray-300">
                  {queryResult.rowCount} row{queryResult.rowCount !== 1 ? 's' : ''} • {formatExecutionTime(queryResult.executionTime)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isLiveDatabase 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {isLiveDatabase ? 'Live DB' : 'Local DB'}
                </span>
              </div>
              <button
                onClick={exportResults}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Comprehensive Debug Section */}
          <details className="px-6 py-3 bg-gray-700 border-t border-gray-600">
            <summary className="text-xs text-gray-300 cursor-pointer hover:text-white">
              🔍 Debug Info - Click to expand
            </summary>
            <div className="mt-3 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-200">Columns:</strong>
                  <pre className="mt-1 p-2 bg-gray-800 rounded text-green-300 overflow-x-auto">
                    {JSON.stringify(queryResult.columns, null, 2)}
                  </pre>
                </div>
                <div>
                  <strong className="text-gray-200">Rows Type:</strong>
                  <div className="mt-1 p-2 bg-gray-800 rounded text-blue-300">
                    {typeof queryResult.rows}
                  </div>
                </div>
              </div>
              <div>
                <strong className="text-gray-200">Rows Length:</strong>
                <div className="mt-1 p-2 bg-gray-800 rounded text-yellow-300">
                  {Array.isArray(queryResult.rows) ? queryResult.rows.length : 'Not an array'}
                </div>
              </div>
              <div>
                <strong className="text-gray-200">First Row Sample:</strong>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-purple-300 overflow-x-auto">
                  {Array.isArray(queryResult.rows) && queryResult.rows.length > 0 
                    ? JSON.stringify(queryResult.rows[0], null, 2)
                    : 'No rows or not an array'
                  }
                </pre>
              </div>
              <div>
                <strong className="text-gray-200">Full Data Structure:</strong>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-300 overflow-x-auto max-h-40">
                  {JSON.stringify(queryResult, null, 2)}
                </pre>
              </div>
            </div>
          </details>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  {Array.isArray(queryResult.columns) && queryResult.columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {Array.isArray(queryResult.rows) && queryResult.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-700">
                    {Array.isArray(row) && row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono"
                      >
                        {cell !== null && cell !== undefined ? String(cell) : 'NULL'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Query History
          </h3>
        </div>
        <div className="divide-y divide-gray-700">
          {queryHistory.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => setQuery(item.query)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-white truncate">
                    {item.query}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-400">
                      {item.timestamp.toLocaleString()}
                    </span>
                    {item.success && item.executionTime && (
                      <span className="text-xs text-gray-400">
                        {formatExecutionTime(item.executionTime)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.success ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PlaceholderTab = ({ title }: { title: string }) => (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title} Coming Soon</h3>
        <p className="text-gray-300">This section is under development and will be available in a future update.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome back, Admin</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex space-x-8 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-900 text-blue-300 border-b-2 border-blue-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <main>
          {activeTab === 'database' && <DatabaseTab />}
          {activeTab === 'users' && <PlaceholderTab title="User Management" />}
          {activeTab === 'analytics' && <PlaceholderTab title="Analytics" />}
          {activeTab === 'settings' && <PlaceholderTab title="Settings" />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;