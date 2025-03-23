// backend/src/middleware/validation.js
const Joi = require('joi');

const validateProject = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    description: Joi.string().max(500),
    settings: Joi.object({
      scale: Joi.number().positive(),
      unit: Joi.string().valid('meters', 'feet')
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateRoom = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    dimensions: Joi.object({
      width: Joi.number().required().positive(),
      length: Joi.number().required().positive(),
      height: Joi.number().required().positive()
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateFurniture = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().required().valid('sofa', 'chair', 'table', 'bed', 'cabinet', 'light'),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required(),
      z: Joi.number().required()
    }).required(),
    rotation: Joi.object({
      x: Joi.number(),
      y: Joi.number(),
      z: Joi.number()
    }),
    scale: Joi.object({
      x: Joi.number().positive(),
      y: Joi.number().positive(),
      z: Joi.number().positive()
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateProject,
  validateRoom,
  validateFurniture
};