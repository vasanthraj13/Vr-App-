// backend/src/models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dimensions: {
    width: { type: Number, required: true },
    length: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  furniture: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Furniture'
  }]
});

module.exports = mongoose.model('Room', roomSchema);