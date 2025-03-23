// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./src/config/database');
const { port, env } = require('./src/config/server');
const logger = require('./src/utils/logger');

// Route imports
const projectRoutes = require('./src/routes/projects');
const roomRoutes = require('./src/routes/rooms');
const furnitureRoutes = require('./src/routes/furniture');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/furniture', furnitureRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    stack: env === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server running in ${env} mode on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});