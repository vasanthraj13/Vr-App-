const { Builder, By, until } = require('selenium-webdriver');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../../src/models/User');
const Project = require('../../src/models/Project');

describe('Export E2E Tests', () => {
  let driver;
  let userId;
  let projectId;
  const downloadPath = path.join(__dirname, 'downloads');

  beforeAll(async () => {
    // Create download directory if it doesn't exist
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath);
    }
    
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Set up test user
    const user = new User({
      email: 'export@example.com',
      password: 'hashedPassword',
      name: 'Export Test User'
    });
    await user.save();
    userId = user._id;
    
    // Create a test project with furniture
    const project = new Project({
      name: 'Export Test Project',
      description: 'Project for testing export functionality',
      roomType: 'living-room',
      dimensions: { width: 500, length: 600, height: 280 },
      userId: userId,
      furniture: [
        {
          type: 'sofa',
          position: { x: 100, y: 0, z: 200 },
          rotation: { x: 0, y: 90, z: 0 },
          dimensions: { width: 220, depth: 90, height: 85 },
          color: '#808080',
          modelId: 'model123'
        },
        {
          type: 'coffee-table',
          position: { x: 150, y: 0, z: 300 },
          rotation: { x: 0, y: 0, z: 0 },
          dimensions: { width: 120, depth: 60, height: 45 },
          color: '#8B4513',
          modelId: 'model789'
        }
      ]
    });
    await project.save();
    projectId = project._id;

    // Set up Selenium WebDriver with download path configuration
    const chromeCapabilities = require('selenium-webdriver/chrome').Options;
    const options = new chromeCapabilities();
    options.setUserPreferences({
      'download.default_directory': downloadPath,
      'download.prompt_for_download': false
    });
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    // Clean up database
    await User.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
    
    // Close the browser
    await driver.quit();
    
    // Clean up downloads
    if (fs.existsSync(downloadPath)) {
      fs.readdirSync(downloadPath).forEach(file => {
        fs.unlinkSync(path.join(downloadPath, file));
      });
      fs.rmdirSync(downloadPath);
    }
  });

  it('should export a project as PDF', async () => {
    // Login first
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.id('email')).sendKeys('export@example.com');
    await driver.findElement(By.id('password')).sendKeys('password123');
    await driver.findElement(By.id('login-button')).click();
    
    // Navigate to the project
    await driver.get(`http://localhost:3000/projects/${projectId}`);
    await driver.wait(until.elementLocated(By.id('export-button')), 5000);
    
    // Click export button
    await driver.findElement(By.id('export-button')).click();
    
    // Click PDF export option
    await driver.wait(until.elementLocated(By.id('export-pdf')), 5000);
    await driver.findElement(By.id('export-pdf')).click();
    
    // Wait for the download to complete (check download folder)
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for download
    
    // Verify file was downloaded
    const files = fs.readdirSync(downloadPath);
    const pdfFile = files.find(file => file.includes('Export_Test_Project') && file.endsWith('.pdf'));
    expect(pdfFile).toBeDefined();
    
    // Verify file has content
    const filePath = path.join(downloadPath, pdfFile);
    const fileStats = fs.statSync(filePath);
    expect(fileStats.size).toBeGreaterThan(0);
  }, 30000); // Longer timeout for E2E test
});