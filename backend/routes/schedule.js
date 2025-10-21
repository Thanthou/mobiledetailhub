/**
 * @fileoverview API routes for schedule
 * @version 1.0.0
 * @author That Smart Site
 */

import express from 'express';
import { getPool } from '../database/pool.js';
import { createModuleLogger } from '../config/logger.js';
import { authenticateToken } from '../middleware/auth.js';
import { withTenantByUser } from '../middleware/withTenant.js';
import { validateBody } from '../middleware/validation.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
// import {  asyncHandler  } from '../middleware/errorHandler';; // Unused import
// TODO: Add request logging middleware when needed
// import {  requestLogger  } from '../middleware/requestLogger';;

const router = express.Router();
const logger = createModuleLogger('routeName');


// Apply middleware
// router.use(requestLogger); // Temporarily disabled due to env validation issues
router.use(apiLimiter);
router.use(authenticateToken);
router.use(withTenantByUser);

// Validation schemas
const appointmentSchema = {
  body: {
    type: 'object',
    required: ['title', 'service_type', 'service_duration', 'start_time', 'end_time', 'customer_name', 'customer_phone'],
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', maxLength: 1000 },
      service_type: { type: 'string', minLength: 1, maxLength: 100 },
      service_duration: { type: 'integer', minimum: 1 },
      start_time: { type: 'string', format: 'date-time' },
      end_time: { type: 'string', format: 'date-time' },
      customer_name: { type: 'string', minLength: 1, maxLength: 255 },
      customer_phone: { type: 'string', minLength: 1, maxLength: 20 },
      customer_email: { type: 'string', format: 'email', maxLength: 255 },
      price: { type: 'number', minimum: 0 },
      deposit: { type: 'number', minimum: 0 },
      notes: { type: 'string', maxLength: 1000 },
      internal_notes: { type: 'string', maxLength: 1000 }
    }
  }
};

const timeBlockSchema = {
  body: {
    type: 'object',
    required: ['title', 'block_type', 'start_time', 'end_time'],
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', maxLength: 1000 },
      block_type: { type: 'string', enum: ['unavailable', 'break', 'maintenance', 'personal', 'other'] },
      start_time: { type: 'string', format: 'date-time' },
      end_time: { type: 'string', format: 'date-time' },
      is_recurring: { type: 'boolean' },
      recurrence_pattern: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
      recurrence_end_date: { type: 'string', format: 'date-time' }
    }
  }
};

// APPOINTMENTS ROUTES

