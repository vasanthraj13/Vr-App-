const Joi = require('joi');

/**
 * Validation schema for creating new furniture
 */
const createFurnitureSchema = Joi.object({
  roomId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    .description('MongoDB ObjectId of the parent room'),
  name: Joi.string().min(2).max(50).required()
    .description('Furniture name - must be between 2 and 50 characters'),
  type: Joi.string().valid(
    'chair', 'table', 'sofa', 'bed', 'cabinet', 'desk',
    'bookshelf', 'light', 'plant', 'rug', 'decoration', 'custom'
  ).required()
    .description('Type of furniture'),
  customType: Joi.string().max(50).when('type', {
    is: 'custom',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }).description('Custom furniture type name when type is "custom"'),
  model: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    .description('MongoDB ObjectId reference to the 3D model'),
  dimensions: Joi.object({
    width: Joi.number().positive().required()
      .description('Furniture width in meters/feet'),
    length: Joi.number().positive().required()
      .description('Furniture length in meters/feet'),
    height: Joi.number().positive().required()
      .description('Furniture height in meters/feet')
  }).required()
    .description('Furniture dimensions'),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required()
  }).required()
    .description('Furniture position in 3D space'),
  rotation: Joi.object({
    x: Joi.number().min(0).max(360).default(0),
    y: Joi.number().min(0).max(360).default(0),
    z: Joi.number().min(0).max(360).default(0)
  }).default({ x: 0, y: 0, z: 0 })
    .description('Furniture rotation in degrees'),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional()
    .description('Furniture color in hex format (if customizable)'),
  material: Joi.string().valid(
    'wood', 'metal', 'fabric', 'leather', 'glass', 'plastic', 'custom'
  ).optional()
    .description('Primary material of the furniture'),
  price: Joi.number().min(0).optional()
    .description('Price of the furniture item'),
  manufacturer: Joi.string().max(100).optional()
    .description('Manufacturer name'),
  notes: Joi.string().max(500).allow('').optional()
    .description('Optional notes about the furniture')
});

/**
 * Validation schema for updating existing furniture
 */
const updateFurnitureSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional()
    .description('Furniture name - must be between 2 and 50 characters'),
  model: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
    .description('MongoDB ObjectId reference to the 3D model'),
  dimensions: Joi.object({
    width: Joi.number().positive().required(),
    length: Joi.number().positive().required(),
    height: Joi.number().positive().required()
  }).optional()
    .description('Furniture dimensions'),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required()
  }).optional()
    .description('Furniture position in 3D space'),
  rotation: Joi.object({
    x: Joi.number().min(0).max(360).required(),
    y: Joi.number().min(0).max(360).required(),
    z: Joi.number().min(0).max(360).required()
  }).optional()
    .description('Furniture rotation in degrees'),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional()
    .description('Furniture color in hex format (if customizable)'),
  material: Joi.string().valid(
    'wood', 'metal', 'fabric', 'leather', 'glass', 'plastic', 'custom'
  ).optional()
    .description('Primary material of the furniture'),
  price: Joi.number().min(0).optional()
    .description('Price of the furniture item'),
  manufacturer: Joi.string().max(100).optional()
    .description('Manufacturer name'),
  notes: Joi.string().max(500).allow('').optional()
    .description('Optional notes about the furniture')
}).min(1);

/**
 * Validation schema for furniture search/filter parameters
 */
const furnitureQuerySchema = Joi.object({
  roomId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  type: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  name: Joi.string().optional(),
  material: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  priceMin: Joi.number().min(0).optional(),
  priceMax: Joi.number().min(0).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  sortBy: Joi.string().valid('name', 'price', 'createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

module.exports = {
  createFurnitureSchema,
  updateFurnitureSchema,
  furnitureQuerySchema
};