const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Get list of stock images
router.get('/images', (req, res) => {
  try {
    // Read from the frontend public stock folder
    const stockPath = path.join(__dirname, '../../frontend/public/images/stock');
    
    // Check if stock directory exists
    if (!fs.existsSync(stockPath)) {
      return res.json([]);
    }
    
    // Read directory contents
    const files = fs.readdirSync(stockPath);
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.PNG', '.JPG', '.JPEG', '.gif', '.GIF', '.webp', '.WEBP'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file);
      return imageExtensions.includes(ext);
    });
    
    // Convert to URLs (frontend will serve these from public folder)
    const imageUrls = imageFiles.map(file => `/images/stock/${file}`);
    
    res.json(imageUrls);
  } catch (error) {
    console.error('Error reading stock images directory:', error);
    res.status(500).json({ error: 'Failed to read stock images' });
  }
});

module.exports = router;
