import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Trash2, UserCheck, UserCog, UserPlus, Users, UserX } from 'lucide-react';

import { ApplicationModal, Toast } from '@/features/adminDashboard/components/shared';
import type { UserSubTab } from '@/features/adminDashboard/types';
import { apiService } from '@/shared/api/api';
import { Button } from '@/shared/ui';
import { tenantEventManager } from '@/shared/utils/tenantEventManager';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  business_name?: string;
  slug?: string;
}

interface PendingApplication {
  id: number;
  slug: string;
  business_name: string;
  owner: string;
  phone: string;
  email: string;
  city: string;
  state_code: string;
  postal_code: string;
  has_insurance: boolean;
  source: string;
  notes?: string;
  application_date: string;
  created_at: string;
}

export const UsersTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<UserSubTab>('all-users');
  const [users, setUsers] = useState<User[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    applicationId: number;
    businessName: string;
  } | null>(null);
  const [processingApplication, setProcessingApplication] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  } | null>(null);
  const [deletingAffiliate, setDeletingAffiliate] = useState<number | null>(null);

  // Add debouncing to prevent rapid API calls
  const debounceTimer = useRef<number | null>(null);
  const lastFetchRef = useRef<{ status: UserSubTab; timestamp: number } | null>(null);

  const subTabs = [
    { id: 'all-users' as UserSubTab, label: 'All Users', icon: Users },
    { id: 'admin' as UserSubTab, label: 'Admin', icon: UserCog },
    { id: 'affiliates' as UserSubTab, label: 'Affiliates', icon: UserCheck },
    { id: 'customers' as UserSubTab, label: 'Customers', icon: UserX },
    { id: 'pending' as UserSubTab, label: 'Pending', icon: UserPlus },
  ];

  const fetchUsers = useCallback((status: UserSubTab, force = false) => {
    // Debouncing: prevent rapid successive calls for the same status
    const now = Date.now();
    const lastFetch = lastFetchRef.current;
    
    if (!force && lastFetch && lastFetch.status === status && now - lastFetch.timestamp < 1000) {
      // Skip if the same request was made within the last second
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set a debounce timer for rapid successive calls
    debounceTimer.current = setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);
        lastFetchRef.current = { status, timestamp: now };
        
        try {
          if (status === 'pending') {
            // Fetch pending affiliate applications
            const response = await apiService.getPendingApplications();
            setPendingApplications(response.applications);
          } else {
            // Fetch regular users
            const response = await apiService.getUsers(status);
            setUsers(response.users);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      })();
    }, 200); // 200ms debounce delay
  }, []); // Empty dependency array is correct here

  useEffect(() => {
    fetchUsers(activeSubTab);
  }, [activeSubTab, fetchUsers]); // Include fetchUsers in dependencies

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSubTabChange = (subTab: UserSubTab) => {
    setActiveSubTab(subTab);
  };

  const handleApproveApplication = (applicationId: number, businessName: string) => {
    // Check if application is still pending
    const application = pendingApplications.find(app => app.id === applicationId);
    if (!application) {
      setToast({
        message: 'Application not found or already processed',
        type: 'error',
        isVisible: true
      });
      return;
    }
    
    setModalState({
      isOpen: true,
      type: 'approve',
      applicationId,
      businessName
    });
  };

  const handleRejectApplication = (applicationId: number, businessName: string) => {
    // Check if application is still pending
    const application = pendingApplications.find(app => app.id === applicationId);
    if (!application) {
      setToast({
        message: 'Application not found or already processed',
        type: 'error',
        isVisible: true
      });
      return;
    }
    
    setModalState({
      isOpen: true,
      type: 'reject',
      applicationId,
      businessName
    });
  };

  const handleModalSubmit = async (data: { slug?: string; reason?: string; notes: string }) => {
    if (!modalState) return;
    
    setProcessingApplication(true);
    try {
      let response;
      
      if (modalState.type === 'approve') {
        if (!data.slug) {
          throw new Error('Slug is required for approval');
        }
        response = await apiService.approveApplication(modalState.applicationId, data.slug, data.notes);
      } else {
        if (!data.reason) {
          throw new Error('Rejection reason is required');
        }
        response = await apiService.rejectApplication(modalState.applicationId, data.reason, data.notes);
      }
      
      // Check if the API call was successful
      if (!response.success) {
        throw new Error(response.message || 'Operation failed');
      }
      
      // Refresh the pending applications list
      fetchUsers('pending', true);
      
      // Notify other components that a tenant was updated
      tenantEventManager.notify();
      
      // Close modal
      setModalState(null);
      
      // Show success message
      setToast({
        message: `Application ${modalState.type === 'approve' ? 'approved' : 'rejected'} successfully`,
        type: 'success',
        isVisible: true
      });
      
    } catch (err) {
      console.error(`Error ${modalState.type === 'approve' ? 'approving' : 'rejecting'} application:`, err);
      
      let errorMessage = 'An error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      
      setToast({
        message: errorMessage,
        type: 'error',
        isVisible: true
      });
    } finally {
      setProcessingApplication(false);
    }
  };

  const closeModal = () => {
    setModalState(null);
  };

  const handleDeleteAffiliate = async (userId: number, businessName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone and will also remove all associated service areas.`)) {
      return;
    }
    
    setDeletingAffiliate(userId);
    try {
      const response = await apiService.deleteAffiliate(userId);
      if (response.success) {
        setToast({
          message: `Affiliate "${businessName}" deleted successfully.`,
          type: 'success',
          isVisible: true
        });
        fetchUsers('affiliates', true); // Refresh affiliates list
        
        // Notify other components that a tenant was deleted
        tenantEventManager.notify();
      } else {
        throw new Error(response.message || 'Failed to delete affiliate');
      }
    } catch (err) {
      console.error('Error deleting affiliate:', err);
      let errorMessage = 'An error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      setToast({
        message: errorMessage,
        type: 'error',
        isVisible: true
      });
    } finally {
      setDeletingAffiliate(null);
    }
  };

  const renderSubTabContent = (subTab: UserSubTab) => {
    if (loading) {
      return (
        <div className="text-center text-gray-300">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-spin" />
          <h3 className="text-lg font-semibold mb-2">Loading Users...</h3>
        </div>
      );
    }

    if (error) {
      // Check if it's an authentication error
      if (error.includes('401') || error.includes('Unauthorized') || error.includes('Forbidden')) {
        return (
          <div className="text-center text-gray-300">
            <div className="w-16 h-16 mx-auto mb-4 text-yellow-400">🔒</div>
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Authentication Required</h3>
            <p className="text-yellow-300">You need to be logged in as an admin to view users.</p>
            <p className="text-sm text-gray-400 mt-2">
              Please log in with an admin account or check your authentication status.
            </p>
          </div>
        );
      }
      
      return (
        <div className="text-center text-gray-300">
          <div className="w-16 h-16 mx-auto mb-4 text-red-400">⚠️</div>
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error</h3>
          <p className="text-red-300">{error}</p>
          <button 
            onClick={() => { fetchUsers(subTab, true); }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

      if (activeSubTab === 'pending') {
        if (pendingApplications.length === 0) {
          return (
            <div className="text-center text-gray-300">
              <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">No Pending Applications</h3>
              <p>All affiliate applications have been processed.</p>
              <button 
                onClick={() => { fetchUsers('pending', true); }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          );
        }
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>
                Showing {pendingApplications.length} pending application{pendingApplications.length !== 1 ? 's' : ''}
              </span>
              <button 
                onClick={() => { fetchUsers('pending', true); }}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
            <div className="grid gap-4">
            {pendingApplications.map((app) => (
              <div key={app.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{app.business_name}</h4>
                    <p className="text-gray-300 text-sm">Owner: {app.owner}</p>
                    <p className="text-gray-300 text-sm">{app.email}</p>
                    <p className="text-gray-300 text-sm">{app.phone}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Location: {app.city}, {app.state_code} {app.postal_code}
                    </p>
                    {app.has_insurance && (
                      <p className="text-green-400 text-xs mt-2">✓ Has Insurance</p>
                    )}
                    {app.source && (
                      <p className="text-gray-400 text-xs mt-1">Source: {app.source}</p>
                        )}
                    <p className="text-gray-400 text-xs mt-2">
                      Applied: {new Date(app.application_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <button 
                      onClick={() => { handleApproveApplication(app.id, app.business_name); }}
                      disabled={processingApplication}
                      className={`px-3 py-1.5 text-white text-xs rounded transition-colors ${
                        processingApplication 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {processingApplication ? 'Processing...' : 'Approve'}
                    </button>
                    <button 
                      onClick={() => { handleRejectApplication(app.id, app.business_name); }}
                      disabled={processingApplication}
                      className={`px-3 py-1.5 text-white text-xs rounded transition-colors ${
                        processingApplication 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {processingApplication ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center text-gray-300">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
          <p>No users match the current filter criteria.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-400 mb-4">
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{user.name}</h4>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                  {user.business_name && (
                    <p className="text-gray-300 text-sm">{user.business_name}</p>
                  )}
                  {user.slug && (
                    <p className="text-gray-400 text-xs">slug: {user.slug}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    Role: <span className="text-blue-300">{user.role}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-gray-400">
                    <p>ID: {user.id}</p>
                    <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Delete button for affiliates */}
                  {user.role === 'affiliate' && (
                    <button
                      onClick={() => void handleDeleteAffiliate(user.id, user.business_name || user.name)}
                      disabled={deletingAffiliate === user.id}
                      className={`flex items-center gap-2 px-3 py-1.5 text-white text-xs rounded transition-colors ${
                        deletingAffiliate === user.id
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      title="Delete affiliate and all associated data"
                    >
                      <Trash2 className="w-3 h-3" />
                      {deletingAffiliate === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              User Management
            </h2>
            <Button 
              variant="primary" 
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700"
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add User
            </Button>
          </div>
        </div>
        
        {/* Sub-tabs */}
        <div className="px-6 py-3 border-b border-gray-700">
          <nav className="flex space-x-6">
            {subTabs.map((subTab) => {
              const Icon = subTab.icon;
              return (
                <button
                  key={subTab.id}
                  onClick={() => { handleSubTabChange(subTab.id); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSubTab === subTab.id
                      ? 'bg-blue-900 text-blue-300 border-b-2 border-blue-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {subTab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderSubTabContent(activeSubTab)}
        </div>
      </div>
      
      {/* Application Modal */}
      {modalState && (
        <ApplicationModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          type={modalState.type}
          applicationId={modalState.applicationId}
          businessName={modalState.businessName}
          isLoading={processingApplication}
        />
      )}
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => { setToast(null); }}
        />
      )}
    </div>
  );
};
