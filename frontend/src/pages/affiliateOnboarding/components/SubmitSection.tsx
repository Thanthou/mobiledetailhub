import React from 'react';
import { Send } from 'lucide-react';
import { AffiliateApplication } from '../types';

interface SubmitSectionProps {
  isSubmitting: boolean;
  submitError: string | null;
  formData: AffiliateApplication;
  onSubmit: (e: React.FormEvent) => void;
  emergencyCleanup?: () => void;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  isSubmitting,
  submitError,
  formData,
  onSubmit,
  emergencyCleanup
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </>
          )}
        </button>
      </div>

      {submitError && (
        <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {emergencyCleanup && (
        <div className="mt-4 pt-4 border-t border-stone-600">
          <button
            type="button"
            onClick={emergencyCleanup}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            title="Clear all form data and localStorage (use if experiencing issues)"
          >
            Clear All Data (Emergency)
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmitSection;
