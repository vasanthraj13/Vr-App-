/ **tests/unit/projectService.test.js
const projectService = require('../../src/services/projectService');
const Project = require('../../src/models/Project');

// Mock the Project model
jest.mock('../../src/models/Project');

describe('Project Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      // Mock data
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
        roomType: 'living-room',
        dimensions: { width: 500, length: 600, height: 280 },
        userId: 'user123'
      };
      
      // Mock the save method
      Project.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          _id: 'project123',
          ...projectData
        })
      }));

      // Call the service method
      const result = await projectService.createProject(projectData);

      // Assertions
      expect(Project).toHaveBeenCalledWith(projectData);
      expect(result._id).toBe('project123');
      expect(result.name).toBe(projectData.name);
    });

    it('should throw an error if project creation fails', async () => {
      // Mock data
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
        roomType: 'living-room',
        dimensions: { width: 500, length: 600, height: 280 },
        userId: 'user123'
      };
      
      // Mock the save method to throw an error
      Project.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      // Call the service method and expect it to throw
      await expect(projectService.createProject(projectData)).rejects.toThrow('Database error');
    });
  });

  describe('getProjectById', () => {
    it('should return a project by id', async () => {
      // Mock data
      const projectId = 'project123';
      const projectData = {
        _id: projectId,
        name: 'Test Project',
        description: 'A test project',
        roomType: 'living-room',
        dimensions: { width: 500, length: 600, height: 280 },
        userId: 'user123'
      };
      
      // Mock the findById method
      Project.findById = jest.fn().mockResolvedValue(projectData);

      // Call the service method
      const result = await projectService.getProjectById(projectId);

      // Assertions
      expect(Project.findById).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(projectData);
    });

    it('should return null if project not found', async () => {
      // Mock the findById method
      Project.findById = jest.fn().mockResolvedValue(null);

      // Call the service method
      const result = await projectService.getProjectById('nonexistentId');

      // Assertions
      expect(result).toBeNull();
    });
  });
});