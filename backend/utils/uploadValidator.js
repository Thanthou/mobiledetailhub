const logger = require('./logger');

// Enhanced upload validation configuration
const UPLOAD_CONFIG = {
  // File size limits
  maxFileSize: 5 * 1024 * 1024, // 5MB per file
  maxTotalSize: 25 * 1024 * 1024, // 25MB total per request
  maxFiles: 5, // Maximum number of files per request
  
  // Allowed MIME types (whitelist approach)
  allowedMimeTypes: {
    images: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ]
  },
  
  // Allowed file extensions
  allowedExtensions: {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    documents: ['.pdf', '.doc', '.docx', '.txt', '.csv']
  },
  
  // Blocked MIME types (blacklist for security)
  blockedMimeTypes: [
    // Executables
    'application/x-executable',
    'application/x-msdownload',
    'application/x-msi',
    'application/vnd.microsoft.portable-executable',
    'application/x-dosexec',
    'application/x-msdos-program',
    // Archives (potential for zip bombs)
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    // Scripts
    'text/x-python',
    'text/x-javascript',
    'text/x-php',
    'text/x-shellscript',
    'application/x-shockwave-flash',
    // Other dangerous types
    'application/x-bat',
    'application/x-com',
    'application/x-exe'
  ],
  
  // Blocked file extensions
  blockedExtensions: [
    '.exe', '.bat', '.com', '.cmd', '.pif', '.scr',
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
    '.py', '.js', '.php', '.sh', '.ps1', '.vbs',
    '.dll', '.so', '.dylib', '.jar', '.war'
  ]
};

/**
 * Enhanced file validation with security checks
 * @param {Object} file - File object from multer
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with proper error codes
 */
function validateFile(file, options = {}) {
  const config = { ...UPLOAD_CONFIG, ...options };
  const errors = [];
  const warnings = [];

  try {
    if (!file) {
      errors.push({ message: 'No file provided', code: 400 });
      return { success: false, errors, warnings, statusCode: 400 };
    }

    // Check file size
    if (file.size > config.maxFileSize) {
      errors.push({ 
        message: `File size ${Math.round(file.size / 1024)}KB exceeds maximum allowed size of ${Math.round(config.maxFileSize / 1024)}KB`, 
        code: 413 
      });
    }

    // Check MIME type against blocked list first (security)
    const mimeType = file.mimetype;
    if (config.blockedMimeTypes.includes(mimeType)) {
      errors.push({ 
        message: `File type ${mimeType} is blocked for security reasons`, 
        code: 415 
      });
      return { success: false, errors, warnings, statusCode: 415 };
    }

    // Check MIME type against allowed list
    const isAllowedMimeType = Object.values(config.allowedMimeTypes)
      .flat()
      .includes(mimeType);

    if (!isAllowedMimeType) {
      errors.push({ 
        message: `File type ${mimeType} is not allowed`, 
        code: 415 
      });
      return { success: false, errors, warnings, statusCode: 415 };
    }

    // Check file extension against blocked list
    if (file.originalname) {
      const extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      
      if (config.blockedExtensions.includes(extension)) {
        errors.push({ 
          message: `File extension ${extension} is blocked for security reasons`, 
          code: 415 
        });
        return { success: false, errors, warnings, statusCode: 415 };
      }

      // Check extension against allowed list
      const isAllowedExtension = Object.values(config.allowedExtensions)
        .flat()
        .includes(extension);

      if (!isAllowedExtension) {
        warnings.push(`File extension ${extension} may not be supported`);
      }
    }

    // Log file validation
    logger.info('File validation', {
      filename: file.originalname,
      mimeType: file.mimetype,
      size: `${Math.round(file.size / 1024)}KB`,
      validationResult: errors.length === 0 ? 'passed' : 'failed'
    });

    const statusCode = errors.length > 0 ? Math.max(...errors.map(e => e.code)) : 200;
    return { success: errors.length === 0, errors, warnings, statusCode };

  } catch (error) {
    logger.error('File validation error:', { error: error.message });
    errors.push({ message: 'File validation failed', code: 500 });
    return { success: false, errors, warnings, statusCode: 500 };
  }
}

