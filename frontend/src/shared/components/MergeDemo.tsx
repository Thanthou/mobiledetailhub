/**
 * Demo component showing deep merge functionality
 * Useful for development and testing merge behavior
 */

import React, { useState } from 'react';
import { useMergedLocationData, useMergedLocationDataDebug } from '@/shared/hooks/useMergedLocationData';
import { ValidationStatus } from '@/shared/ui';
import siteData from '@/data/mobile-detailing/site.json';
import bullheadCityData from '@/data/locations/az/bullhead-city.json';
import lasVegasData from '@/data/locations/nv/las-vegas.json';
import type { LocationPage } from '@/shared/types/location';

interface MergeDemoProps {
  className?: string;
}

export const MergeDemo: React.FC<MergeDemoProps> = ({ className = '' }) => {
  const [selectedLocation, setSelectedLocation] = useState<'bullhead' | 'lasvegas'>('bullhead');
  
  const currentLocationData: LocationPage = selectedLocation === 'bullhead' 
    ? bullheadCityData 
    : lasVegasData;
  
  const { mergedData, validation, statistics, wasMerged } = useMergedLocationDataDebug(
    siteData,
    currentLocationData,
    `Merge Demo - ${selectedLocation === 'bullhead' ? 'Bullhead City' : 'Las Vegas'}`
  );

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className={`p-6 bg-gray-50 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">🔧 Deep Merge Demo</h3>
      
      {/* Location Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Location:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedLocation('bullhead')}
            className={`px-3 py-1 rounded text-sm ${
              selectedLocation === 'bullhead'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Bullhead City
          </button>
          <button
            onClick={() => setSelectedLocation('lasvegas')}
            className={`px-3 py-1 rounded text-sm ${
              selectedLocation === 'lasvegas'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Las Vegas
          </button>
        </div>
      </div>

      {/* Validation Status */}
      <ValidationStatus 
        locationData={mergedData} 
        showWarnings={true}
        className="mb-4"
      />

      {/* Merge Statistics */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Merge Statistics:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Fields from Main:</span>
            <span className="ml-2 font-mono">{statistics.fieldsFromMain.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Fields from Location:</span>
            <span className="ml-2 font-mono">{statistics.fieldsFromLocation.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Objects Merged:</span>
            <span className="ml-2 font-mono">{statistics.fieldsMerged.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Arrays Concatenated:</span>
            <span className="ml-2 font-mono">{statistics.arraysConcatenated.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Arrays Deduplicated:</span>
            <span className="ml-2 font-mono">{statistics.arraysDeduplicated.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Was Merged:</span>
            <span className={`ml-2 ${wasMerged ? 'text-green-600' : 'text-red-600'}`}>
              {wasMerged ? '✅' : '❌'}
            </span>
          </div>
        </div>
      </div>

      {/* Field Details */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">SEO Keywords (Concatenated):</h4>
          <div className="bg-white p-3 rounded border">
            <code className="text-sm">
              {JSON.stringify(mergedData.seo?.keywords, null, 2)}
            </code>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Images (Deduplicated):</h4>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm space-y-1">
              {mergedData.images?.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span className="font-mono text-xs bg-gray-100 px-1 rounded">{img.role}</span>
                  <span className="text-gray-700">{img.alt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">FAQs (Deduplicated):</h4>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm space-y-1">
              {mergedData.faqs?.map((faq, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span className="font-mono text-xs bg-gray-100 px-1 rounded">{faq.id || 'no-id'}</span>
                  <span className="text-gray-700">{faq.q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Location-Specific Fields:</h4>
          <div className="bg-white p-3 rounded border">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-600">City:</span> {mergedData.city}</div>
              <div><span className="text-gray-600">State:</span> {mergedData.stateCode}</div>
              <div><span className="text-gray-600">Postal Code:</span> {mergedData.postalCode}</div>
              <div><span className="text-gray-600">URL Path:</span> {mergedData.urlPath}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Data (Collapsible) */}
      <details className="mt-4">
        <summary className="cursor-pointer font-medium text-sm text-gray-600 hover:text-gray-800">
          Show Raw Merged Data
        </summary>
        <div className="mt-2 bg-white p-3 rounded border">
          <pre className="text-xs overflow-auto max-h-64">
            {JSON.stringify(mergedData, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
};

export default MergeDemo;
