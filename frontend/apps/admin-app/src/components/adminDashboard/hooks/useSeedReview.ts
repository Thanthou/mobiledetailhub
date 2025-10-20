import { useState } from 'react';

import { seedReviews, uploadReviewerAvatar } from '../api/admin.api';

interface ReviewFormData {
  name: string;
  stars: number;
  title: string;
  content: string;
  type: 'affiliate' | 'mdh';
  businessSlug?: string;
  source: 'website' | 'google' | 'yelp' | 'facebook';
  daysAgo: number;
  weeksAgo: number;
  specificDate: string;
  serviceCategory: 'car' | 'truck' | 'boat' | 'rv' | 'motorcycle' | 'ceramic' | 'none';
  avatarFile?: File;
  reviewerUrl?: string;
}

type SubmitStatus = 'idle' | 'success' | 'error';

/**
 * Hook for seeding reviews via the admin API
 */
export const useSeedReview = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const submitReview = async (formData: ReviewFormData) => {
    if (!formData.name || !formData.title || !formData.content) {
      setSubmitMessage('Please fill in all required fields');
      setSubmitStatus('error');
      return false;
    }

    if (formData.type === 'affiliate' && !formData.businessSlug) {
      setSubmitMessage('Please select a business for affiliate reviews');
      setSubmitStatus('error');
      return false;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('Sending request...');

    try {
      // Add timeout to prevent infinite hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000); // 10 second timeout

      const result = await seedReviews([formData], controller.signal);

      clearTimeout(timeoutId);

      // Log error details if there are any
      if (result.errorDetails && result.errorDetails.length > 0) {
        console.error('Review creation errors:', result.errorDetails);
      }

      // If there's an avatar file and the review was created successfully, upload the avatar
      if (formData.avatarFile && result.count && result.count > 0) {
        setSubmitMessage('Review created! Uploading avatar...');

        try {
          await uploadReviewerAvatar(
            formData.avatarFile,
            formData.name,
            result.reviewIds?.[0] ?? '1'
          );
          setSubmitMessage(`Successfully added review with avatar: "${formData.title}"`);
          setSubmitStatus('success');
        } catch (avatarError) {
          console.warn('Avatar upload error:', avatarError);
          setSubmitMessage(`Review created (avatar upload failed): "${formData.title}"`);
          setSubmitStatus('success');
        }
      } else {
        setSubmitMessage(`Successfully added review: "${formData.title}"`);
        setSubmitStatus('success');
      }

      return true;
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');

      if (error instanceof Error && error.name === 'AbortError') {
        setSubmitMessage(
          'Request timed out after 10 seconds. Please check if the backend server is running.'
        );
      } else {
        setSubmitMessage(error instanceof Error ? error.message : 'Failed to seed review');
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = () => {
    setSubmitStatus('idle');
    setSubmitMessage('');
  };

  return {
    isSubmitting,
    submitStatus,
    submitMessage,
    submitReview,
    resetStatus
  };
};

