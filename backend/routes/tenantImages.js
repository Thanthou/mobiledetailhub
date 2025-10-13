const express = require('express');
// TODO: Add file system operations when implementing image management
// const fs = require('fs');
// const path = require('path');
const { pool } = require('../database/pool');
const router = express.Router();

// Get list of tenant-specific images
router.get('/images', async (req, res) => {
  try {
    const { tenant } = req.query;
    
    if (!tenant) {
      return res.status(400).json({ error: 'Tenant parameter is required' });
    }
    
    // Query database for tenant images
    const result = await pool.query(
      'SELECT file_path, filename, image_category FROM tenants.tenant_images WHERE tenant_slug = $1 AND is_active = true ORDER BY uploaded_at DESC',
      [tenant]
    );
    
    // Convert database paths to URLs
    const imageUrls = result.rows.map(row => ({
      url: row.file_path,
      filename: row.filename,
      category: row.image_category
    }));
    
    res.json(imageUrls);
  } catch (error) {
    console.error('Error reading tenant images:', error);
    res.status(500).json({ error: 'Failed to read tenant images' });
  }
});

// Upload new tenant image
router.post('/upload', (req, res) => {
  try {
    const { tenant, category: _category = 'gallery' } = req.body;
    
    if (!tenant) {
      return res.status(400).json({ error: 'Tenant parameter is required' });
    }
    
    // TODO: Add file upload handling with multer
    // TODO: Add billing/plan checks
    // TODO: Save file to tenant-specific directory
    // TODO: Insert record into database
    
    res.json({ message: 'Upload endpoint ready - implementation pending' });
  } catch (error) {
    console.error('Error uploading tenant image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
