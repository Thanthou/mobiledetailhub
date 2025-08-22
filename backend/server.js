require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import route modules
const healthRoutes = require('./routes/health');
const serviceAreasRoutes = require('./routes/serviceAreas');
const authRoutes = require('./routes/auth');
const affiliatesRoutes = require('./routes/affiliates');
const mdhConfigRoutes = require('./routes/mdhConfig');
const clientsRoutes = require('./routes/clients');
const adminRoutes = require('./routes/admin');

// Import database utilities
const { setupDatabase } = require('./utils/databaseInit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/service_areas', serviceAreasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/affiliates', affiliatesRoutes);
app.use('/api/mdh-config', mdhConfigRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/admin', adminRoutes);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Setup database and initialize sample data
  try {
    await setupDatabase();
  } catch (err) {
    console.error('Failed to setup database:', err);
  }
});