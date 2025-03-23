// backend/src/config/server.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vr-architecture'
};