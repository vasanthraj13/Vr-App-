// backend/src/controllers/roomController.js
const Room = require('../models/Room');
const logger = require('../utils/logger');

exports.createRoom = async (req, res) => {
  try {
    const room = new Room({
      ...req.body,
      projectId: req.params.projectId
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    logger.error('Error creating room:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ projectId: req.params.projectId })
      .populate('furniture');
    res.json(rooms);
  } catch (error) {
    logger.error('Error fetching rooms:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    logger.error('Error updating room:', error);
    res.status(400).json({ message: error.message });
  }
};