import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AutoSaveStatusProps {
  isSaving: boolean;
  error: string | null;
  className?: string;
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ 
  isSaving, 
  error, 
  className = "flex items-center mt-2 space-x-2" 
}) => {
  return (
    <div className={className}>
      {isSaving && (
        <div className="flex items-center text-blue-400 text-sm">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400 mr-2"></div>
          Saving...
        </div>
      )}
      {error && (
        <div className="flex items-center text-red-400 text-sm">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
      {!isSaving && !error && (
        <div className="flex items-center text-green-400 text-sm">
          <CheckCircle className="h-3 w-3 mr-1" />
          All changes saved
        </div>
      )}
    </div>
  );
};

export default AutoSaveStatus;
