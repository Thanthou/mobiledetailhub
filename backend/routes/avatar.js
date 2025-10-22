/**
 * @fileoverview API routes for avatar
 * @version 1.0.0
 * @author That Smart Site
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const router = express.Router();
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generateAvatarFilename, ensureUploadsDir, findCustomAvatar } from '../utils/avatarUtils.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateFileMagic } from '../utils/uploadValidator.js';
import { logger } from '../config/logger.js';
import { getPool } from '../database/pool.js';
// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    // Generate a simple filename since req.body isn't available yet
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const filename = `avatar_${timestamp}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Test avatar upload (no auth required for testing)
router.post('/test-upload', upload.single('avatar'), asyncHandler(async (req, res) => {
  logger.debug('Avatar test upload called', { 
    userId: req.user?.userId,
    ip: req.ip
  });

  if (!req.file) {
    logger.warn('Avatar test upload failed - no file provided', { 
      userId: req.user?.userId,
      ip: req.ip
    });
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Magic number validation for avatar uploads
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const magicValidation = await validateFileMagic(req.file, allowedImageTypes);
  if (!magicValidation.success) {
    // Delete the uploaded file if validation fails
    fs.unlinkSync(req.file.path);
    return res.status(magicValidation.statusCode).json({
      success: false,
      message: magicValidation.errors[0]?.message || 'File validation failed'
    });
  }

  const { reviewerName, reviewId } = req.body;
  
  if (!reviewerName || !reviewId) {
    // Delete the uploaded file if validation fails
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      success: false,
      message: 'reviewerName and reviewId are required'
    });
  }

  // Generate proper filename and rename the file
  const extension = path.extname(req.file.originalname || '').toLowerCase() || '.jpg';
  const properFilename = generateAvatarFilename(reviewerName, reviewId, extension);
  const properPath = path.join('uploads/avatars', properFilename);
  
  try {
    // Rename the file to the proper name
    fs.renameSync(req.file.path, properPath);
    
    const avatarUrl = `/uploads/avatars/${properFilename}`;

    res.json({
      success: true,
      message: 'Avatar uploaded successfully (TEST MODE)',
      avatarUrl: avatarUrl,
      filename: properFilename
    });
  } catch (renameError) {
    // If rename fails, delete the original file and return error
    fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Error renaming uploaded file',
      error: renameError.message
    });
  }
}));

// Upload avatar for a specific review
router.post('/upload', authenticateToken, requireAdmin, upload.single('avatar'), asyncHandler(async (req, res) => {
  logger.debug('Avatar upload called', { 
    userId: req.user?.userId,
    email: req.user?.email,
    ip: req.ip
  });

  if (!req.file) {
    logger.warn('Avatar upload failed - no file provided', { 
      userId: req.user?.userId,
      ip: req.ip
    });
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Magic number validation for avatar uploads
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const magicValidation = await validateFileMagic(req.file, allowedImageTypes);
  if (!magicValidation.success) {
    // Delete the uploaded file if validation fails
    fs.unlinkSync(req.file.path);
    return res.status(magicValidation.statusCode).json({
      success: false,
      message: magicValidation.errors[0]?.message || 'File validation failed'
    });
  }

  const { reviewerName, reviewId } = req.body;
  
  if (!reviewerName || !reviewId) {
    // Delete the uploaded file if validation fails
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      success: false,
      message: 'reviewerName and reviewId are required'
    });
  }

  // Generate proper filename and rename the file
  const extension = path.extname(req.file.originalname || '').toLowerCase() || '.jpg';
  const properFilename = generateAvatarFilename(reviewerName, reviewId, extension);
  const properPath = path.join('uploads/avatars', properFilename);
  
  try {
    // Rename the file to the proper name
    fs.renameSync(req.file.path, properPath);
    
    const avatarUrl = `/uploads/avatars/${properFilename}`;

    // Update the review record with the new avatar URL
    try {
      const pool = await getPool();
      await pool.query(
        'UPDATE reputation.reviews SET reviewer_avatar_url = $1 WHERE id = $2',
        [avatarUrl, parseInt(reviewId)]
      );
      logger.info(`Updated review ${reviewId} with avatar URL: ${avatarUrl}`);
    } catch (dbError) {
      logger.error('Failed to update review with avatar URL:', dbError);
      // Don't fail the upload if database update fails, but log the error
    }

    // Log the avatar upload
    logger.audit('UPLOAD_AVATAR', 'reviews', {
      reviewerName,
      reviewId: parseInt(reviewId),
      filename: properFilename,
      originalName: req.file.originalname,
      size: req.file.size,
      avatarUrl: avatarUrl
    }, null, {
      userId: req.user.userId,
      email: req.user.email
    });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl,
      filename: properFilename
    });
  } catch (renameError) {
    // If rename fails, delete the original file and return error
    fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Error renaming uploaded file',
      error: renameError.message
    });
  }
}));

// Get avatar info for a review
router.get('/info/:reviewId', authenticateToken, requireAdmin, asyncHandler((req, res) => {
  const { reviewId } = req.params;
  const { reviewerName } = req.query;
  
  if (!reviewerName) {
    return res.status(400).json({
      success: false,
      message: 'reviewerName query parameter is required'
    });
  }

  const customAvatar = findCustomAvatar(reviewerName, parseInt(reviewId));
  
  res.json({
    success: true,
    hasCustomAvatar: !!customAvatar,
    avatarUrl: customAvatar,
    reviewId: parseInt(reviewId),
    reviewerName
  });
}));

// Delete avatar for a review
router.delete('/:reviewId', authenticateToken, requireAdmin, asyncHandler((req, res) => {
  const { reviewId } = req.params;
  const { reviewerName } = req.query;
  
  if (!reviewerName) {
    return res.status(400).json({
      success: false,
      message: 'reviewerName query parameter is required'
    });
  }

  const customAvatar = findCustomAvatar(reviewerName, parseInt(reviewId));
  
  if (!customAvatar) {
    return res.status(404).json({
      success: false,
      message: 'No custom avatar found for this review'
    });
  }

  // Extract filename from URL
  const filename = path.basename(customAvatar);
  const filePath = path.join(__dirname, '../uploads/avatars', filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      // Log the avatar deletion
      logger.audit('DELETE_AVATAR', 'reviews', {
        reviewerName,
        reviewId: parseInt(reviewId),
        filename: filename
      }, null, {
        userId: req.user.userId,
        email: req.user.email
      });
      
      res.json({
        success: true,
        message: 'Avatar deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Avatar file not found'
      });
    }
  } catch (error) {
    logger.error('Error deleting avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting avatar file'
    });
  }
}));

export default router;
