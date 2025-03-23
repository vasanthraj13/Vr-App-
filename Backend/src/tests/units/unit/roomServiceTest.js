const roomService = require('../../src/services/roomService');
const Project = require('../../src/models/Project');

jest.mock('../../src/models/Project');

describe('Room Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFurnitureToRoom', () => {
    it('should add furniture to a room', async () => {
      // Mock data
      const projectId = 'project123';
      const furnitureItem = {
        type: 'sofa',
        position: { x: 100, y: 0, z: 200 },
        rotation: { x: 0, y: 90, z: 0 },
        dimensions: { width: 220, depth: 90, height: 85 },
        color: '#808080',
        modelId: 'model123'
      };
      
      const mockProject = {
        _id: projectId,
        furniture: [],
        save: jest.fn().mockResolvedValue({
          _id: projectId,
          furniture: [{ ...furnitureItem, _id: 'furniture123' }]
        })
      };
      
      Project.findById = jest.fn().mockResolvedValue(mockProject);

      // Call the service method
      const result = await roomService.addFurnitureToRoom(projectId, furnitureItem);

      // Assertions
      expect(Project.findById).toHaveBeenCalledWith(projectId);
      expect(mockProject.furniture.length).toBe(0); // Original array untouched
      expect(mockProject.save).toHaveBeenCalled();
      expect(result.furniture.length).toBe(1);
      expect(result.furniture[0].type).toBe('sofa');
    });

    it('should throw an error if project not found', async () => {
      // Mock the findById method
      Project.findById = jest.fn().mockResolvedValue(null);

      // Call the service method and expect it to throw
      await expect(roomService.addFurnitureToRoom('nonexistentId', {}))
        .rejects.toThrow('Project not found');
    });
  });
});