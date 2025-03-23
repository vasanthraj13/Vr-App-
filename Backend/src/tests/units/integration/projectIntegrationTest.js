// **tests/integration/project.integration.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Project = require('../../src/models/Project');
const User = require('../../src/models/User');
const { generateAuthToken } = require('../../src/utils/auth');

describe('Project API', () => {
  let token;
  let userId;

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
  });

  afterAll(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Integration Test Project',
        description: 'A project for integration testing',
        roomType: 'bedroom',
        dimensions: { width: 400, length: 500, height: 260 }
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(projectData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(projectData.name);
      expect(response.body.userId).toBe(userId.toString());
      
      // Verify project was saved to the database
      const project = await Project.findById(response.body._id);
      expect(project).not.toBeNull();
      expect(project.name).toBe(projectData.name);
    });

    it('should return 400 for invalid project data', async () => {
      const invalidData = {
        // Missing required fields
        description: 'Invalid project'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      // Create a test project
      const project = new Project({
        name: 'Test Project for GET',
        description: 'A project for testing GET endpoint',
        roomType: 'living-room',
        dimensions: { width: 500, length: 600, height: 280 },
        userId: userId
      });
      await project.save();
      projectId = project._id;
    });

    afterEach(async () => {
      await Project.deleteMany({});
    });

    it('should return a project by id', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(projectId.toString());
      expect(response.body.name).toBe('Test Project for GET');
    });

    it('should return 404 if project not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/projects/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
