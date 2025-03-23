// backend/src/utils/helpers.js
const calculateRoomArea = (dimensions) => {
    return dimensions.width * dimensions.length;
  };
  
  const calculateRoomVolume = (dimensions) => {
    return dimensions.width * dimensions.length * dimensions.height;
  };
  
  const convertUnits = (value, fromUnit, toUnit) => {
    const conversions = {
      metersToFeet: 3.28084,
      feetToMeters: 0.3048
    };
  
    if (fromUnit === toUnit) return value;
  
    if (fromUnit === 'meters' && toUnit === 'feet') {
      return value * conversions.metersToFeet;
    }
  
    if (fromUnit === 'feet' && toUnit === 'meters') {
      return value * conversions.feetToMeters;
    }
  
    throw new Error('Unsupported unit conversion');
  };
  
  const validateDimensions = (dimensions) => {
    const { width, length, height } = dimensions;
    return width > 0 && length > 0 && height > 0;
  };
  
  const generateThumbnail = async (roomData) => {
    // Implementation for generating room thumbnail
    // This could involve creating a simple 2D representation of the room
    // or capturing a specific viewpoint of the 3D scene
    return {
      width: 300,
      height: 200,
      format: 'png',
      // Additional thumbnail generation logic would go here
    };
  };
  
  const formatErrorResponse = (error) => {
    return {
      message: error.message || 'An error occurred',
      code: error.code || 500,
      details: error.details || null
    };
  };
  
  const validateCoordinates = (position) => {
    const { x, y, z } = position;
    return typeof x === 'number' && 
           typeof y === 'number' && 
           typeof z === 'number';
  };
  
  module.exports = {
    calculateRoomArea,
    calculateRoomVolume,
    convertUnits,
    validateDimensions,
    generateThumbnail,
    formatErrorResponse,
    validateCoordinates
  };