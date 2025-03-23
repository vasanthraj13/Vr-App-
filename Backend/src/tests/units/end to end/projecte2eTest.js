const { Builder, By, until } = require('selenium-webdriver');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Project = require('../../src/models/Project');

describe('Project E2E Tests', () => {
  let driver;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Set up test user
    const user = new User({
      email: 'e2e@example.com',
      password: 'hashedPassword',
      name: 'E2E Test User'
    });
    await user.save();
    userId = user._id;

    // Set up Selenium WebDriver
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    // Clean up database
    await User.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
    
    // Close the browser
    await driver.quit();
  });

  it('should create a new project', async () => {
    // Login first
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.id('email')).sendKeys('e2e@example.com');
    await driver.findElement(By.id('password')).sendKeys('password123');
    await driver.findElement(By.id('login-button')).click();
    
    // Wait for dashboard to load
    await driver.wait(until.elementLocated(By.id('create-project-button')), 5000);
    
    // Create a new project
    await driver.findElement(By.id('create-project-button')).click();
    await driver.wait(until.elementLocated(By.id('project-form')), 5000);
    
    await driver.findElement(By.id('project-name')).sendKeys('E2E Test Project');
    await driver.findElement(By.id('project-description')).sendKeys('Project created during E2E test');
    await driver.findElement(By.css('select#room-type option[value="bedroom"]')).click();
    
    await driver.findElement(By.id('room-width')).clear();
    await driver.findElement(By.id('room-width')).sendKeys('400');
    await driver.findElement(By.id('room-length')).clear();
    await driver.findElement(By.id('room-length')).sendKeys('500');
    await driver.findElement(By.id('room-height')).clear();
    await driver.findElement(By.id('room-height')).sendKeys('260');
    
    await driver.findElement(By.id('submit-project')).click();
    
    // Wait for redirect to project editor
    await driver.wait(until.elementLocated(By.id('project-editor')), 5000);
    
    // Verify project was created
    const projectTitle = await driver.findElement(By.id('project-title')).getText();
    expect(projectTitle).toBe('E2E Test Project');

    // Verify in database
    const projects = await Project.find({ userId });
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.some(p => p.name === 'E2E Test Project')).toBe(true);
  }, 30000); // Longer timeout for E2E test

  it('should add furniture to a room', async () => {
    // Create a test project first
    const project = new Project({
      name: 'Furniture Test Project',
      description: 'Project for testing furniture addition',
      roomType: 'living-room',
      dimensions: { width: 500, length: 600, height: 280 },
      userId: userId,
      furniture: []
    });
    await project.save();
    const projectId = project._id;
    
    // Navigate to the project
    await driver.get(`http://localhost:3000/projects/${projectId}`);
    await driver.wait(until.elementLocated(By.id('furniture-panel')), 5000);
    
    // Add furniture
    await driver.findElement(By.id('add-furniture-button')).click();
    await driver.wait(until.elementLocated(By.id('furniture-catalog')), 5000);
    
    // Select a furniture item (e.g., a sofa)
    await driver.findElement(By.css('.furniture-item[data-type="sofa"]')).click();
    
    // Place it in the room
    const roomCanvas = await driver.findElement(By.id('room-canvas'));
    await driver.actions().move({ origin: roomCanvas }).click().perform();
    
    // Verify furniture was added to the room view
    await driver.wait(until.elementLocated(By.css('.furniture-object')), 5000);
    const furnitureCount = await driver.findElements(By.css('.furniture-object'));
    expect(furnitureCount.length).toBeGreaterThan(0);
    
    // Verify in database
    const updatedProject = await Project.findById(projectId);
    expect(updatedProject.furniture.length).toBeGreaterThan(0);
  }, 30000); // Longer timeout for E2E test
});