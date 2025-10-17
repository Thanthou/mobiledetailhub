import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Star } from 'lucide-react';

import { useSeedReview } from '@/features/adminDashboard/hooks/useSeedReview';

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


const ReviewsTab: React.FC = () => {
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    stars: 5,
    title: '',
    content: '',
    type: 'mdh',
    businessSlug: '',
    source: 'website',
    daysAgo: 0,
    weeksAgo: 0,
    specificDate: '',
    serviceCategory: 'none',
    reviewerUrl: ''
  });

  const { isSubmitting, submitStatus, submitMessage, submitReview } = useSeedReview();

  // Sample business slugs for affiliate reviews
  const businessSlugs = [
    { value: 'jps', label: 'JP\'s Mobile Detailing' },
    { value: 'premium-auto-spa', label: 'Premium Auto Spa' },
    { value: 'elite-mobile-detail', label: 'Elite Mobile Detail' },
    { value: 'quick-clean-mobile', label: 'Quick Clean Mobile' }
  ];

  const handleInputChange = (field: keyof ReviewFormData, value: string | number | File | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReview = async () => {
    const success = await submitReview(formData);

    if (success) {
      // Reset form
      setFormData({
        name: '',
        stars: 5,
        title: '',
        content: '',
        type: 'mdh',
        businessSlug: '',
        source: 'website',
        daysAgo: 0,
        weeksAgo: 0,
        specificDate: '',
        serviceCategory: 'none',
        reviewerUrl: ''
      });
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={() => { if (interactive) handleInputChange('stars', star); }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Google Reviews Integration */}
      <div className="bg-blue-900 rounded-lg p-6 border border-blue-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Google Reviews Integration
        </h2>
        <p className="text-blue-200 mb-4">
          Connect your Google Business Profile to automatically fetch and display reviews on your website.
        </p>
        <a 
          href="http://localhost:3001/api/google/auth"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <Star className="w-4 h-4" />
          Connect Google Reviews
        </a>
        <p className="text-xs text-blue-300 mt-2">
          This will open Google's authorization screen to connect your business profile.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Seed Reviews</h2>
        <p className="text-gray-300 mb-6">
          Add reviews to the system. Just fill in the 4 required fields and the rest will be handled automatically.
        </p>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="reviewer-name" className="block text-sm font-medium text-gray-300 mb-2">
              Reviewer Name *
            </label>
            <input
              id="reviewer-name"
              type="text"
              value={formData.name}
              onChange={(e) => { handleInputChange('name', e.target.value); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Smith"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
              Rating *
            </label>
            <div id="rating">
              {renderStars(formData.stars, true)}
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-300 mb-2">
              Review Title *
            </label>
            <input
              id="review-title"
              type="text"
              value={formData.title}
              onChange={(e) => { handleInputChange('title', e.target.value); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Amazing service!"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-300 mb-2">
              Review Content *
            </label>
            <textarea
              id="review-content"
              value={formData.content}
              onChange={(e) => { handleInputChange('content', e.target.value); }}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your review here..."
            />
          </div>

          <div>
            <label htmlFor="review-type" className="block text-sm font-medium text-gray-300 mb-2">
              Review Type
            </label>
            <select
              id="review-type"
              value={formData.type}
              onChange={(e) => { handleInputChange('type', e.target.value as 'affiliate' | 'mdh'); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mdh">MDH Site Review</option>
              <option value="affiliate">Affiliate Review</option>
            </select>
          </div>

          <div>
            <label htmlFor="business-slug" className="block text-sm font-medium text-gray-300 mb-2">
              Business {formData.type === 'affiliate' && <span className="text-red-400">*</span>}
            </label>
            <select
              id="business-slug"
              value={formData.businessSlug}
              onChange={(e) => { handleInputChange('businessSlug', e.target.value); }}
              className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formData.type === 'affiliate' ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={formData.type !== 'affiliate'}
            >
              <option value="">{formData.type === 'affiliate' ? 'Select a business' : 'N/A for MDH reviews'}</option>
              {businessSlugs.map((business) => (
                <option key={business.value} value={business.value}>
                  {business.label}
                </option>
              ))}
            </select>
            {formData.type !== 'affiliate' && (
              <p className="text-xs text-gray-400 mt-1">
                Business selection only applies to affiliate reviews
              </p>
            )}
          </div>

          <div>
            <label htmlFor="review-source" className="block text-sm font-medium text-gray-300 mb-2">
              Review Source
            </label>
            <select
              id="review-source"
              value={formData.source}
              onChange={(e) => { handleInputChange('source', e.target.value as 'website' | 'google' | 'yelp' | 'facebook'); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="website">Website</option>
              <option value="google">Google</option>
              <option value="yelp">Yelp</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label htmlFor="days-ago" className="block text-sm font-medium text-gray-300 mb-2">
              Days Ago (0-6 for recent reviews)
            </label>
            <input
              id="days-ago"
              type="number"
              min="0"
              max="6"
              value={formData.daysAgo}
              onChange={(e) => {
                const days = parseInt(e.target.value) || 0;
                handleInputChange('daysAgo', days);
                if (days > 0) {
                  handleInputChange('weeksAgo', 0); // Clear weeks if days is set
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="weeks-ago" className="block text-sm font-medium text-gray-300 mb-2">
              Weeks Ago (1+ for older reviews)
            </label>
            <input
              id="weeks-ago"
              type="number"
              min="0"
              max="52"
              value={formData.weeksAgo}
              onChange={(e) => {
                const weeks = parseInt(e.target.value) || 0;
                handleInputChange('weeksAgo', weeks);
                if (weeks > 0) {
                  handleInputChange('daysAgo', 0); // Clear days if weeks is set
                  handleInputChange('specificDate', ''); // Clear date if weeks is set
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="specific-date" className="block text-sm font-medium text-gray-300 mb-2">
              Specific Date (for reviews older than 52 weeks)
            </label>
            <input
              id="specific-date"
              type="date"
              value={formData.specificDate}
              onChange={(e) => {
                handleInputChange('specificDate', e.target.value);
                if (e.target.value) {
                  handleInputChange('daysAgo', 0); // Clear days if date is set
                  handleInputChange('weeksAgo', 0); // Clear weeks if date is set
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Use this for reviews older than 52 weeks (Google switches to date mode)
            </p>
          </div>

          <div>
            <label htmlFor="service-category" className="block text-sm font-medium text-gray-300 mb-2">
              Service Category
            </label>
            <select
              id="service-category"
              value={formData.serviceCategory}
              onChange={(e) => { handleInputChange('serviceCategory', e.target.value as 'car' | 'truck' | 'boat' | 'rv' | 'motorcycle' | 'ceramic' | 'none'); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="car">Car</option>
              <option value="truck">Truck</option>
              <option value="boat">Boat</option>
              <option value="rv">RV</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="ceramic">Ceramic</option>
            </select>
          </div>

          <div>
            <label htmlFor="avatar-file" className="block text-sm font-medium text-gray-300 mb-2">
              Avatar Image (Optional)
            </label>
            <input
              id="avatar-file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Validate file size (5MB limit)
                  if (file.size > 5 * 1024 * 1024) {
                    alert('Avatar file must be less than 5MB');
                    e.target.value = ''; // Clear the file input
                    return;
                  }
                  handleInputChange('avatarFile', file);
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.avatarFile && (
              <div className="mt-2 text-sm text-gray-400">
                Selected: {formData.avatarFile.name} ({(formData.avatarFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div>
            <label htmlFor="reviewer-url" className="block text-sm font-medium text-gray-300 mb-2">
              Reviewer Profile URL (Optional)
            </label>
            <input
              id="reviewer-url"
              type="url"
              value={formData.reviewerUrl}
              onChange={(e) => { handleInputChange('reviewerUrl', e.target.value); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., https://www.google.com/maps/contrib/123456789"
            />
            <p className="text-xs text-gray-400 mt-1">
              Link to reviewer&rsquo;s profile page (Google, Yelp, etc.)
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => { void handleSubmitReview(); }}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Save Review
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {submitMessage && (
          <div className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
            submitStatus === 'success' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-red-900 text-red-300'
          }`}>
            {submitStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {submitMessage}
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewsTab;
