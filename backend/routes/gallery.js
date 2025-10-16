import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get list of gallery images
router.get('/images', (req, res) => {
  try {
    // Read from the frontend public folder
    const galleryPath = path.join(__dirname, '../../frontend/public/images/gallery');
    
    // Check if gallery directory exists
    if (!fs.existsSync(galleryPath)) {
      return res.json([]);
    }
    
    // Read directory contents
    const files = fs.readdirSync(galleryPath);
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.PNG', '.JPG', '.JPEG', '.gif', '.GIF', '.webp', '.WEBP'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file);
      return imageExtensions.includes(ext);
    });
    
    // Convert to URLs (frontend will serve these from public folder)
    const imageUrls = imageFiles.map(file => `/images/gallery/${file}`);
    
    res.json(imageUrls);
  } catch (error) {
    console.error('Error reading gallery directory:', error);
    res.status(500).json({ error: 'Failed to read gallery images' });
  }
});

export default router;
