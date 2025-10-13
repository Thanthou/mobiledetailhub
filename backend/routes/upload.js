const express = require('express');
const router = express.Router();
const { singleFileUpload, multipleFilesUpload, memoryUpload } = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Single file upload endpoint
 * POST /api/upload/single
 */
router.post('/single', 
  singleFileUpload('file', {
    maxFileSize: 2 * 1024 * 1024, // 2MB for this endpoint
    allowedMimeTypes: {
      images: ['image/jpeg', 'image/png', 'image/gif']
    }
  }),
  asyncHandler((req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    logger.info('File uploaded successfully', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`
      }
    });
  })
);

/**
 * Multiple files upload endpoint
 * POST /api/upload/multiple
 */
router.post('/multiple',
  multipleFilesUpload('files', {
    maxFiles: 3,
    maxFileSize: 1 * 1024 * 1024, // 1MB per file
    allowedMimeTypes: {
      images: ['image/jpeg', 'image/png'],
      documents: ['application/pdf', 'text/plain']
    }
  }),
  asyncHandler((req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select files to upload'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${file.filename}`
    }));

    logger.info('Multiple files uploaded successfully', {
      fileCount: req.files.length,
      totalSize: req.files.reduce((sum, f) => sum + f.size, 0)
    });

    res.status(200).json({
      message: `${req.files.length} files uploaded successfully`,
      files: uploadedFiles
    });
  })
);

/**
 * Memory upload endpoint (for processing without saving)
 * POST /api/upload/memory
 */
router.post('/memory',
  memoryUpload('file', {
    maxFileSize: 512 * 1024, // 512KB for memory processing
    allowedMimeTypes: {
      images: ['image/jpeg', 'image/png']
    }
  }),
  asyncHandler((req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    // File is in memory (req.file.buffer)
    // Process it without saving to disk
    logger.info('File processed in memory', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    res.status(200).json({
      message: 'File processed successfully',
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        inMemory: true
      }
    });
  })
);

/**
 * Get upload configuration info
 * GET /api/upload/config
 */
router.get('/config', (req, res) => {
  const { UPLOAD_CONFIG } = require('../utils/uploadValidator');
  
  res.status(200).json({
    message: 'Upload configuration',
    config: {
      maxFileSize: `${Math.round(UPLOAD_CONFIG.maxFileSize / 1024 / 1024)}MB`,
      maxTotalSize: `${Math.round(UPLOAD_CONFIG.maxTotalSize / 1024 / 1024)}MB`,
      maxFiles: UPLOAD_CONFIG.maxFiles,
      allowedMimeTypes: UPLOAD_CONFIG.allowedMimeTypes,
      allowedExtensions: UPLOAD_CONFIG.allowedExtensions
    }
  });
});

module.exports = router;
