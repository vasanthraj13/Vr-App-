const exportService = require('../../src/services/exportService');
const Project = require('../../src/models/Project');

jest.mock('../../src/models/Project');

describe('Export Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportProjectAsPDF', () => {
    it('should generate a PDF export of a project', async () => {
      // Mock data
      const projectId = 'project123';
      const projectData = {
        _id: projectId,
        name: 'Test Project',
        description: 'A test project',
        roomType: 'living-room',
        dimensions: { width: 500, length: 600, height: 280 },
        furniture: [
          {
            _id: 'furniture123',
            type: 'sofa',
            position: { x: 100, y: 0, z: 200 },
            rotation: { x: 0, y: 90, z: 0 },
            dimensions: { width: 220, depth: 90, height: 85 },
            color: '#808080',
            modelId: 'model123'
          }
        ]
      };
      
      // Mock the findById method
      Project.findById = jest.fn().mockResolvedValue(projectData);
      
      // Mock the PDF generation function (implementation specific)
      const mockPdfBuffer = Buffer.from('fake-pdf-content');
      exportService._generatePDF = jest.fn().mockResolvedValue(mockPdfBuffer);

      // Call the service method
      const result = await exportService.exportProjectAsPDF(projectId);

      // Assertions
      expect(Project.findById).toHaveBeenCalledWith(projectId);
      expect(exportService._generatePDF).toHaveBeenCalledWith(projectData);
      expect(result).toEqual(mockPdfBuffer);
    });

    it('should throw an error if project not found', async () => {
      // Mock the findById method
      Project.findById = jest.fn().mockResolvedValue(null);

      // Call the service method and expect it to throw
      await expect(exportService.exportProjectAsPDF('nonexistentId'))
        .rejects.toThrow('Project not found');
    });
  });
});