/**
 * Validate multiple files with enhanced security
 * @param {Array} files - Array of file objects
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateFiles(files, options = {}) {
  const config = { ...UPLOAD_CONFIG, ...options };
  const errors = [];
  const warnings = [];
  let totalSize = 0;

  try {
    if (!files || files.length === 0) {
      errors.push({ message: 'No files provided', code: 400 });
      return { success: false, errors, warnings, statusCode: 400 };
    }

    // Check file count
    if (files.length > config.maxFiles) {
      errors.push({ 
        message: `Too many files. Maximum allowed: ${config.maxFiles}`, 
        code: 413 
      });
      return { success: false, errors, warnings, statusCode: 413 };
    }

    // Validate each file
    for (const file of files) {
      const fileValidation = validateFile(file, options);
      if (!fileValidation.success) {
        errors.push(...fileValidation.errors);
        warnings.push(...fileValidation.warnings);
      }
      totalSize += file.size || 0;
    }

    // Check total size
    if (totalSize > config.maxTotalSize) {
      errors.push({ 
        message: `Total file size ${Math.round(totalSize / 1024)}KB exceeds maximum allowed size of ${Math.round(config.maxTotalSize / 1024)}KB`, 
        code: 413 
      });
    }

    const statusCode = errors.length > 0 ? Math.max(...errors.map(e => e.code)) : 200;
    return { success: errors.length === 0, errors, warnings, statusCode };

  } catch (error) {
    logger.error('Files validation error:', { error: error.message });
    errors.push({ message: 'Files validation failed', code: 500 });
    return { success: false, errors, warnings, statusCode: 500 };
  }
}

/**
 * Enhanced upload request validation
 * @param {Object} req - Express request object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateUploadRequest(req, options = {}) {
  const config = { ...UPLOAD_CONFIG, ...options };
  const errors = [];
  const warnings = [];

  try {
    // Check if multipart/form-data
    const contentType = req.headers['content-type'] || '';
    if (!contentType.startsWith('multipart/form-data')) {
      errors.push({ message: 'Request must be multipart/form-data for file uploads', code: 400 });
      return { success: false, errors, warnings, statusCode: 400 };
    }

    // Validate boundary parameter
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      errors.push({ message: 'Boundary parameter is required for multipart form data', code: 400 });
      return { success: false, errors, warnings, statusCode: 400 };
    }

    // Check content length
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > config.maxTotalSize) {
      errors.push({ 
        message: `Total request size exceeds maximum allowed size of ${Math.round(config.maxTotalSize / 1024 / 1024)}MB`, 
        code: 413 
      });
    }

    // Log validation attempt
    logger.info('Upload request validation', {
      contentType,
      contentLength: `${Math.round(contentLength / 1024)}KB`,
      boundary: boundary ? 'present' : 'missing'
    });

    const statusCode = errors.length > 0 ? Math.max(...errors.map(e => e.code)) : 200;
    return { success: errors.length === 0, errors, warnings, statusCode };

  } catch (error) {
    logger.error('Upload validation error:', { error: error.message });
    errors.push({ message: 'Upload validation failed', code: 500 });
    return { success: false, errors, warnings, statusCode: 500 };
  }
}

/**
 * Get allowed MIME types for a specific category
 * @param {string} category - File category (images, documents, etc.)
 * @returns {Array} Array of allowed MIME types
 */
function getAllowedMimeTypes(category = null) {
  if (category && UPLOAD_CONFIG.allowedMimeTypes[category]) {
    return UPLOAD_CONFIG.allowedMimeTypes[category];
  }
  return Object.values(UPLOAD_CONFIG.allowedMimeTypes).flat();
}

/**
 * Get allowed file extensions for a specific category
 * @param {string} category - File category
 * @returns {Array} Array of allowed extensions
 */
function getAllowedExtensions(category = null) {
  if (category && UPLOAD_CONFIG.allowedExtensions[category]) {
    return UPLOAD_CONFIG.allowedExtensions[category];
  }
  return Object.values(UPLOAD_CONFIG.allowedExtensions).flat();
}

/**
 * Create multer configuration with validation
 * @param {Object} options - Configuration options
 * @returns {Object} Multer configuration object
 */
function createMulterConfig(options = {}) {
  const config = { ...UPLOAD_CONFIG, ...options };
  
  return {
    limits: {
      fileSize: config.maxFileSize,
      files: config.maxFiles,
      fieldSize: 1024 * 1024, // 1MB for text fields
      fieldNameSize: 100,
      fieldValueSize: 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      const validation = validateFile(file, options);
      if (validation.success) {
        cb(null, true);
      } else {
        const error = new Error(validation.errors[0]?.message || 'File validation failed');
        error.statusCode = validation.statusCode;
        cb(error, false);
      }
    }
  };
}

module.exports = {
  validateUploadRequest,
  validateFile,
  validateFiles,
  getAllowedMimeTypes,
  getAllowedExtensions,
  createMulterConfig,
  UPLOAD_CONFIG
};
