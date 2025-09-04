import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { ReviewFormProps, ReviewFormData } from './types';
import { useSubmitReview } from './hooks/useReviews';

export const ReviewForm: React.FC<ReviewFormProps> = ({
  businessSlug,
  businessName,
  reviewType,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    content: '',
    reviewer_name: '',
    reviewer_email: '',
    reviewer_phone: '',
    service_category: '',
    service_date: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submitReview, loading: submitLoading } = useSubmitReview();

  const handleInputChange = (field: keyof ReviewFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.reviewer_name.trim()) {
      newErrors.reviewer_name = 'Name is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Review content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Review must be at least 10 characters long';
    }

    if (formData.reviewer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reviewer_email)) {
      newErrors.reviewer_email = 'Please enter a valid email address';
    }

    if (formData.reviewer_phone && !/^[\d\s\-\+\(\)]+$/.test(formData.reviewer_phone)) {
      newErrors.reviewer_phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const reviewData = {
        review_type: reviewType,
        affiliate_id: businessSlug ? undefined : undefined, // This would need to be resolved from businessSlug
        business_slug: businessSlug,
        rating: formData.rating,
        title: formData.title || undefined,
        content: formData.content,
        reviewer_name: formData.reviewer_name,
        reviewer_email: formData.reviewer_email || undefined,
        reviewer_phone: formData.reviewer_phone || undefined,
        service_category: formData.service_category || undefined,
        service_date: formData.service_date || undefined
      };

      await submitReview(reviewData);
      onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const isSubmitting = isLoading || submitLoading;

  return (
    <div className="bg-stone-800 rounded-xl p-6 border border-stone-600">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Write a Review
        </h3>
        {businessName && (
          <p className="text-stone-400">
            Share your experience with <span className="text-orange-400 font-medium">{businessName}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-stone-300 text-sm font-medium mb-3">
            Overall Rating *
          </label>
          <div className="flex items-center gap-2">
            <StarRating 
              rating={formData.rating} 
              size="lg" 
              showCount={false}
            />
            <span className="text-stone-400 text-sm ml-2">
              {formData.rating} out of 5 stars
            </span>
          </div>
        </div>

        {/* Reviewer Name */}
        <div>
          <label className="block text-stone-300 text-sm font-medium mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={formData.reviewer_name}
            onChange={(e) => handleInputChange('reviewer_name', e.target.value)}
            className={`w-full px-4 py-3 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.reviewer_name ? 'border-red-500' : 'border-stone-600'
            }`}
            placeholder="Enter your name"
            disabled={isSubmitting}
          />
          {errors.reviewer_name && (
            <p className="text-red-400 text-sm mt-1">{errors.reviewer_name}</p>
          )}
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-stone-300 text-sm font-medium mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Summarize your experience"
            disabled={isSubmitting}
          />
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-stone-300 text-sm font-medium mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none ${
              errors.content ? 'border-red-500' : 'border-stone-600'
            }`}
            placeholder="Tell us about your experience. What did you like? What could be improved?"
            disabled={isSubmitting}
          />
          <div className="flex justify-between mt-1">
            {errors.content && (
              <p className="text-red-400 text-sm">{errors.content}</p>
            )}
            <p className="text-stone-400 text-sm ml-auto">
              {formData.content.length}/2000 characters
            </p>
          </div>
        </div>

        {/* Service Category */}
        <div>
          <label className="block text-stone-300 text-sm font-medium mb-2">
            Service Category (Optional)
          </label>
          <select
            value={formData.service_category}
            onChange={(e) => handleInputChange('service_category', e.target.value)}
            className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            disabled={isSubmitting}
          >
            <option value="">Select a service</option>
            <option value="auto">Auto Detailing</option>
            <option value="boat">Boat Detailing</option>
            <option value="rv">RV Detailing</option>
            <option value="ceramic">Ceramic Coating</option>
            <option value="ppf">Paint Protection Film</option>
            <option value="paint-correction">Paint Correction</option>
            <option value="interior">Interior Detailing</option>
            <option value="exterior">Exterior Detailing</option>
          </select>
        </div>

        {/* Service Date */}
        <div>
          <label className="block text-stone-300 text-sm font-medium mb-2">
            Service Date (Optional)
          </label>
          <input
            type="date"
            value={formData.service_date}
            onChange={(e) => handleInputChange('service_date', e.target.value)}
            className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            disabled={isSubmitting}
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={formData.reviewer_email}
              onChange={(e) => handleInputChange('reviewer_email', e.target.value)}
              className={`w-full px-4 py-3 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.reviewer_email ? 'border-red-500' : 'border-stone-600'
              }`}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.reviewer_email && (
              <p className="text-red-400 text-sm mt-1">{errors.reviewer_email}</p>
            )}
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.reviewer_phone}
              onChange={(e) => handleInputChange('reviewer_phone', e.target.value)}
              className={`w-full px-4 py-3 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.reviewer_phone ? 'border-red-500' : 'border-stone-600'
              }`}
              placeholder="(555) 123-4567"
              disabled={isSubmitting}
            />
            {errors.reviewer_phone && (
              <p className="text-red-400 text-sm mt-1">{errors.reviewer_phone}</p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-400 text-stone-900 font-semibold py-3 px-6 rounded-lg hover:bg-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-stone-600 text-stone-300 rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>

        <p className="text-stone-400 text-xs text-center">
          Your review will be moderated before being published. We reserve the right to edit or remove reviews that violate our community guidelines.
        </p>
      </form>
    </div>
  );
};
