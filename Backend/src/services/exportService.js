/**
 * Export Service
 * Handles export functionality for projects and rooms
 */
const Project = require('../models/Project');
const Room = require('../models/Room');
const Furniture = require('../models/Furniture');
const CustomError = require('../utils/CustomError');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const archiver = require('archiver');
const PDFDocument = require('pdfkit');

/**
 * Export project data to JSON
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Project data in JSON format
 */
const exportProjectToJSON = async (projectId, userId) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Get all rooms in the project
    const rooms = await Room.find({ projectId }).populate('furniture');

    // Format data for export
    const exportData = {
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        dimensions: project.dimensions,
        styles: project.styles,
        createdAt: project.createdAt
      },
      rooms: rooms.map(room => ({
        id: room._id,
        name: room.name,
        type: room.type,
        dimensions: room.dimensions,
        furniture: room.furniture.map(item => ({
          id: item._id,
          name: item.name,
          type: item.type,
          dimensions: item.dimensions,
          position: item.position,
          rotation: item.rotation,
          model: item.model
        }))
      }))
    };

    return exportData;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to export project', 500);
  }
};

/**
 * Export project data to CSV
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<string>} Path to CSV file
 */
const exportProjectToCSV = async (projectId, userId) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Get all rooms in the project
    const rooms = await Room.find({ projectId });
    
    // Get all furniture used in the project
    const furnitureIds = rooms.reduce((ids, room) => {
      return [...ids, ...room.furniture];
    }, []);
    
    const furniture = await Furniture.find({ _id: { $in: furnitureIds } });

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Create unique filename
    const timestamp = Date.now();
    const projectFilePath = path.join(tempDir, `project_${projectId}_${timestamp}.csv`);
    const roomsFilePath = path.join(tempDir, `rooms_${projectId}_${timestamp}.csv`);
    const furnitureFilePath = path.join(tempDir, `furniture_${projectId}_${timestamp}.csv`);
    const zipFilePath = path.join(tempDir, `export_${projectId}_${timestamp}.zip`);

    // Create CSV writers
    const projectWriter = createObjectCsvWriter({
      path: projectFilePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'dimensions', title: 'Dimensions' },
        { id: 'styles', title: 'Styles' },
        { id: 'createdAt', title: 'Created At' }
      ]
    });

    const roomsWriter = createObjectCsvWriter({
      path: roomsFilePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'type', title: 'Type' },
        { id: 'dimensions', title: 'Dimensions' },
        { id: 'projectId', title: 'Project ID' }
      ]
    });

    const furnitureWriter = createObjectCsvWriter({
      path: furnitureFilePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'type', title: 'Type' },
        { id: 'dimensions', title: 'Dimensions' },
        { id: 'position', title: 'Position' },
        { id: 'rotation', title: 'Rotation' },
        { id: 'roomId', title: 'Room ID' }
      ]
    });

    // Format data for CSV
    const projectData = [{
      id: project._id,
      name: project.name,
      description: project.description,
      dimensions: JSON.stringify(project.dimensions),
      styles: project.styles.join(', '),
      createdAt: project.createdAt
    }];

    const roomsData = rooms.map(room => ({
      id: room._id,
      name: room.name,
      type: room.type,
      dimensions: JSON.stringify(room.dimensions),
      projectId: room.projectId
    }));

    const furnitureData = furniture.map(item => {
      // Find which room this furniture belongs to
      const room = rooms.find(r => r.furniture.includes(item._id));
      return {
        id: item._id,
        name: item.name,
        type: item.type,
        dimensions: JSON.stringify(item.dimensions),
        position: JSON.stringify(item.position),
        rotation: JSON.stringify(item.rotation),
        roomId: room ? room._id : ''
      };
    });

    // Write CSV files
    await projectWriter.writeRecords(projectData);
    await roomsWriter.writeRecords(roomsData);
    await furnitureWriter.writeRecords(furnitureData);

    // Create ZIP archive
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    archive.file(projectFilePath, { name: 'project.csv' });
    archive.file(roomsFilePath, { name: 'rooms.csv' });
    archive.file(furnitureFilePath, { name: 'furniture.csv' });
    
    await archive.finalize();

    // Clean up individual CSV files
    fs.unlinkSync(projectFilePath);
    fs.unlinkSync(roomsFilePath);
    fs.unlinkSync(furnitureFilePath);

    return zipFilePath;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to export project to CSV', 500);
  }
};