// Get appointments for a date range
router.get('/appointments', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const tenantId = req.tenant.id;

    const query = `
      SELECT * FROM schedule.appointments 
      WHERE tenant_id = $1 
        AND start_time >= $2 
        AND end_time <= $3
      ORDER BY start_time ASC
    `;

    const result = await pool.query(query, [tenantId, startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching appointments:', error);
    if (error.message === 'No tenant business found for this user') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointments for a specific date
router.get('/appointments/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const tenantId = req.user.tenant_id;

    const query = `
      SELECT * FROM schedule.appointments 
      WHERE tenant_id = $1 
        AND DATE(start_time) = $2
      ORDER BY start_time ASC
    `;

    const result = await pool.query(query, [tenantId, date]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching appointments for date:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get single appointment
router.get('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenant_id;

    const query = `
      SELECT * FROM schedule.appointments 
      WHERE id = $1 AND tenant_id = $2
    `;

    const result = await pool.query(query, [id, tenantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Create appointment
router.post('/appointments', validateBody(appointmentSchema.body), async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;
    const {
      title, description, service_type, service_duration,
      start_time, end_time, customer_name, customer_phone,
      customer_email, price, deposit, notes, internal_notes
    } = req.body;

    // Validate time constraints
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    
    if (endTime <= startTime) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Check for conflicts
    const conflictQuery = `
      SELECT id FROM schedule.appointments 
      WHERE tenant_id = $1 
        AND (
          (start_time < $2 AND end_time > $2) OR
          (start_time < $3 AND end_time > $3) OR
          (start_time >= $2 AND end_time <= $3)
        )
    `;

    const conflictResult = await pool.query(conflictQuery, [tenantId, start_time, end_time]);
    
    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ error: 'Time slot conflicts with existing appointment' });
    }

    const query = `
      INSERT INTO schedule.appointments (
        tenant_id, title, description, service_type, service_duration,
        start_time, end_time, customer_name, customer_phone, customer_email,
        price, deposit, notes, internal_notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const result = await pool.query(query, [
      tenantId, title, description, service_type, service_duration,
      start_time, end_time, customer_name, customer_phone, customer_email,
      price, deposit, notes, internal_notes, userId
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment
router.put('/appointments/:id', validateBody(appointmentSchema.body), async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;
    const updateData = req.body;

    // Check if appointment exists and belongs to tenant
    const checkQuery = `
      SELECT id FROM schedule.appointments 
      WHERE id = $1 AND tenant_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, tenantId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push(`updated_by = $${paramCount}`);
    values.push(userId);
    paramCount++;

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, tenantId);

    const query = `
      UPDATE schedule.appointments 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Update appointment status
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;

    const validStatuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const query = `
      UPDATE schedule.appointments 
      SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND tenant_id = $4
      RETURNING *
    `;

    const result = await pool.query(query, [status, userId, id, tenantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

// Delete appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenant_id;

    const query = `
      DELETE FROM schedule.appointments 
      WHERE id = $1 AND tenant_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [id, tenantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Get available time slots
router.get('/appointments/available-slots', async (req, res) => {
  try {
    const { date, duration = 60 } = req.query;
    const tenantId = req.user.tenant_id;

    if (!date) {
      return res.status(400).json({ error: 'date is required' });
    }

    // Get schedule settings for this tenant
    const settingsQuery = `
      SELECT * FROM schedule.schedule_settings 
      WHERE tenant_id = $1
    `;
    
    const settingsResult = await pool.query(settingsQuery, [tenantId]);
    const settings = settingsResult.rows[0];

    if (!settings) {
      return res.status(404).json({ error: 'Schedule settings not found' });
    }

    // Get existing appointments and time blocks for the date
    const conflictsQuery = `
      SELECT start_time, end_time FROM schedule.appointments 
      WHERE tenant_id = $1 AND DATE(start_time) = $2
      UNION ALL
      SELECT start_time, end_time FROM schedule.time_blocks 
      WHERE tenant_id = $1 AND DATE(start_time) = $2
      ORDER BY start_time
    `;

    const conflictsResult = await pool.query(conflictsQuery, [tenantId, date]);
    const conflicts = conflictsResult.rows;

    // Generate available time slots based on business hours and settings
    const availableSlots = [];
    const businessHours = settings.business_hours;
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = businessHours[dayOfWeek];

    if (!dayHours || !dayHours.enabled) {
      return res.json([]);
    }

    const startTime = new Date(`${date}T${dayHours.start}:00`);
    const endTime = new Date(`${date}T${dayHours.end}:00`);
    const interval = settings.time_slot_interval * 60 * 1000; // Convert to milliseconds
    const appointmentDuration = duration * 60 * 1000;

    for (let time = startTime.getTime(); time + appointmentDuration <= endTime.getTime(); time += interval) {
      const slotStart = new Date(time);
      const slotEnd = new Date(time + appointmentDuration);
      
      // Check if this slot conflicts with existing appointments/blocks
      const hasConflict = conflicts.some(conflict => {
        const conflictStart = new Date(conflict.start_time);
        const conflictEnd = new Date(conflict.end_time);
        return (slotStart < conflictEnd && slotEnd > conflictStart);
      });

      if (!hasConflict) {
        availableSlots.push(slotStart.toTimeString().slice(0, 5));
      }
    }

    res.json(availableSlots);
  } catch (error) {
    logger.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
});

// TIME BLOCKS ROUTES

// Get time blocks for a date range
router.get('/time-blocks', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const tenantId = req.tenant.id;

    const query = `
      SELECT * FROM schedule.time_blocks 
      WHERE tenant_id = $1 
        AND start_time >= $2 
        AND end_time <= $3
      ORDER BY start_time ASC
    `;

    const result = await pool.query(query, [tenantId, startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching time blocks:', error);
    if (error.message === 'No tenant business found for this user') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch time blocks' });
  }
});

// Get time blocks for a specific date
router.get('/time-blocks/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const tenantId = req.user.tenant_id;

    const query = `
      SELECT * FROM schedule.time_blocks 
      WHERE tenant_id = $1 
        AND DATE(start_time) = $2
      ORDER BY start_time ASC
    `;

    const result = await pool.query(query, [tenantId, date]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching time blocks for date:', error);
    res.status(500).json({ error: 'Failed to fetch time blocks' });
  }
});

// Create time block
router.post('/time-blocks', validateBody(timeBlockSchema.body), async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;
    const {
      title, description, block_type, start_time, end_time,
      is_recurring, recurrence_pattern, recurrence_end_date
    } = req.body;

    // Validate time constraints
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    
    if (endTime <= startTime) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const query = `
      INSERT INTO schedule.time_blocks (
        tenant_id, title, description, block_type,
        start_time, end_time, is_recurring, recurrence_pattern,
        recurrence_end_date, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await pool.query(query, [
      tenantId, title, description, block_type,
      start_time, end_time, is_recurring, recurrence_pattern,
      recurrence_end_date, userId
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating time block:', error);
    res.status(500).json({ error: 'Failed to create time block' });
  }
});

// Update time block
router.put('/time-blocks/:id', validateBody(timeBlockSchema.body), async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenant_id;
    const updateData = req.body;

    // Check if time block exists and belongs to tenant
    const checkQuery = `
      SELECT id FROM schedule.time_blocks 
      WHERE id = $1 AND tenant_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, tenantId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Time block not found' });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, tenantId);

    const query = `
      UPDATE schedule.time_blocks 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating time block:', error);
    res.status(500).json({ error: 'Failed to update time block' });
  }
});

// Delete time block
router.delete('/time-blocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenant_id;

    const query = `
      DELETE FROM schedule.time_blocks 
      WHERE id = $1 AND tenant_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [id, tenantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Time block not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting time block:', error);
    res.status(500).json({ error: 'Failed to delete time block' });
  }
});

// BLOCKED DAYS ROUTES

// Get blocked days for a date range
router.get('/blocked-days', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const tenantId = req.tenant.id;

    const query = `
      SELECT blocked_date, reason, is_recurring, recurrence_pattern, recurrence_end_date
      FROM schedule.blocked_days 
      WHERE tenant_id = $1 
        AND blocked_date >= $2 
        AND blocked_date <= $3
      ORDER BY blocked_date ASC
    `;

    const result = await pool.query(query, [tenantId, startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching blocked days:', error);
    if (error.message === 'No tenant business found for this user') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch blocked days' });
  }
});

// Toggle blocked day (add if not exists, remove if exists)
router.post('/blocked-days/toggle', async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'date is required' });
    }

    const tenantId = req.tenant.id;
    const userId = req.user.id;

    // Check if date is already blocked
    const checkQuery = `
      SELECT id FROM schedule.blocked_days 
      WHERE tenant_id = $1 AND blocked_date = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [tenantId, date]);
    
    if (checkResult.rows.length > 0) {
      // Remove blocked day
      const deleteQuery = `
        DELETE FROM schedule.blocked_days 
        WHERE tenant_id = $1 AND blocked_date = $2
        RETURNING blocked_date
      `;
      
      const deleteResult = await pool.query(deleteQuery, [tenantId, date]);
      res.json({ 
        action: 'removed', 
        date: deleteResult.rows[0].blocked_date,
        message: 'Day unblocked successfully'
      });
    } else {
      // Add blocked day
      const insertQuery = `
        INSERT INTO schedule.blocked_days (tenant_id, blocked_date, reason, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING blocked_date, reason
      `;
      
      const insertResult = await pool.query(insertQuery, [tenantId, date, reason || 'Blocked', userId]);
      res.json({ 
        action: 'added', 
        date: insertResult.rows[0].blocked_date,
        reason: insertResult.rows[0].reason,
        message: 'Day blocked successfully'
      });
    }
  } catch (error) {
    logger.error('Error toggling blocked day:', error);
    if (error.message === 'No tenant business found for this user') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to toggle blocked day' });
  }
});

// Add blocked day
router.post('/blocked-days', async (req, res) => {
  try {
    const { date, reason, is_recurring, recurrence_pattern, recurrence_end_date } = req.body;
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({ error: 'date is required' });
    }

    // Check if date is already blocked
    const checkQuery = `
      SELECT id FROM schedule.blocked_days 
      WHERE tenant_id = $1 AND blocked_date = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [tenantId, date]);
    if (checkResult.rows.length > 0) {
      return res.status(409).json({ error: 'Date is already blocked' });
    }

    const query = `
      INSERT INTO schedule.blocked_days (
        tenant_id, blocked_date, reason, is_recurring, 
        recurrence_pattern, recurrence_end_date, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      tenantId, date, reason || 'Blocked', is_recurring || false,
      recurrence_pattern, recurrence_end_date, userId
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error adding blocked day:', error);
    res.status(500).json({ error: 'Failed to add blocked day' });
  }
});

// Remove blocked day
router.delete('/blocked-days/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const tenantId = req.user.tenant_id;

    const query = `
      DELETE FROM schedule.blocked_days 
      WHERE tenant_id = $1 AND blocked_date = $2
      RETURNING blocked_date
    `;

    const result = await pool.query(query, [tenantId, date]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blocked day not found' });
    }

    res.json({ 
      message: 'Blocked day removed successfully',
      date: result.rows[0].blocked_date
    });
  } catch (error) {
    logger.error('Error removing blocked day:', error);
    res.status(500).json({ error: 'Failed to remove blocked day' });
  }
});

// SCHEDULE SETTINGS ROUTES

// Get schedule settings
router.get('/settings', async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;

    const query = `
      SELECT * FROM schedule.schedule_settings 
      WHERE tenant_id = $1
    `;

    const result = await pool.query(query, [tenantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule settings not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching schedule settings:', error);
    res.status(500).json({ error: 'Failed to fetch schedule settings' });
  }
});

// Update schedule settings
router.put('/settings', async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;
    const updateData = req.body;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push(`updated_by = $${paramCount}`);
    values.push(userId);
    paramCount++;

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(tenantId);

    const query = `
      UPDATE schedule.schedule_settings 
      SET ${updateFields.join(', ')}
      WHERE tenant_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule settings not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating schedule settings:', error);
    res.status(500).json({ error: 'Failed to update schedule settings' });
  }
});

