/**
 * Project Validation Schema
 * Validates project data using Joi
 */
const Joi = require('joi');

/**
 * Validate project data
 * @param {Object} project - Project data to validate
 * @param {boolean} isUpdate - If true, makes fields optional for partial updates
 * @returns {Object} Validation result
 */
const validateProject = (project, isUpdate = false) => {
  const schema = Joi.object({
    name: isUpdate 
      ? Joi.string().min(3).max(100)
      : Joi.string().min(3).max(100).required(),
      
    description: Joi.string().max(1000).allow('', null),
    
    dimensions: isUpdate
      ? Joi.object({
          width: Joi.number().positive(),
          length: Joi.number().positive(),
          height: Joi.number().positive()
        })
      : Joi.object({
          width: Joi.number().positive().required(),
          length: Joi.number().positive().required(),
          height: Joi.number().positive()
        }).required(),
        
    styles: Joi.array().items(Joi.string()),
    
    isPublic: Joi.boolean(),
    
    tags: Joi.array().items(Joi.string().max(30)),
    
    thumbnail: Joi.string().uri().allow('', null),
    
    budget: Joi.object({
      amount: Joi.number().min(0),
      currency: Joi.string().valid('USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD')
    })
  });

  return schema.validate(project, { abortEarly: false });
};

/**
 * Validate project search parameters
 * @param {Object} searchParams - Search parameters
 * @returns {Object} Validation result
 */
const validateProjectSearch = (searchParams) => {
  const schema = Joi.object({
    query: Joi.string().allow('', null),
    styles: Joi.array().items(Joi.string()),
    minDimensions: Joi.object({
      width: Joi.number().positive(),
      length: Joi.number().positive()
    }),
    maxDimensions: Joi.object({
      width: Joi.number().positive(),
      length: Joi.number().positive()
    }),
    isPublic: Joi.boolean(),
    tags: Joi.array().items(Joi.string()),
    sort: Joi.string().valid('name', 'createdAt', 'lastModifiedAt'),
    order: Joi.string().valid('asc', 'desc'),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  });

  return schema.validate(searchParams);
};

module.exports = {
  validateProject,
  validateProjectSearch
};