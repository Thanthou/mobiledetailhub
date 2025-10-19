import React, { useEffect,useState } from 'react';
import { Calendar, Clock, DollarSign, FileText,Mail, Phone, User, X } from 'lucide-react';

import { Button } from '@/shared/ui';

import { createAppointment, updateAppointment } from '../../api';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment?: Appointment | null;
  selectedDate: string;
  selectedTime?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  appointment,
  selectedDate,
  selectedTime
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: '',
    service_duration: 60,
    start_time: '',
    end_time: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    price: 0,
    deposit: 0,
    notes: '',
    internal_notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!appointment;

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        // Edit mode - populate form with existing data
        setFormData({
          title: appointment.title,
          description: appointment.description || '',
          service_type: appointment.service_type,
          service_duration: appointment.service_duration,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          customer_name: appointment.customer_name,
          customer_phone: appointment.customer_phone,
          customer_email: appointment.customer_email || '',
          price: appointment.price || 0,
          deposit: appointment.deposit || 0,
          notes: appointment.notes || '',
          internal_notes: appointment.internal_notes || ''
        });
      } else {
        // Create mode - set defaults
        const startTime = selectedTime ? `${selectedDate}T${selectedTime}:00` : `${selectedDate}T09:00:00`;
        const endTime = selectedTime ? 
          new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString() : 
          new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();

        setFormData({
          title: '',
          description: '',
          service_type: '',
          service_duration: 60,
          start_time: startTime,
          end_time: endTime,
          customer_name: '',
          customer_phone: '',
          customer_email: '',
          price: 0,
          deposit: 0,
          notes: '',
          internal_notes: ''
        });
      }
      setError(null);
    }
  }, [isOpen, appointment, selectedDate, selectedTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleDurationChange = (duration: number) => {
    const startTime = new Date(formData.start_time);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    setFormData(prev => ({
      ...prev,
      service_duration: duration,
      end_time: endTime.toISOString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        const updateData: UpdateAppointmentRequest = {
          id: appointment.id,
          ...formData
        };
        await updateAppointment(appointment.id, updateData);
      } else {
        const createData: CreateAppointmentRequest = formData;
        await createAppointment(createData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 rounded-xl border border-stone-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isEdit ? 'Edit Appointment' : 'New Appointment'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(e); }} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="appointment-title" className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Title *
                </label>
                <input
                  id="appointment-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="appointment-service-type" className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Service Type *
                </label>
                <input
                  id="appointment-service-type"
                  type="text"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="appointment-description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="appointment-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Timing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="appointment-start-time" className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  id="appointment-start-time"
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time.slice(0, 16)}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="appointment-duration" className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes) *
                </label>
                <select
                  id="appointment-duration"
                  name="service_duration"
                  value={formData.service_duration}
                  onChange={(e) => { handleDurationChange(Number(e.target.value)); }}
                  required
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>

              <div>
                <label htmlFor="appointment-end-time" className="block text-sm font-medium text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  id="appointment-end-time"
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time.slice(0, 16)}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="appointment-customer-name" className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Customer Name *
                </label>
                <input
                  id="appointment-customer-name"
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="appointment-customer-phone" className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone *
                </label>
                <input
                  id="appointment-customer-phone"
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="appointment-customer-email" className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Email
              </label>
              <input
                id="appointment-customer-email"
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="appointment-price" className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-2" />
                  Price
                </label>
                <input
                  id="appointment-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="appointment-deposit" className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-2" />
                  Deposit
                </label>
                <input
                  id="appointment-deposit"
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="appointment-notes" className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Customer Notes
                </label>
                <textarea
                  id="appointment-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="appointment-internal-notes" className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Internal Notes
                </label>
                <textarea
                  id="appointment-internal-notes"
                  name="internal_notes"
                  value={formData.internal_notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-stone-700">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
