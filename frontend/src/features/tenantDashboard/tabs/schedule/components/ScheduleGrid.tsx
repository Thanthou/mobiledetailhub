import React from 'react';
import { Filter, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Appointment, TimeBlock } from '../types';

interface ScheduleGridProps {
  selectedDate: string;
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
  loading: boolean;
  viewMode: 'day' | 'week' | 'month';
  onEditAppointment: (appointment: Appointment) => void;
  onCreateAppointment: (time?: string, date?: string) => void;
  blockedDays: Set<string>;
  onToggleDayBlock: (date: string) => Promise<void>;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedDate,
  appointments,
  timeBlocks,
  loading,
  viewMode,
  onEditAppointment,
  onCreateAppointment,
  blockedDays,
  onToggleDayBlock,
  onNavigateMonth,
  onNavigateWeek
}) => {
  // Single comprehensive date utility function
  const dateUtils = {
    // Get today's date as YYYY-MM-DD string
    getToday: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    },
    
    // Parse date string as local date (no timezone issues)
    parseDate: (dateString: string) => {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    },
    
    // Format date as YYYY-MM-DD string
    formatDate: (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    
    // Get week dates (Monday to Sunday) for a given date
    getWeekDates: (dateString: string) => {
      const [year, month, day] = dateString.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const dayOfWeek = selectedDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const weekDate = new Date(year, month - 1, day + mondayOffset + i);
        weekDates.push(`${weekDate.getFullYear()}-${String(weekDate.getMonth() + 1).padStart(2, '0')}-${String(weekDate.getDate()).padStart(2, '0')}`);
      }
      return weekDates;
    },

    // Get current month/year display
    getCurrentMonthYear: (dateString: string) => {
      const [year, month] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    },

    // Get week range display
    getWeekRange: (dateString: string) => {
      const weekDates = dateUtils.getWeekDates(dateString);
      const startDate = dateUtils.parseDate(weekDates[0]);
      const endDate = dateUtils.parseDate(weekDates[6]);
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // 8 AM to 7 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Get appointments for a specific date and time
  const getAppointmentForDateTime = (date: string, time: string) => {
    return appointments.find(apt => {
      const startTime = new Date(apt.start_time);
      const appointmentDate = startTime.toISOString().split('T')[0];
      const timeString = startTime.toTimeString().slice(0, 5);
      return appointmentDate === date && timeString === time;
    });
  };

  // Get time block for a specific date and time
  const getTimeBlockForDateTime = (date: string, time: string) => {
    return timeBlocks.find(block => {
      const startTime = new Date(block.start_time);
      const endTime = new Date(block.end_time);
      const blockDate = startTime.toISOString().split('T')[0];
      const slotTime = new Date(`${date}T${time}:00`);
      return blockDate === date && slotTime >= startTime && slotTime < endTime;
    });
  };

  // Render day view
  const renderDayView = () => {
    return (
      <div className="space-y-2">
        {timeSlots.map((time) => {
          const appointment = getAppointmentForDateTime(selectedDate, time);
          const timeBlock = getTimeBlockForDateTime(selectedDate, time);

          return (
            <div key={time} className="flex items-center border-b border-stone-700 last:border-b-0">
              <div className="w-16 text-gray-400 text-sm font-medium py-3">
                {time}
              </div>
              <div className="flex-1 py-2">
                {appointment ? (
                  <div 
                    className={`p-3 rounded-lg border-l-4 cursor-pointer hover:opacity-80 transition-opacity ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-900/30 border-green-500' 
                        : appointment.status === 'scheduled'
                        ? 'bg-blue-900/30 border-blue-500'
                        : appointment.status === 'in_progress'
                        ? 'bg-orange-900/30 border-orange-500'
                        : appointment.status === 'completed'
                        ? 'bg-gray-900/30 border-gray-500'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-900/30 border-red-500'
                        : 'bg-yellow-900/30 border-yellow-500'
                    }`}
                    onClick={() => onEditAppointment(appointment)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{appointment.customer_name}</p>
                        <p className="text-gray-300 text-sm">{appointment.title}</p>
                        <p className="text-gray-400 text-xs">{appointment.service_duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">{appointment.customer_phone}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-900 text-green-300' 
                            : appointment.status === 'scheduled'
                            ? 'bg-blue-900 text-blue-300'
                            : appointment.status === 'in_progress'
                            ? 'bg-orange-900 text-orange-300'
                            : appointment.status === 'completed'
                            ? 'bg-gray-900 text-gray-300'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {appointment.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : timeBlock ? (
                  <div className="p-3 rounded-lg border-l-4 bg-gray-900/30 border-gray-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{timeBlock.title}</p>
                        <p className="text-gray-300 text-sm">{timeBlock.description}</p>
                        <p className="text-gray-400 text-xs">{timeBlock.block_type}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                          {timeBlock.block_type}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="h-12 flex items-center text-gray-500 text-sm cursor-pointer hover:text-white hover:bg-stone-700/50 rounded-lg transition-colors"
                    onClick={() => onCreateAppointment(time, selectedDate)}
                  >
                    Available - Click to add appointment
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render week view - calendar style with large squares
  const renderWeekView = () => {
    const weekDates = dateUtils.getWeekDates(selectedDate);
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date) => {
          const dateObj = dateUtils.parseDate(date);
          const today = dateUtils.getToday();
          const isToday = date === today;
          const isCurrentMonth = dateObj.getMonth() === dateUtils.parseDate(selectedDate).getMonth();
          const isBlocked = blockedDays.has(date);
          console.log('Week view - Date:', date, 'isBlocked:', isBlocked, 'blockedDays:', [...blockedDays]);
          
          // Get appointment for this date (since only one per day)
          const dayAppointment = appointments.find(apt => {
            const aptDate = new Date(apt.start_time).toISOString().split('T')[0];
            return aptDate === date;
          });
          
          // Get time block for this date
          const dayTimeBlock = timeBlocks.find(block => {
            const blockDate = new Date(block.start_time).toISOString().split('T')[0];
            return blockDate === date;
          });
          
          return (
            <div 
              key={date}
              className={`min-h-[200px] p-4 rounded-xl border-2 transition-all duration-200 relative cursor-pointer ${
                isToday 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : isCurrentMonth 
                    ? 'border-stone-600 bg-stone-800/50' 
                    : 'border-stone-700 bg-stone-900/30'
              } ${isBlocked ? 'bg-red-900/20 border-red-500' : ''}`}
              onClick={() => {
                alert('CLICKED: ' + date);
                onToggleDayBlock(date).catch(console.error);
              }}
            >
              {/* Day header */}
              <div className="mb-3">
                <div className={`flex items-center justify-between text-sm font-medium ${
                  isToday ? 'text-orange-300' : isCurrentMonth ? 'text-white' : 'text-gray-500'
                }`}>
                  <div>
                    {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  {!dayAppointment && !dayTimeBlock && !isBlocked && (
                    <div 
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-orange-500/20 rounded-full transition-all duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateAppointment(undefined, date);
                      }}
                    >
                      <span className="text-lg font-light">+</span>
                    </div>
                  )}
                </div>
                <div className={`text-lg font-bold ${
                  isToday ? 'text-orange-300' : isCurrentMonth ? 'text-white' : 'text-gray-500'
                }`}>
                  {dateObj.getDate()}
                </div>
              </div>
              
              {/* Day content */}
              <div className="flex-1">
                {dayAppointment ? (
                  <div 
                    className={`p-3 rounded-lg border-l-4 cursor-pointer hover:opacity-80 transition-opacity ${
                      dayAppointment.status === 'confirmed' 
                        ? 'bg-green-900/30 border-green-500' 
                        : dayAppointment.status === 'scheduled'
                        ? 'bg-blue-900/30 border-blue-500'
                        : dayAppointment.status === 'in_progress'
                        ? 'bg-orange-900/30 border-orange-500'
                        : dayAppointment.status === 'completed'
                        ? 'bg-gray-900/30 border-gray-500'
                        : dayAppointment.status === 'cancelled'
                        ? 'bg-red-900/30 border-red-500'
                        : 'bg-yellow-900/30 border-yellow-500'
                    }`}
                    onClick={() => onEditAppointment(dayAppointment)}
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-white text-sm">{dayAppointment.customer_name}</p>
                        <p className="text-gray-300 text-xs">{dayAppointment.title}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">
                          {new Date(dayAppointment.start_time).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })} - {new Date(dayAppointment.end_time).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          {dayAppointment.service_duration} minutes
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          {dayAppointment.customer_phone}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          dayAppointment.status === 'confirmed' 
                            ? 'bg-green-900 text-green-300' 
                            : dayAppointment.status === 'scheduled'
                            ? 'bg-blue-900 text-blue-300'
                            : dayAppointment.status === 'in_progress'
                            ? 'bg-orange-900 text-orange-300'
                            : dayAppointment.status === 'completed'
                            ? 'bg-gray-900 text-gray-300'
                            : dayAppointment.status === 'cancelled'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {dayAppointment.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : dayTimeBlock ? (
                  <div className="p-3 rounded-lg border-l-4 bg-gray-900/30 border-gray-500">
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-white text-sm">{dayTimeBlock.title}</p>
                        <p className="text-gray-300 text-xs">{dayTimeBlock.description}</p>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        {dayTimeBlock.block_type}
                      </div>
                      
                      <div className="pt-2">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                          {dayTimeBlock.block_type}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    {/* Empty day - no content needed since + button is in header */}
                  </div>
                )}
              </div>
              
              {/* Red X overlay for blocked days */}
              {isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <X className="w-16 h-16 text-red-500 opacity-80" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render month view (simplified for now)
  const renderMonthView = () => {
    const selectedDateObj = dateUtils.parseDate(selectedDate);
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
    
    // Get appointments for the month
    const monthAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate.getFullYear() === yearNum && aptDate.getMonth() === monthNum;
    });
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Month header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center py-2 text-gray-400 text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = date.getMonth() === monthNum;
              const today = dateUtils.getToday();
              const dateString = dateUtils.formatDate(date);
              const isToday = dateString === today;
              const isBlocked = blockedDays.has(dateString);
              console.log('Month view - Date:', dateString, 'isBlocked:', isBlocked, 'blockedDays:', [...blockedDays]);
              const dayAppointments = monthAppointments.filter(apt => {
                const aptDate = new Date(apt.start_time).toISOString().split('T')[0];
                return aptDate === dateString;
              });
              
              return (
                <div 
                  key={index}
                  className={`min-h-[6rem] p-2 border border-stone-700 rounded-lg relative cursor-pointer transition-all duration-200 ${
                    isCurrentMonth ? 'bg-stone-800' : 'bg-stone-900/50'
                  } ${isToday ? 'ring-2 ring-orange-500' : ''} ${isBlocked ? 'bg-red-900/20 border-red-500' : ''}`}
                  onClick={() => onToggleDayBlock(dateString).catch(console.error)}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? 'text-white' : 'text-gray-500'
                  } ${isToday ? 'text-orange-300' : ''}`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {!isBlocked && dayAppointments.slice(0, 3).map((appointment) => (
                      <div 
                        key={appointment.id}
                        className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-900/30 text-green-300' 
                            : appointment.status === 'scheduled'
                            ? 'bg-blue-900/30 text-blue-300'
                            : appointment.status === 'in_progress'
                            ? 'bg-orange-900/30 text-orange-300'
                            : appointment.status === 'completed'
                            ? 'bg-gray-900/30 text-gray-300'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-900/30 text-red-300'
                            : 'bg-yellow-900/30 text-yellow-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAppointment(appointment);
                        }}
                      >
                        <div className="truncate">{appointment.customer_name}</div>
                        <div className="truncate text-xs opacity-75">{appointment.title}</div>
                      </div>
                    ))}
                    {!isBlocked && dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                  
                  {/* Red X overlay for blocked days */}
                  {isBlocked && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <X className="w-8 h-8 text-red-500 opacity-80" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Get title based on view mode
  const getTitle = () => {
    const date = dateUtils.parseDate(selectedDate);
    switch (viewMode) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'week':
        return ''; // No title for week view since it's shown in center navigation
      case 'month':
        return ''; // No title for month view since it's shown in center navigation
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
        <div className="animate-pulse space-y-4">
          {viewMode === 'day' ? (
            timeSlots.map((time) => (
              <div key={time} className="h-12 bg-stone-700 rounded"></div>
            ))
          ) : viewMode === 'week' ? (
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="min-h-[200px] bg-stone-700 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="h-24 bg-stone-700 rounded"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
      <div className="mb-4 flex items-center justify-between relative">
        {getTitle() && (
          <h3 className="text-lg font-semibold text-white">
            {getTitle()}
          </h3>
        )}
        
        {/* Week Navigation - centered, only show in week view */}
        {viewMode === 'week' && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
            <button
              onClick={() => onNavigateWeek('prev')}
              className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <span className="text-lg font-semibold text-white">
              {dateUtils.getWeekRange(selectedDate)}
            </span>
            
            <button
              onClick={() => onNavigateWeek('next')}
              className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Month Navigation - centered, only show in month view */}
        {viewMode === 'month' && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
            <button
              onClick={() => onNavigateMonth('prev')}
              className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <span className="text-lg font-semibold text-white">
              {dateUtils.getCurrentMonthYear(selectedDate)}
            </span>
            
            <button
              onClick={() => onNavigateMonth('next')}
              className="text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}
    </div>
  );
};