// Reset schedule settings to defaults
router.post('/settings/reset', async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;

    const query = `
      UPDATE schedule.schedule_settings 
      SET 
        business_hours = '{
          "monday": {"start": "09:00", "end": "17:00", "enabled": true},
          "tuesday": {"start": "09:00", "end": "17:00", "enabled": true},
          "wednesday": {"start": "09:00", "end": "17:00", "enabled": true},
          "thursday": {"start": "09:00", "end": "17:00", "enabled": true},
          "friday": {"start": "09:00", "end": "17:00", "enabled": true},
          "saturday": {"start": "10:00", "end": "15:00", "enabled": true},
          "sunday": {"start": "10:00", "end": "15:00", "enabled": false}
        }',
        default_appointment_duration = 60,
        buffer_time = 15,
        max_appointments_per_day = 20,
        advance_booking_days = 30,
        same_day_booking_allowed = true,
        time_slot_interval = 15,
        earliest_appointment_time = '08:00',
        latest_appointment_time = '18:00',
        send_reminders = true,
        reminder_hours_before = 24,
        send_confirmation_emails = true,
        updated_by = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [userId, tenantId]);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error resetting schedule settings:', error);
    res.status(500).json({ error: 'Failed to reset schedule settings' });
  }
});

module.exports = router;
