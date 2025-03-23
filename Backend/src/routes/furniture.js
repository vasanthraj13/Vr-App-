// backend/src/routes/furniture.js
const express = require('express');
const router = express.Router();
const { validateFurniture } = require('../middleware/validation');
const furnitureController = require('../controllers/furnitureController');
const auth = require('../middleware/auth');

// Get all furniture in a room
router.get('/room/:roomId', auth, furnitureController.getFurnitureByRoom);

// Add new furniture to a room
router.post('/room/:roomId', [auth, validateFurniture], furnitureController.createFurniture);

// Update furniture
router.put('/:id', [auth, validateFurniture], furnitureController.updateFurniture);

// Delete furniture
router.delete('/:id', auth, furnitureController.deleteFurniture);

// Get furniture by ID
router.get('/:id', auth, furnitureController.getFurnitureById);

module.exports = router;
