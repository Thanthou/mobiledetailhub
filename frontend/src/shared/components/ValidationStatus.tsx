/**
 * ValidationStatus component for displaying validation results
 * Useful for development and debugging
 */

import React from 'react';

import { useLocationValidation } from '@shared/hooks/useLocationValidation';
import type { LocationPage } from '@shared/types/location';

interface ValidationStatusProps {
  locationData: LocationPage | null | undefined;
  showWarnings?: boolean;
  className?: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ 
  locationData, 
  showWarnings = true,
  className = ''
}) => {
  const validation = useLocationValidation(locationData);

  // Don't render anything in production
  if (import.meta.env.PROD) {
    return null;
  }

  // Don't render if everything is valid and warnings are hidden
  if (!validation.hasErrors && (!showWarnings || !validation.hasWarnings)) {
    return null;
  }

  return (
    <div className={`p-4 border rounded-lg ${className} ${
      validation.hasErrors 
        ? 'border-red-200 bg-red-50' 
        : 'border-yellow-200 bg-yellow-50'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {validation.hasErrors ? (
          <>
            <span className="text-red-600">❌</span>
            <span className="font-semibold text-red-800">
              Validation Errors ({validation.errorCount})
            </span>
          </>
        ) : (
          <>
            <span className="text-yellow-600">⚠️</span>
            <span className="font-semibold text-yellow-800">
              Validation Warnings ({validation.warningCount})
            </span>
          </>
        )}
      </div>

      {validation.hasErrors && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-red-700 mb-1">Errors:</h4>
          <ul className="text-sm text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showWarnings && validation.hasWarnings && (
        <div>
          <h4 className="text-sm font-medium text-yellow-700 mb-1">Warnings:</h4>
          <ul className="text-sm text-yellow-600 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationStatus;
