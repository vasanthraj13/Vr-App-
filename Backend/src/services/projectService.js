/**
 * Project Service
 * Handles business logic for project operations
 */
const Project = require('../models/Project');
const { validateProject } = require('../validations/projectValidation');
const CustomError = require('../utils/CustomError');

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created project
 */
const createProject = async (projectData, userId) => {
  // Validate project data
  const { error } = validateProject(projectData);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  try {
    const project = new Project({
      ...projectData,
      createdBy: userId,
      lastModifiedBy: userId,
      createdAt: new Date(),
      lastModifiedAt: new Date()
    });

    const savedProject = await project.save();
    return savedProject;
  } catch (error) {
    throw new CustomError('Failed to create project', 500);
  }
};

/**
 * Get all projects for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options (pagination, sorting)
 * @returns {Promise<Array>} List of projects
 */
const getUserProjects = async (userId, options = {}) => {
  const { page = 1, limit = 10, sortBy = 'lastModifiedAt', order = 'desc' } = options;
  const skip = (page - 1) * limit;
  const sortOrder = order === 'desc' ? -1 : 1;

  try {
    const projects = await Project.find({ createdBy: userId })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments({ createdBy: userId });

    return {
      projects,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new CustomError('Failed to fetch projects', 500);
  }
};

/**
 * Get project by ID
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Project
 */
const getProjectById = async (projectId, userId) => {
  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }
    return project;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to fetch project', 500);
  }
};

/**
 * Update project
 * @param {string} projectId - Project ID
 * @param {Object} updateData - Updated project data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated project
 */
const updateProject = async (projectId, updateData, userId) => {
  // Validate update data
  const { error } = validateProject(updateData, true);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Update project
    Object.assign(project, {
      ...updateData,
      lastModifiedBy: userId,
      lastModifiedAt: new Date()
    });

    const updatedProject = await project.save();
    return updatedProject;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to update project', 500);
  }
};

/**
 * Delete project
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
const deleteProject = async (projectId, userId) => {
  try {
    const result = await Project.deleteOne({ _id: projectId, createdBy: userId });
    if (result.deletedCount === 0) {
      throw new CustomError('Project not found', 404);
    }
    return true;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to delete project', 500);
  }
};

/**
 * Duplicate project
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Duplicated project
 */
const duplicateProject = async (projectId, userId) => {
  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Create new project based on existing one
    const newProject = new Project({
      name: `${project.name} (Copy)`,
      description: project.description,
      dimensions: project.dimensions,
      styles: project.styles,
      createdBy: userId,
      lastModifiedBy: userId,
      createdAt: new Date(),
      lastModifiedAt: new Date()
    });

    const savedProject = await newProject.save();
    return savedProject;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to duplicate project', 500);
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  duplicateProject
};