/**
 * Cron Service
 * Manages scheduled tasks for token cleanup and maintenance
 */

import cron from 'node-cron';
import { cleanupTokens } from '../scripts/cleanup-tokens.js';
import { createModuleLogger } from '../config/logger.js';
const logger = createModuleLogger('cronService');

/**
 * Initialize cron jobs
 */
const initializeCronJobs = () => {
  // Clean up expired tokens every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Running scheduled token cleanup');
    try {
      await cleanupTokens();
    } catch (error) {
      logger.error('Scheduled token cleanup failed', { error: error.message });
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  // Clean up expired tokens every 6 hours (backup)
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Running backup token cleanup');
    try {
      await cleanupTokens();
    } catch (error) {
      logger.error('Backup token cleanup failed', { error: error.message });
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  logger.debug('Cron jobs initialized');
};

/**
 * Stop all cron jobs
 */
const stopCronJobs = () => {
  cron.getTasks().forEach((task) => {
    task.stop();
  });
  logger.info('All cron jobs stopped');
};

/**
 * Get cron job status
 */
const getCronStatus = () => {
  const tasks = cron.getTasks();
  return {
    active: Object.keys(tasks).length,
    tasks: Object.keys(tasks).map(name => ({
      name,
      running: tasks[name].running
    }))
  };
};

export {
  initializeCronJobs,
  stopCronJobs,
  getCronStatus
};
