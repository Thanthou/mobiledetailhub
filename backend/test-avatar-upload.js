const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Test multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, 'uploads/avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    console.log('Destination:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const filename = `test_${Date.now()}.${file.originalname.split('.').pop()}`;
    console.log('Filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter - mimetype:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

console.log('Multer configuration test:');
console.log('Storage:', storage);
console.log('Upload middleware:', upload);

// Test directory creation
const uploadsDir = path.join(__dirname, 'uploads/avatars');
console.log('Uploads directory:', uploadsDir);
console.log('Directory exists:', fs.existsSync(uploadsDir));

if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Directory created successfully');
  } catch (error) {
    console.error('❌ Failed to create directory:', error);
  }
} else {
  console.log('✅ Directory already exists');
}

// Test file writing
const testFile = path.join(uploadsDir, 'test.txt');
try {
  fs.writeFileSync(testFile, 'test content');
  console.log('✅ File writing test successful');
  fs.unlinkSync(testFile); // Clean up
} catch (error) {
  console.error('❌ File writing test failed:', error);
}
