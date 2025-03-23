/**
 * Room Service
 * Handles business logic for room operations
 */
const Room = require('../models/Room');
const Project = require('../models/Project');
const { validateRoom } = require('../validations/roomValidation');
const CustomError = require('../utils/CustomError');

/**
 * Create a new room within a project
 * @param {string} projectId - Project ID
 * @param {Object} roomData - Room data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created room
 */
const createRoom = async (projectId, roomData, userId) => {
  // Validate room data
  const { error } = validateRoom(roomData);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    const room = new Room({
      ...roomData,
      projectId,
      createdBy: userId,
      lastModifiedBy: userId,
      createdAt: new Date(),
      lastModifiedAt: new Date()
    });

    const savedRoom = await room.save();

    // Update project with reference to new room
    project.rooms.push(savedRoom._id);
    await project.save();

    return savedRoom;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to create room', 500);
  }
};

/**
 * Get all rooms for a project
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of rooms
 */
const getProjectRooms = async (projectId, userId) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    const rooms = await Room.find({ projectId }).sort({ createdAt: -1 });
    return rooms;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to fetch rooms', 500);
  }
};

/**
 * Get room by ID
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Room
 */
const getRoomById = async (roomId, userId) => {
  try {
    const room = await Room.findById(roomId).populate('furniture');
    if (!room) {
      throw new CustomError('Room not found', 404);
    }

    // Check if project belongs to user
    const project = await Project.findOne({ 
      _id: room.projectId, 
      createdBy: userId 
    });
    
    if (!project) {
      throw new CustomError('Not authorized to access this room', 403);
    }

    return room;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to fetch room', 500);
  }
};

/**
 * Update room
 * @param {string} roomId - Room ID
 * @param {Object} updateData - Updated room data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated room
 */
const updateRoom = async (roomId, updateData, userId) => {
  // Validate update data
  const { error } = validateRoom(updateData, true);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new CustomError('Room not found', 404);
    }

    // Check if project belongs to user
    const project = await Project.findOne({ 
      _id: room.projectId, 
      createdBy: userId 
    });
    
    if (!project) {
      throw new CustomError('Not authorized to update this room', 403);
    }

    // Update room
    Object.assign(room, {
      ...updateData,
      lastModifiedBy: userId,
      lastModifiedAt: new Date()
    });

    const updatedRoom = await room.save();
    return updatedRoom;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to update room', 500);
  }
};

/**
 * Delete room
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
const deleteRoom = async (roomId, userId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new CustomError('Room not found', 404);
    }

    // Check if project belongs to user
    const project = await Project.findOne({ 
      _id: room.projectId, 
      createdBy: userId 
    });
    
    if (!project) {
      throw new CustomError('Not authorized to delete this room', 403);
    }

    // Remove room from project
    project.rooms = project.rooms.filter(id => id.toString() !== roomId);
    await project.save();

    // Delete room
    await Room.deleteOne({ _id: roomId });
    
    return true;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to delete room', 500);
  }
};

/**
 * Add furniture to room
 * @param {string} roomId - Room ID
 * @param {string} furnitureId - Furniture ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated room
 */
const addFurnitureToRoom = async (roomId, furnitureId, userId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new CustomError('Room not found', 404);
    }

    // Check if project belongs to user
    const project = await Project.findOne({ 
      _id: room.projectId, 
      createdBy: userId 
    });
    
    if (!project) {
      throw new CustomError('Not authorized to update this room', 403);
    }

    // Add furniture if not already added
    if (!room.furniture.includes(furnitureId)) {
      room.furniture.push(furnitureId);
      room.lastModifiedBy = userId;
      room.lastModifiedAt = new Date();
      
      await room.save();
    }

    return room;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to add furniture to room', 500);
  }
};

/**
 * Remove furniture from room
 * @param {string} roomId - Room ID
 * @param {string} furnitureId - Furniture ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated room
 */
const removeFurnitureFromRoom = async (roomId, furnitureId, userId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new CustomError('Room not found', 404);
    }

    // Check if project belongs to user
    const project = await Project.findOne({ 
      _id: room.projectId, 
      createdBy: userId 
    });
    
    if (!project) {
      throw new CustomError('Not authorized to update this room', 403);
    }

    // Remove furniture
    room.furniture = room.furniture.filter(id => id.toString() !== furnitureId);
    room.lastModifiedBy = userId;
    room.lastModifiedAt = new Date();
    
    await room.save();
    return room;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to remove furniture from room', 500);
  }
};

module.exports = {
  createRoom,
  getProjectRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  addFurnitureToRoom,
  removeFurnitureFromRoom
};