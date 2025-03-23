// backend/src/controllers/furnitureController.js
const Furniture = require('../models/Furniture');
const logger = require('../utils/logger');

exports.createFurniture = async (req, res) => {
  try {
    const furniture = new Furniture({
      ...req.body,
      roomId: req.params.roomId
    });
    await furniture.save();
    res.status(201).json(furniture);
  } catch (error) {
    logger.error('Error creating furniture:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }
    res.json(furniture);
  } catch (error) {
    logger.error('Error updating furniture:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }
    res.json({ message: 'Furniture deleted successfully' });
  } catch (error) {
    logger.error('Error deleting furniture:', error);
    res.status(500).json({ message: error.message });
  }
};