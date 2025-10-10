import React, { startTransition, useCallback, useEffect, useState } from 'react';

import { toggleBlockedDay } from './api';
import { AppointmentModal } from './components/modals/AppointmentModal';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ScheduleHeader } from './components/ScheduleHeader';
import { ScheduleSidebar } from './components/ScheduleSidebar';
import { useScheduleData } from './hooks/useScheduleData';
import type { Appointment } from './types';

// Small safe date helpers (no timezone shifts)
const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const ScheduleTab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => toYmd(new Date()));
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  // Make sure your hook exposes "isInitialLoading" and "isRefetching" separately if possible.
  const {
    appointments,
    timeBlocks,
    blockedDays: apiBlockedDays,
    isInitialLoading,   // <- only true on first load
    isRefetching,       // <- true on background refresh
    error: _error,
    refreshData
  } = useScheduleData(selectedDate, viewMode);

  // Local optimistic blocked days
  const [blockedDaysLocal, setBlockedDaysLocal] = useState<Set<string>>(new Set());
  const [isMutatingBlock, setIsMutatingBlock] = useState(false);

  // Sync local set with API when not in the middle of a mutation
  useEffect(() => {
    if (isMutatingBlock) return; // keep user’s optimistic view
    const next = new Set<string>(
      apiBlockedDays.map(d => toYmd(new Date(d.blocked_date)))
    );
    setBlockedDaysLocal(next);
  }, [apiBlockedDays, isMutatingBlock]);

  const toggleDayBlock = useCallback(async (date: string) => {
    // optimistic flip
    setIsMutatingBlock(true);
    setBlockedDaysLocal(prev => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });

    try {
      await toggleBlockedDay(date);
      // background refresh, but keep grid visible (no flash)
      refreshData();
    } catch (e) {
      // revert on failure
      setBlockedDaysLocal(prev => {
        const next = new Set(prev);
        if (next.has(date)) next.delete(date);
        else next.add(date);
        return next;
      });
      console.error('Error toggling blocked day:', e);
    } finally {
      setIsMutatingBlock(false);
    }
  }, [refreshData]);

  const handleCreateAppointment = useCallback((time?: string, date?: string) => {
    setSelectedTime(time);
    if (date) setSelectedDate(date);
    setEditingAppointment(null);
    setIsModalOpen(true);
  }, []);

  const handleEditAppointment = useCallback((appointment: Appointment) => {
    setEditingAppointment(appointment);
    setSelectedTime(undefined);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setSelectedTime(undefined);
  }, []);

  const handleModalSuccess = useCallback(() => {
    // keep grid up; do a gentle background refresh
    refreshData();
  }, [refreshData]);

  const goToToday = useCallback(() => {
    startTransition(() => { setSelectedDate(toYmd(new Date())); });
  }, []);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    startTransition(() => {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() + (direction === 'prev' ? -7 : 7));
      setSelectedDate(toYmd(dt));
    });
  }, [selectedDate]);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    startTransition(() => {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setMonth(dt.getMonth() + (direction === 'prev' ? -1 : 1));
      setSelectedDate(toYmd(dt));
    });
  }, [selectedDate]);

  // IMPORTANT: pass the optimistic set, not a freshly constructed Set every render.
  const blockedDaysSet = blockedDaysLocal;

  return (
    <div className="space-y-6">
      <ScheduleHeader
        selectedDate={selectedDate}
        setSelectedDate={(v) => { startTransition(() => { setSelectedDate(v); }); }}
        viewMode={viewMode}
        setViewMode={(v) => { startTransition(() => { setViewMode(v); }); }}
        onCreateAppointment={() => { handleCreateAppointment(); }}
        onGoToToday={goToToday}
      />

      <ScheduleGrid
        selectedDate={selectedDate}
        appointments={appointments}
        timeBlocks={timeBlocks}
        // Only show "loading" for initial mount, not refetches
        loading={!!isInitialLoading}
        viewMode={viewMode}
        onEditAppointment={handleEditAppointment}
        onCreateAppointment={handleCreateAppointment}
        blockedDays={blockedDaysSet}
        onToggleDayBlock={toggleDayBlock}
        onNavigateMonth={navigateMonth}
        onNavigateWeek={navigateWeek}
        // If you want, expose an "isRefreshing" to draw a subtle top progress bar
        isRefreshing={!!isRefetching || isMutatingBlock}
      />

      <ScheduleSidebar viewMode={viewMode} />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        appointment={editingAppointment}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default ScheduleTab;
