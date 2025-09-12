import React from 'react';
import { AlertCircle } from 'lucide-react';

import { ProfileForm } from './components/ProfileForm';
import { useProfileData } from './hooks/useProfileData';

const ProfileTab: React.FC = () => {
  const {
    profileData,
    loading,
    error,
    validationErrors,
    updateProfile,
    isUpdating,
  } = useProfileData();



  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Unable to Load Profile</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            {error.includes('log in') && (
              <p className="text-sm text-red-600 mt-2">
                Please log in to your account to access your profile information.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <ProfileForm
        profileData={profileData}
        validationErrors={validationErrors}
        isUpdating={isUpdating}
        onSave={updateProfile}
      />
    </div>
  );
};

export default ProfileTab;
