# Upload Guardrails Implementation

## Overview
This document describes the comprehensive upload guardrails implemented to protect against malicious file uploads and ensure secure file handling.

## Security Features

### 1. MIME Type Allowlisting
- **Whitelist approach**: Only predefined MIME types are allowed
- **Categories**: Images (JPEG, PNG, GIF, WebP, SVG) and Documents (PDF, DOC, DOCX, TXT, CSV)
- **Rejection**: Returns 415 (Unsupported Media Type) for non-allowed types

### 2. File Extension Validation
- **Allowed extensions**: Matches MIME type categories
- **Blocked extensions**: Executables (.exe, .bat, .com), archives (.zip, .rar, .7z), scripts (.py, .js, .php)
- **Security**: Prevents file type spoofing attacks

### 3. File Size Limits
- **Per file**: 5MB maximum (configurable)
- **Total request**: 25MB maximum (configurable)
- **Rejection**: Returns 413 (Request Entity Too Large) for oversized files

### 4. File Count Limits
- **Maximum files**: 5 per request (configurable)
- **Rejection**: Returns 413 for excessive file counts

### 5. Blocked File Types
- **Executables**: All common executable formats
- **Archives**: ZIP, RAR, 7Z, TAR, GZ (prevents zip bombs)
- **Scripts**: Python, JavaScript, PHP, Shell scripts
- **Rejection**: Returns 415 for blocked types

## Implementation Details

### Files Created/Modified

#### 1. `backend/utils/uploadValidator.js`
- Enhanced validation configuration
- Security-focused validation functions
- Proper error codes (400, 413, 415, 500)

#### 2. `backend/middleware/upload.js`
- Multer integration with validation
- Multiple upload strategies (single, multiple, memory)
- Post-processing validation

#### 3. `backend/routes/upload.js`
- Sample upload endpoints
- Demonstrates validation usage
- Proper error handling

#### 4. `backend/middleware/errorHandler.js`
- Enhanced error handling for upload validation
- Proper HTTP status codes
- User-friendly error messages

#### 5. `backend/server.js`
- Upload routes integration
- Rate limiting for upload endpoints

### Configuration Options

```javascript
const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024,        // 5MB per file
  maxTotalSize: 25 * 1024 * 1024,      // 25MB total
  maxFiles: 5,                          // Max files per request
  
  allowedMimeTypes: {
    images: ['image/jpeg', 'image/png', ...],
    documents: ['application/pdf', ...]
  },
  
  blockedMimeTypes: [
    'application/x-executable',          // Executables
    'application/zip',                   // Archives
    'text/x-python',                    // Scripts
    // ... more blocked types
  ]
};
```

## Usage Examples

### Single File Upload
```javascript
const { singleFileUpload } = require('../middleware/upload');

router.post('/upload', 
  singleFileUpload('file', {
    maxFileSize: 2 * 1024 * 1024,      // 2MB limit
    allowedMimeTypes: { images: ['image/jpeg', 'image/png'] }
  }),
  (req, res) => {
    // Handle uploaded file
  }
);
```

### Multiple Files Upload
```javascript
const { multipleFilesUpload } = require('../middleware/upload');

router.post('/upload-multiple',
  multipleFilesUpload('files', {
    maxFiles: 3,
    maxFileSize: 1 * 1024 * 1024
  }),
  (req, res) => {
    // Handle uploaded files
  }
);
```

### Memory Upload (No Disk Storage)
```javascript
const { memoryUpload } = require('../middleware/upload');

router.post('/process',
  memoryUpload('file', {
    maxFileSize: 512 * 1024             // 512KB for memory processing
  }),
  (req, res) => {
    // Process file from memory (req.file.buffer)
  }
);
```

## Error Responses

### 400 Bad Request
- Missing file
- Invalid multipart/form-data
- Missing boundary parameter

### 413 Request Entity Too Large
- File size exceeds limit
- Total request size exceeds limit
- Too many files

### 415 Unsupported Media Type
- Blocked MIME type
- Non-allowed MIME type
- Blocked file extension

### 500 Internal Server Error
- Validation processing error
- File system error

## Testing

Run the test script to verify functionality:
```bash
cd backend
node scripts/test_upload_validation.js
```

The test script validates:
- Configuration retrieval
- Invalid file type rejection (415)
- File size limit enforcement (413)
- Valid file upload acceptance (200)

## Security Benefits

1. **Prevents malicious uploads**: Blocks executables, scripts, and archives
2. **Size limits**: Prevents DoS attacks via large files
3. **Type validation**: Ensures only safe file types are processed
4. **Proper error codes**: Clear feedback for security violations
5. **Logging**: Comprehensive audit trail of upload attempts
6. **Rate limiting**: Prevents upload spam

## Future Enhancements

- Virus scanning integration
- Image metadata validation
- Content-based file analysis
- Cloud storage integration
- File compression and optimization
- Backup and recovery procedures

## Dependencies

- `multer`: File upload handling
- `express`: Web framework
- Built-in Node.js modules: `path`, `fs`

## Installation

```bash
cd backend
npm install multer
```

The enhanced upload validation is now ready to use with comprehensive security guardrails.
