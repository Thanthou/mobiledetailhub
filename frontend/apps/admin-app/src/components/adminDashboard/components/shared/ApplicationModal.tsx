import React, { useState } from 'react';
import { CheckCircle, X, XCircle } from 'lucide-react';

import { Button } from '@shared/ui';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { slug?: string; reason?: string; notes: string }) => Promise<void>;
  type: 'approve' | 'reject';
  businessName: string;
  isLoading?: boolean;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  businessName,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    slug: '',
    reason: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Validate slug format for approval
    if (type === 'approve' && formData.slug) {
      if (formData.slug.length < 3) {
        alert('Slug must be at least 3 characters long');
        return;
      }
      if (formData.slug.length > 50) {
        alert('Slug must be less than 50 characters long');
        return;
      }
      if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        alert('Slug must contain only lowercase letters, numbers, and hyphens');
        return;
      }
      if (formData.slug.startsWith('-') || formData.slug.endsWith('-')) {
        alert('Slug cannot start or end with a hyphen');
        return;
      }
      if (formData.slug.includes('--')) {
        alert('Slug cannot contain consecutive hyphens');
        return;
      }
    }
    
    // Validate rejection reason
    if (type === 'reject' && formData.reason) {
      if (formData.reason.trim().length < 10) {
        alert('Rejection reason must be at least 10 characters long');
        return;
      }
      if (formData.reason.trim().length > 500) {
        alert('Rejection reason must be less than 500 characters long');
        return;
      }
    }
    
    // Validate admin notes length
    if (formData.notes && formData.notes.trim().length > 1000) {
      alert('Admin notes must be less than 1000 characters long');
      return;
    }
    
    void onSubmit(formData);
    setFormData({ slug: '', reason: '', notes: '' });
  };

  const handleClose = () => {
    setFormData({ slug: '', reason: '', notes: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {type === 'approve' ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <h3 className="text-lg font-semibold text-white">
              {type === 'approve' ? 'Approve' : 'Reject'} Application
            </h3>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 text-sm">
            {type === 'approve' ? 'Approving' : 'Rejecting'} application for{' '}
            <span className="font-medium text-white">{businessName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'approve' && (
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                Approved Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => { setFormData({ ...formData, slug: e.target.value }); }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., my-business-name"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                This will be the URL slug for the affiliate&rsquo;s business page
              </p>
            </div>
          )}

          {type === 'reject' && (
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => { setFormData({ ...formData, reason: e.target.value }); }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for rejection..."
                rows={3}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Admin Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => { setFormData({ ...formData, notes: e.target.value }); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes (optional)..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              size="md"
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={type === 'approve' ? 'primary' : 'destructive'}
              size="md"
              className={`flex-1 px-4 py-2 ${
                type === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              loading={isLoading}
              disabled={isLoading}
            >
              {type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
