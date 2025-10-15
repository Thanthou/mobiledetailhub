/**
 * Logger utility for consistent logging across the application
 * Disables logging in production to avoid console noise
 */

import { env } from '@/shared/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
}

const config: LoggerConfig = {
  enabled: env.DEV,
  level: 'debug'
};

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  private shouldLog(level: LogLevel): boolean {
    return config.enabled && levels[level] >= levels[config.level];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console -- Logger utility needs console access
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console -- Logger utility needs console access
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  // Booking-specific loggers
  booking = {
    stepChanged: (step: string) => { this.debug(`🔄 Step changed to: ${step}`); },
    dataUpdated: (data: unknown) => { this.debug('📊 Booking data updated:', data); },
    vehicleSelected: (vehicle: string) => { this.debug(`🚗 Vehicle selected: ${vehicle}`); },
    serviceSelected: (service: string) => { this.debug(`🎯 Service selected: ${service}`); },
    addonsSelected: (addons: string[]) => { this.debug('➕ Addons selected:', addons); },
    scheduleSelected: (schedule: unknown) => { this.debug('📅 Schedule selected:', schedule); },
    paymentSelected: (method: string) => { this.debug(`💳 Payment method selected: ${method}`); },
    bookingCompleted: () => { this.info('🎉 Booking completed!'); },
    bookingReset: () => { this.debug('🔄 Booking reset'); },
    error: (error: string) => { this.error(`❌ Booking error: ${error}`); }
  };

  // Data loading loggers
  data = {
    loading: (type: string, params: unknown) => { this.debug(`🔍 Loading ${type}:`, params); },
    loaded: (type: string, count: number) => { this.debug(`📊 Loaded ${count} ${type}`); },
    error: (type: string, error: string) => { this.error(`❌ Error loading ${type}: ${error}`); },
    noData: (type: string, params: unknown) => { this.warn(`⚠️ No ${type} available:`, params); }
  };
}

export const logger = new Logger();
export default logger;
