import React, { useState } from 'react';
import { Terminal, Play, History, Download, Server } from 'lucide-react';
import { config } from '../../../config/environment';
import type { QueryResult, QueryHistory } from '../types';
import { QUERY_TEMPLATES } from '../utils/constants';

export const DatabaseTab: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveDatabase, setIsLiveDatabase] = useState(true);

  const executeQuery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const input = document.getElementById('working-query-input') as HTMLTextAreaElement;
      const currentQuery = input ? input.value.trim() : query.trim();
      
      if (!currentQuery) {
        throw new Error('No query entered');
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

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
          executionTime: Date.now()
        };
        
        setQueryResult(result);
      } else {
        throw new Error('Query execution failed');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      setError(errorMessage);
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
      if (import.meta.env.DEV) {
        console.error('Export error:', error);
      }
      alert('Failed to export results');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              SQL Query Console
            </h2>
            <div className="flex items-center gap-4">
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
                {QUERY_TEMPLATES.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
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
    </div>
  );
};
