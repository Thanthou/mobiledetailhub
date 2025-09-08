const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Simple multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, 'uploads/avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const filename = `test_${Date.now()}.${file.originalname.split('.').pop()}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Simple avatar upload endpoint
app.post('/test-avatar-upload', upload.single('avatar'), (req, res) => {
  console.log('=== AVATAR UPLOAD TEST ===');
  console.log('File:', req.file);
  console.log('Body:', req.body);
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test with: curl -X POST -F "avatar=@path/to/image.jpg" http://localhost:${PORT}/test-avatar-upload`);
});
