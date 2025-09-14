import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui';
import { StepContainer, StepBottomSection } from '../components';

interface BookingScheduleProps {
  averageRating: number;
  totalReviews: number;
  onBack: () => void;
  onBackToHome: () => void;
}

const BookingSchedule: React.FC<BookingScheduleProps> = ({
  averageRating,
  totalReviews,
  onBack,
  onBackToHome,
}) => {
  const [currentStep, setCurrentStep] = useState<'date' | 'time' | 'location' | 'details'>('date');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [blockedDays, setBlockedDays] = useState<Set<string>>(new Set());
  const [timeMessages, setTimeMessages] = useState<string[]>([]);
  const [locationData, setLocationData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    details: ''
  });
  const [calendarView, setCalendarView] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  // Date utilities
  const dateUtils = {
    getToday: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    },
    parseDate: (dateString: string) => {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    },
    formatDate: (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
  };

  // Load blocked days once on mount
  useEffect(() => {
    const loadBlockedDays = async () => {
      try {
        const response = await fetch('/api/schedule/blocked-days?startDate=2024-01-01&endDate=2025-12-31', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const blockedDates = new Set(data.map((day: any) => {
            return day.blocked_date.split('T')[0];
          }));
          setBlockedDays(blockedDates);
        }
      } catch (error) {
        console.error('Error loading blocked days:', error);
      }
    };
    
    loadBlockedDays();
  }, []);

  // Load time messages once on mount
  useEffect(() => {
    const loadTimeMessages = async () => {
      try {
        const response = await fetch('/src/features/booking/data/arrival-time.json');
        const data = await response.json();
        setTimeMessages(data.message);
      } catch (error) {
        console.error('Error loading time messages:', error);
        setTimeMessages([
          "We'll contact you within 24 hours to confirm the arrival time and ensure you and/or your vehicle are available.",
          "Our team will arrive at your specified location between 6:00 AM and 9:00 AM, unless other arrangements are agreed upon.",
          "If we can't reach you or confirm the appointment, we'll cancel the service at no cost to you."
        ]);
      }
    };
    loadTimeMessages();
  }, []);

  const steps = [
    { id: 'date', label: 'Date', icon: Calendar },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'details', label: 'Details', icon: CheckCircle }
  ];

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const isClickable = index === 0 || completedSteps.has(steps[index - 1].id);
            
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && setCurrentStep(step.id as any)}
                  disabled={!isClickable}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : isClickable
                      ? 'bg-stone-700 border-stone-600 text-stone-300 hover:border-orange-500'
                      : 'bg-stone-800 border-stone-700 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </button>
                
                {/* Step Label */}
                <div className="ml-3 text-center">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-orange-500' : isCompleted ? 'text-green-500' : 'text-stone-400'
                  }`}>
                    {step.label}
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    completedSteps.has(step.id) ? 'bg-green-500' : 'bg-stone-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-stone-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const selectedDateObj = dateUtils.parseDate(calendarView);
    const yearNum = selectedDateObj.getFullYear();
    const monthNum = selectedDateObj.getMonth();
    
    // Get first day of month and calculate starting date (Monday of first week)
    const firstDay = new Date(yearNum, monthNum, 1);
    const firstDayOfWeek = firstDay.getDay();
    const mondayOffset = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() + mondayOffset);
    
    // Generate calendar days (6 weeks = 42 days)
    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendarDays.push(date);
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
      const [y, m, d] = calendarView.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setMonth(dt.getMonth() + (direction === 'prev' ? -1 : 1));
      setCalendarView(dateUtils.formatDate(dt));
    };

    // Check if we can navigate to previous month (not before current month)
    const canNavigatePrev = () => {
      const [y, m, d] = calendarView.split('-').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
      
      return !(y === currentYear && m === currentMonth);
    };

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="bg-stone-700/50 rounded-lg p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            disabled={!canNavigatePrev()}
            className={`p-2 rounded-lg transition-colors ${
              canNavigatePrev() 
                ? 'hover:bg-stone-600 text-stone-300' 
                : 'text-stone-600 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h4 className="text-lg font-semibold text-orange-500">
            {monthNames[monthNum]} {yearNum}
          </h4>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-stone-600 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-stone-300" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center py-2 text-stone-400 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === monthNum;
            const today = dateUtils.getToday();
            const dateString = dateUtils.formatDate(date);
            const isToday = dateString === today;
            const isSelected = selectedDates.has(dateString);
            const isBlocked = blockedDays.has(dateString);
            
            const toggleDate = () => {
              if (isBlocked) return;
              setSelectedDates(prev => {
                const newSet = new Set(prev);
                if (newSet.has(dateString)) {
                  newSet.delete(dateString);
                } else {
                  newSet.add(dateString);
                }
                return newSet;
              });
            };
            
            return (
              <button
                key={index}
                onClick={toggleDate}
                disabled={isBlocked}
                className={`min-h-[3rem] p-2 border rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isBlocked 
                    ? 'bg-red-900/20 border-red-500 cursor-not-allowed opacity-50'
                    : isCurrentMonth 
                    ? 'bg-stone-800 border-stone-600 hover:bg-stone-600' 
                    : 'bg-stone-900/50 border-stone-700 hover:bg-stone-600'
                } ${
                  isToday && !isSelected ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <div className={`text-sm font-medium ${
                  isSelected 
                    ? 'text-white' 
                    : isCurrentMonth 
                    ? 'text-stone-300' 
                    : 'text-stone-500'
                } ${isToday && !isSelected ? 'text-orange-300' : ''} ${
                  isBlocked ? 'text-red-300' : ''
                }`}>
                  {date.getDate()}
                </div>
                {isBlocked && (
                  <div className="text-red-400 text-xs mt-1">✕</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDateStep = () => {
    return (
      <div className="space-y-6">
        {/* Calendar */}
        {renderCalendar()}

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setCompletedSteps(prev => new Set([...prev, 'date']));
              setCurrentStep('time');
            }}
            variant="primary"
            size="lg"
            className="px-8"
            disabled={selectedDates.size === 0}
          >
            Continue to Time
          </Button>
        </div>
      </div>
    );
  };

  const renderTimeStep = () => {
    return (
      <div className="space-y-6">
        {/* Time Information */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-4">Arrival Time</h3>
        </div>

        {/* Time Messages */}
        <div className="bg-stone-700/50 rounded-lg p-6">
          <div className="text-left">
            <ul className="space-y-3">
              {timeMessages.map((message, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <span className="text-stone-300 text-lg leading-relaxed">
                    {message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={() => {
              setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete('date');
                return newSet;
              });
              setCurrentStep('date');
            }}
            variant="secondary"
            size="lg"
            className="px-6"
          >
            Back to Date
          </Button>
          
          <Button
            onClick={() => {
              setCompletedSteps(prev => new Set([...prev, 'time']));
              setCurrentStep('location');
            }}
            variant="primary"
            size="lg"
            className="px-6"
          >
            Continue to Location
          </Button>
        </div>
      </div>
    );
  };

  const renderLocationStep = () => {
    const handleInputChange = (field: string, value: string) => {
      setLocationData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const isFormValid = () => {
      return locationData.firstName && 
             locationData.lastName && 
             locationData.phoneNumber && 
             locationData.email && 
             locationData.address && 
             locationData.city && 
             locationData.state;
    };

    return (
      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-stone-700/50 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <MapPin className="h-6 w-6 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-orange-500">Contact & Location Information</h3>
          </div>

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  value={locationData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  value={locationData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={locationData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={locationData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">Address *</label>
              <input
                type="text"
                value={locationData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={locationData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your City"
                />
              </div>
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-2">State *</label>
                <input
                  type="text"
                  value={locationData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="State"
                />
              </div>
            </div>

            {/* Details Field */}
            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">Additional Details</label>
              <textarea
                value={locationData.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Any special instructions or additional information..."
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={() => {
              setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete('time');
                return newSet;
              });
              setCurrentStep('time');
            }}
            variant="secondary"
            size="lg"
            className="px-6"
          >
            Back to Time
          </Button>
          
          <Button
            onClick={() => {
              setCompletedSteps(prev => new Set([...prev, 'location']));
              setCurrentStep('details');
            }}
            variant="primary"
            size="lg"
            className="px-6"
            disabled={!isFormValid()}
          >
            Continue to Details
          </Button>
        </div>
      </div>
    );
  };

  const renderDetailsStep = () => {
    return (
      <div className="space-y-6">
        {/* Service Summary */}
        <div className="bg-stone-700/50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-orange-500 mr-3" />
            <h4 className="text-lg font-semibold text-orange-500">Service Summary</h4>
          </div>
          <div className="text-center py-8">
            <p className="text-stone-300 text-lg">Service details will be shown here</p>
            <p className="text-stone-400 text-sm mt-2">Review your selected service and addons</p>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-stone-700/50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-orange-500 mr-3" />
            <h4 className="text-lg font-semibold text-orange-500">Special Instructions</h4>
          </div>
          <div className="text-center py-8">
            <p className="text-stone-300 text-lg">Special instructions form will be here</p>
            <p className="text-stone-400 text-sm mt-2">Add any special requests or notes</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentStep('location')}
            variant="outline-white"
            size="lg"
            className="px-8"
          >
            Back to Location
          </Button>
          <Button
            onClick={() => {
              setCompletedSteps(prev => new Set([...prev, 'details']));
              // This would trigger the next step in the booking flow
              console.log('All scheduling steps completed!');
            }}
            variant="primary"
            size="lg"
            className="px-8"
          >
            Complete Schedule
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Main Content */}
      <div className="flex flex-col justify-center px-4 py-8" style={{ height: 'calc(100vh - 200px)' }}>
        <div>
          {/* Scheduling Interface */}
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto" style={{ marginTop: '-100px' }}>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Schedule Your Service</h3>
            
            {/* Progress Bar */}
            {renderProgressBar()}
            
            {/* Step Content */}
            {currentStep === 'date' && renderDateStep()}
            {currentStep === 'time' && renderTimeStep()}
            {currentStep === 'location' && renderLocationStep()}
            {currentStep === 'details' && renderDetailsStep()}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <StepBottomSection
        onBack={onBack}
        onNext={() => {
          // TODO: Implement scheduling logic
          console.log('Schedule confirmed!');
        }}
        showBack={true}
        showNext={true}
        nextText="Confirm Schedule"
        averageRating={averageRating}
        totalReviews={totalReviews}
        currentStep={4}
        totalSteps={5}
      />
    </div>
  );
};

export default BookingSchedule;
