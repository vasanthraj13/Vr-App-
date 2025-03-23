// backend/src/routes/rooms.js
const express = require('express');
const router = express.Router();
const { validateRoom } = require('../middleware/validation');
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');

// Get all rooms in a project
router.get('/project/:projectId', auth, roomController.getRoomsByProject);

// Create new room in a project
router.post('/project/:projectId', [auth, validateRoom], roomController.createRoom);

// Update room
router.put('/:id', [auth, validateRoom], roomController.updateRoom);

// Delete room
router.delete('/:id', auth, roomController.deleteRoom);

// Get room by ID
router.get('/:id', auth, roomController.getRoomById);

module.exports = router;