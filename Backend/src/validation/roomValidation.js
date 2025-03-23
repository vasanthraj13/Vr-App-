const Joi = require('joi');

/**
 * Validation schema for creating a new room
 */
const createRoomSchema = Joi.object({
  projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    .description('MongoDB ObjectId of the parent project'),
  name: Joi.string().min(2).max(50).required()
    .description('Room name - must be between 2 and 50 characters'),
  type: Joi.string().valid(
    'living-room', 'bedroom', 'bathroom', 'kitchen', 
    'dining-room', 'office', 'hallway', 'custom'
  ).required()
    .description('Type of room'),
  customType: Joi.string().max(50).when('type', {
    is: 'custom',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }).description('Custom room type name when type is "custom"'),
  dimensions: Joi.object({
    width: Joi.number().positive().required()
      .description('Room width in meters/feet'),
    length: Joi.number().positive().required()
      .description('Room length in meters/feet'),
    height: Joi.number().positive().required()
      .description('Room height in meters/feet')
  }).required()
    .description('Room dimensions'),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required()
  }).required()
    .description('Room position in 3D space'),
  wallColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default('#FFFFFF')
    .description('Wall color in hex format'),
  floorMaterial: Joi.string().valid(
    'hardwood', 'carpet', 'tile', 'concrete', 'marble', 'custom'
  ).default('hardwood')
    .description('Floor material type'),
  ceilingHeight: Joi.number().positive().default(2.7)
    .description('Ceiling height in meters/feet'),
  notes: Joi.string().max(500).allow('').optional()
    .description('Optional notes about the room')
});

/**
 * Validation schema for updating an existing room
 */
const updateRoomSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional()
    .description('Room name - must be between 2 and 50 characters'),
  type: Joi.string().valid(
    'living-room', 'bedroom', 'bathroom', 'kitchen', 
    'dining-room', 'office', 'hallway', 'custom'
  ).optional()
    .description('Type of room'),
  customType: Joi.string().max(50).when('type', {
    is: 'custom',
    then: Joi.required(),
    otherwise: Joi.optional()
  }).description('Custom room type name when type is "custom"'),
  dimensions: Joi.object({
    width: Joi.number().positive().required()
      .description('Room width in meters/feet'),
    length: Joi.number().positive().required()
      .description('Room length in meters/feet'),
    height: Joi.number().positive().required()
      .description('Room height in meters/feet')
  }).optional()
    .description('Room dimensions'),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required()
  }).optional()
    .description('Room position in 3D space'),
  wallColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional()
    .description('Wall color in hex format'),
  floorMaterial: Joi.string().valid(
    'hardwood', 'carpet', 'tile', 'concrete', 'marble', 'custom'
  ).optional()
    .description('Floor material type'),
  ceilingHeight: Joi.number().positive().optional()
    .description('Ceiling height in meters/feet'),
  notes: Joi.string().max(500).allow('').optional()
    .description('Optional notes about the room')
}).min(1);

/**
 * Validation schema for room search/filter parameters
 */
const roomQuerySchema = Joi.object({
  projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  name: Joi.string().optional(),
  type: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  sortBy: Joi.string().valid('name', 'createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  roomQuerySchema
};