/**
 * Export project to PDF
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<string>} Path to PDF file
 */
const exportProjectToPDF = async (projectId, userId) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Get all rooms in the project
    const rooms = await Room.find({ projectId }).populate('furniture');

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Create unique filename
    const timestamp = Date.now();
    const pdfFilePath = path.join(tempDir, `project_${projectId}_${timestamp}.pdf`);

    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(fs.createWriteStream(pdfFilePath));

    // Add project details
    doc.fontSize(25).text('Project Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`${project.name}`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text('Project Details:', { underline: true });
    doc.fontSize(10).text(`Description: ${project.description || 'N/A'}`);
    doc.fontSize(10).text(`Dimensions: ${JSON.stringify(project.dimensions) || 'N/A'}`);
    doc.fontSize(10).text(`Styles: ${project.styles.join(', ') || 'N/A'}`);
    doc.fontSize(10).text(`Created: ${project.createdAt.toDateString()}`);
    
    doc.moveDown(2);

    // Add rooms details
    doc.fontSize(12).text('Rooms:', { underline: true });
    doc.moveDown();

    rooms.forEach((room, index) => {
      doc.fontSize(11).text(`Room ${index + 1}: ${room.name}`, { underline: true });
      doc.fontSize(10).text(`Type: ${room.type || 'N/A'}`);
      doc.fontSize(10).text(`Dimensions: ${JSON.stringify(room.dimensions) || 'N/A'}`);
      
      doc.moveDown();
      
      // Add furniture details
      if (room.furniture && room.furniture.length > 0) {
        doc.fontSize(10).text('Furniture:', { underline: true });
        
        room.furniture.forEach((item, i) => {
          doc.fontSize(9).text(`${i + 1}. ${item.name} (${item.type || 'N/A'})`);
          doc.fontSize(8).text(`   Dimensions: ${JSON.stringify(item.dimensions) || 'N/A'}`);
          doc.fontSize(8).text(`   Position: ${JSON.stringify(item.position) || 'N/A'}`);
        });
      } else {
        doc.fontSize(10).text('No furniture in this room.');
      }
      
      doc.moveDown();
    });

    // Finalize PDF
    doc.end();

    return pdfFilePath;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to export project to PDF', 500);
  }
};

/**
 * Generate project summary report
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Project summary
 */
const generateProjectSummary = async (projectId, userId) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Get all rooms in the project
    const rooms = await Room.find({ projectId });
    
    // Get all furniture used in the project
    const furnitureIds = rooms.reduce((ids, room) => {
      return [...ids, ...room.furniture];
    }, []);
    
    const furniture = await Furniture.find({ _id: { $in: furnitureIds } });

    // Calculate statistics
    const totalRooms = rooms.length;
    const totalFurniture = furniture.length;
    
    // Count furniture by type
    const furnitureByType = furniture.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate total area
    let totalArea = 0;
    rooms.forEach(room => {
      if (room.dimensions && room.dimensions.width && room.dimensions.length) {
        totalArea += room.dimensions.width * room.dimensions.length;
      }
    });

    // Generate summary
    const summary = {
      projectName: project.name,
      projectDescription: project.description,
      totalRooms,
      totalFurniture,
      totalArea: Math.round(totalArea * 100) / 100,
      furnitureByType,
      createdAt: project.createdAt,
      lastModifiedAt: project.lastModifiedAt
    };

    return summary;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to generate project summary', 500);
  }
};

module.exports = {
  exportProjectToJSON,
  exportProjectToCSV,
  exportProjectToPDF,
  generateProjectSummary
};