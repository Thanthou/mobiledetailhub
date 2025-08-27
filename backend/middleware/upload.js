const multer = require('multer');
const path = require('path');
const { createMulterConfig, validateFiles } = require('../utils/uploadValidator');
const logger = require('../utils/logger');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // You can customize this based on file type or other criteria
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Memory storage for processing files without saving to disk
const memoryStorage = multer.memoryStorage();

/**
 * Create multer instance with enhanced validation
 * @param {Object} options - Configuration options
 * @param {boolean} useMemory - Whether to use memory storage instead of disk
 * @returns {Object} Configured multer instance
 */
function createUploadMiddleware(options = {}, useMemory = false) {
  const config = createMulterConfig(options);
  const storageType = useMemory ? memoryStorage : storage;
  
  const multerInstance = multer({
    storage: storageType,
    ...config
  });

  // Add post-processing validation
  const postValidation = (req, res, next) => {
    if (req.files && req.files.length > 0) {
      const validation = validateFiles(req.files, options);
      if (!validation.success) {
        const error = new Error(validation.errors[0]?.message || 'File validation failed');
        error.statusCode = validation.statusCode;
        return next(error);
      }
      
      // Add validation info to request
      req.fileValidation = validation;
      logger.info('Files validated successfully', {
        fileCount: req.files.length,
        totalSize: req.files.reduce((sum, f) => sum + f.size, 0)
      });
    }
    next();
  };

  return { multer: multerInstance, postValidation };
}

/**
 * Single file upload middleware
 * @param {string} fieldName - Form field name for the file
 * @param {Object} options - Validation options
 * @returns {Array} Middleware array
 */
function singleFileUpload(fieldName = 'file', options = {}) {
  const { multer: multerInstance, postValidation } = createUploadMiddleware(options);
  return [multerInstance.single(fieldName), postValidation];
}

/**
 * Multiple files upload middleware
 * @param {string} fieldName - Form field name for the files
 * @param {Object} options - Validation options
 * @returns {Array} Middleware array
 */
function multipleFilesUpload(fieldName = 'files', options = {}) {
  const { multer: multerInstance, postValidation } = createUploadMiddleware(options);
  return [multerInstance.array(fieldName), postValidation];
}

/**
 * Fields upload middleware (multiple named fields)
 * @param {Array} fields - Array of field configurations
 * @param {Object} options - Validation options
 * @returns {Array} Middleware array
 */
function fieldsUpload(fields = [], options = {}) {
  const { multer: multerInstance, postValidation } = createUploadMiddleware(options);
  return [multerInstance.fields(fields), postValidation];
}

/**
 * Memory-only upload middleware (for processing without saving)
 * @param {string} fieldName - Form field name
 * @param {Object} options - Validation options
 * @returns {Array} Middleware array
 */
function memoryUpload(fieldName = 'file', options = {}) {
  const { multer: multerInstance, postValidation } = createUploadMiddleware(options, true);
  return [multerInstance.single(fieldName), postValidation];
}

module.exports = {
  createUploadMiddleware,
  singleFileUpload,
  multipleFilesUpload,
  fieldsUpload,
  memoryUpload,
  multer
};
