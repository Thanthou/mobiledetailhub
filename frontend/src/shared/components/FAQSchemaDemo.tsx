/**
 * Demo component for FAQ schema functionality
 * Shows FAQ schema generation and statistics
 */

import React, { useState } from 'react';

import bullheadCityData from '@/data/locations/az/bullhead-city.json';
import lasVegasData from '@/data/locations/nv/las-vegas.json';
import { MDH_FAQ_ITEMS } from '@/features/faq/utils';
import { useFAQSchema, useFAQSchemaStats } from '@/shared/hooks/useFAQSchema';
import type { LocationPage } from '@/shared/types/location';

interface FAQSchemaDemoProps {
  className?: string;
}

// Type the imported JSON data
const typedBullheadData = bullheadCityData as LocationPage;
const typedLasVegasData = lasVegasData as LocationPage;

export const FAQSchemaDemo: React.FC<FAQSchemaDemoProps> = ({ className = '' }) => {
  const [selectedDataset, setSelectedDataset] = useState<'general' | 'bullhead' | 'lasvegas'>('general');
  
  const currentFAQs = selectedDataset === 'general' 
    ? MDH_FAQ_ITEMS 
    : selectedDataset === 'bullhead' 
      ? (typedBullheadData.faqs || []).map(faq => ({
          id: faq.id,
          category: 'Location' as const,
          question: faq.q,
          answer: faq.a
        }))
      : (typedLasVegasData.faqs || []).map(faq => ({
          id: faq.id,
          category: 'Location' as const,
          question: faq.q,
          answer: faq.a
        }));

  const { schema, hasSchema, faqCount, method } = useFAQSchema(currentFAQs);
  const stats = useFAQSchemaStats(currentFAQs);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className={`p-6 bg-gray-50 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">🔧 FAQ Schema Demo</h3>
      
      {/* Dataset Selector */}
      <div className="mb-4">
        <div className="block text-sm font-medium mb-2">Select FAQ Dataset:</div>
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedDataset('general'); }}
            className={`px-3 py-1 rounded text-sm ${
              selectedDataset === 'general'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            General FAQs ({MDH_FAQ_ITEMS.length})
          </button>
          <button
            onClick={() => { setSelectedDataset('bullhead'); }}
            className={`px-3 py-1 rounded text-sm ${
              selectedDataset === 'bullhead'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Bullhead City ({typedBullheadData.faqs?.length || 0})
          </button>
          <button
            onClick={() => { setSelectedDataset('lasvegas'); }}
            className={`px-3 py-1 rounded text-sm ${
              selectedDataset === 'lasvegas'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Las Vegas ({typedLasVegasData.faqs?.length || 0})
          </button>
        </div>
      </div>

      {/* Schema Status */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Schema Generation Status:</h4>
        <div className="bg-white p-3 rounded border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Has Schema:</span>
              <span className={`ml-2 ${hasSchema ? 'text-green-600' : 'text-red-600'}`}>
                {hasSchema ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">FAQ Count:</span>
              <span className="ml-2 font-mono">{faqCount}</span>
            </div>
            <div>
              <span className="text-gray-600">Generation Method:</span>
              <span className="ml-2 font-mono bg-gray-100 px-1 rounded">{method}</span>
            </div>
            <div>
              <span className="text-gray-600">Schema Type:</span>
              <span className="ml-2 font-mono">FAQPage</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Statistics */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">FAQ Statistics:</h4>
        <div className="bg-white p-3 rounded border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total FAQs:</span>
              <span className="ml-2 font-mono">{stats.totalFAQs}</span>
            </div>
            <div>
              <span className="text-gray-600">With IDs:</span>
              <span className="ml-2 font-mono">{stats.faqsWithIds}</span>
            </div>
            <div>
              <span className="text-gray-600">Without IDs:</span>
              <span className="ml-2 font-mono text-red-600">{stats.faqsWithoutIds}</span>
            </div>
            <div>
              <span className="text-gray-600">Avg Answer Length:</span>
              <span className="ml-2 font-mono">{stats.averageAnswerLength} chars</span>
            </div>
            <div>
              <span className="text-gray-600">Short Answers:</span>
              <span className="ml-2 font-mono text-yellow-600">{stats.shortAnswers}</span>
            </div>
            <div>
              <span className="text-gray-600">Long Answers:</span>
              <span className="ml-2 font-mono text-green-600">{stats.longAnswers}</span>
            </div>
          </div>
          
          {stats.categories.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-600 text-sm">Categories:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {stats.categories.map(category => (
                  <span key={category} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {stats.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Recommendations:</h4>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <ul className="text-sm space-y-1">
              {stats.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Generated Schema */}
      {hasSchema && schema && (
        <div>
          <h4 className="font-medium mb-2">Generated FAQPage Schema:</h4>
          <div className="bg-white p-3 rounded border">
            <pre className="text-xs overflow-auto max-h-64 bg-gray-50 p-2 rounded">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* FAQ Preview */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">FAQ Preview:</h4>
        <div className="bg-white p-3 rounded border">
          <div className="space-y-3 max-h-64 overflow-auto">
            {currentFAQs.slice(0, 3).map((faq, index) => {
              const faqId = String(faq.id || 'no-id');
              return (
                <div key={faqId + String(index)} className="border-b border-gray-100 pb-2">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 text-sm">#{String(index + 1)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs bg-gray-100 px-1 rounded">{faqId}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">{faq.category}</span>
                      </div>
                      <div className="font-medium text-sm">{faq.question}</div>
                      <div className="text-gray-600 text-xs mt-1 line-clamp-2">{faq.answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {currentFAQs.length > 3 && (
              <div className="text-center text-gray-500 text-sm">
                ... and {currentFAQs.length - 3} more FAQs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSchemaDemo;
