// **tests/integration/room.integration.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Project = require('../../src/models/Project');
const User = require('../../src/models/User');
const { generateAuthToken } = require('../../src/utils/auth');

describe('Room API', () => {
  let token;
  let userId;
  let projectId;

  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Create a test user
    const user = new User({
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User'
    });
    await user.save();
    userId = user._id;
    
    // Generate auth token
    token = generateAuthToken(user);
    
    // Create a test project
    const project = new Project({
      name: 'Test Project for Room API',
      description: 'A project for testing room operations',
      roomType: 'living-room',
      dimensions: { width: 500, length: 600, height: 280 },
      userId: userId,
      furniture: []
    });
    await project.save();
    projectId = project._id;
  });

  afterAll(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/projects/:id/furniture', () => {
    it('should add furniture to a room', async () => {
      const furnitureData = {
        type: 'chair',
        position: { x: 150, y: 0, z: 250 },
        rotation: { x: 0, y: 180, z: 0 },
        dimensions: { width: 60, depth: 60, height: 90 },
        color: '#A0522D',
        modelId: 'model456'
      };

      const response = await request(app)
        .post(`/api/projects/${projectId}/furniture`)
        .set('Authorization', `Bearer ${token}`)
        .send(furnitureData);

      expect(response.status).toBe(200);
      expect(response.body.furniture).toHaveLength(1);
      expect(response.body.furniture[0].type).toBe('chair');
      
      // Verify furniture was added to the project in the database
      const project = await Project.findById(projectId);
      expect(project.furniture).toHaveLength(1);
      expect(project.furniture[0].type).toBe('chair');
    });

    it('should return 400 for invalid furniture data', async () => {
      const invalidData = {
        // Missing required fields
        color: '#A0522D'
      };

      const response = await request(app)
        .post(`/api/projects/${projectId}/furniture`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });
});
