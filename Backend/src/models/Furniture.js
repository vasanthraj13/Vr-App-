// backend/src/models/Furniture.js
const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['sofa', 'chair', 'table', 'bed', 'cabinet', 'light']
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
  },
  rotation: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  scale: {
    x: { type: Number, default: 1 },
    y: { type: Number, default: 1 },
    z: { type: Number, default: 1 }
  },
  model: {
    url: String,
    format: String
  }
});

module.exports = mongoose.model('Furniture', furnitureSchema);