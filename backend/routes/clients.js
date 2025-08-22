const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Get clients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'clients not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get client field
router.get('/field/:field', async (req, res) => {
  const { field } = req.params;
  const allowedFields = [
    'id', 'user_id', 'address', 'preferences', 'created_at', 'updated_at'
  ];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field' });
  }
  try {
    const result = await pool.query(`SELECT ${field} FROM clients LIMIT 1`);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ [field]: result.rows[0][field] });
  } catch (err) {
    console.error('Error fetching client field:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
