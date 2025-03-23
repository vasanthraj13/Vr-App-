const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  settings: {
    scale: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      enum: ['meters', 'feet'],
      default: 'meters'
    }
  }
});

module.exports = mongoose.model('Project', projectSchema);