/**
 * Analytics Event Queue
 * 
 * Provides resilience for analytics ingestion by queuing failed events to disk
 * and flushing them in batches when the database becomes available.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Queue file location
const QUEUE_DIR = path.join(__dirname, '../logs');
const QUEUE_FILE = path.join(QUEUE_DIR, 'analytics-queue.jsonl');

// Maximum queue size (number of events)
const MAX_QUEUE_SIZE = 10000;

// Ensure queue directory exists
if (!fs.existsSync(QUEUE_DIR)) {
  fs.mkdirSync(QUEUE_DIR, { recursive: true });
}

/**
 * Add an event to the disk queue
 * @param {object} event - The analytics event to queue
 */
export function queueEvent(event) {
  try {
    // Check queue size before adding
    const currentSize = getQueueSize();
    if (currentSize >= MAX_QUEUE_SIZE) {
      logger.warn('Analytics queue is full, dropping event', {
        queueSize: currentSize,
        maxSize: MAX_QUEUE_SIZE
      });
      return false;
    }

    // Append event as JSON line
    const eventLine = JSON.stringify({
      ...event,
      queuedAt: new Date().toISOString()
    }) + '\n';
    
    fs.appendFileSync(QUEUE_FILE, eventLine, 'utf8');
    
    logger.debug('Analytics event queued to disk', {
      event: event.event_name,
      tenantId: event.tenant_id
    });
    
    return true;
  } catch (error) {
    logger.error('Failed to queue analytics event', {
      error: error.message,
      event: event.event_name
    });
    return false;
  }
}

/**
 * Get the current queue size
 * @returns {number} Number of events in queue
 */
export function getQueueSize() {
  try {
    if (!fs.existsSync(QUEUE_FILE)) {
      return 0;
    }
    
    const content = fs.readFileSync(QUEUE_FILE, 'utf8');
    return content.split('\n').filter(line => line.trim()).length;
  } catch (error) {
    logger.error('Failed to read queue size', { error: error.message });
    return 0;
  }
}

/**
 * Flush queued events to database
 * @param {object} pool - Database pool instance
 * @returns {Promise<{success: number, failed: number}>}
 */
export async function flushQueue(pool) {
  if (!fs.existsSync(QUEUE_FILE)) {
    return { success: 0, failed: 0 };
  }

  let content;
  try {
    content = fs.readFileSync(QUEUE_FILE, 'utf8');
  } catch (error) {
    logger.error('Failed to read queue file', { error: error.message });
    return { success: 0, failed: 0 };
  }

  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return { success: 0, failed: 0 };
  }

  logger.info('Flushing analytics queue', { eventCount: lines.length });

  let successCount = 0;
  let failCount = 0;
  const failedEvents = [];

  for (const line of lines) {
    try {
      const event = JSON.parse(line);
      
      // Try to insert into database
      await pool.query(`
        INSERT INTO analytics.events (
          tenant_id,
          event_name,
          event_parameters,
          user_properties,
          custom_dimensions,
          client_info,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        event.tenant_id,
        event.event_name,
        event.event_parameters,
        event.user_properties,
        event.custom_dimensions,
        event.client_info,
        event.created_at
      ]);
      
      successCount++;
    } catch (error) {
      logger.warn('Failed to flush queued event', {
        error: error.message,
        event: line.substring(0, 100)
      });
      failCount++;
      failedEvents.push(line);
    }
  }

  // Rewrite queue file with only failed events
  try {
    if (failedEvents.length > 0) {
      fs.writeFileSync(QUEUE_FILE, failedEvents.join('\n') + '\n', 'utf8');
      logger.info('Queue flushed with partial success', {
        success: successCount,
        failed: failCount,
        remaining: failedEvents.length
      });
    } else {
      // All events processed successfully, delete queue file
      fs.unlinkSync(QUEUE_FILE);
      logger.info('Queue flushed successfully', {
        success: successCount,
        failed: 0
      });
    }
  } catch (error) {
    logger.error('Failed to update queue file after flush', { error: error.message });
  }

  return { success: successCount, failed: failCount };
}

/**
 * Start automatic queue flushing (every 5 minutes)
 * @param {object} pool - Database pool instance
 * @returns {NodeJS.Timeout} Interval handle
 */
export function startAutoFlush(pool) {
  const FLUSH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  const intervalHandle = setInterval(async () => {
    const queueSize = getQueueSize();
    if (queueSize > 0) {
      logger.info('Auto-flushing analytics queue', { queueSize });
      await flushQueue(pool);
    }
  }, FLUSH_INTERVAL);

  logger.debug('Analytics queue auto-flush started', {
    intervalMinutes: 5,
    maxQueueSize: MAX_QUEUE_SIZE
  });

  return intervalHandle;
}

/**
 * Stop automatic queue flushing
 * @param {NodeJS.Timeout} intervalHandle - Interval handle from startAutoFlush
 */
export function stopAutoFlush(intervalHandle) {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    logger.info('Analytics queue auto-flush stopped');
  }
}

