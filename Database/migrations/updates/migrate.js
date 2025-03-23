// migrations/20230101000000-initial-schema.js
/**
 * Initial database schema migration
 */
module.exports = {
  async up(db) {
    // Create collections with validators
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              bsonType: 'string',
              description: 'Email must be a string and is required'
            },
            password: {
              bsonType: 'string',
              description: 'Password must be a string and is required'
            },
            name: {
              bsonType: 'string',
              description: 'Name must be a string and is required'
            }
          }
        }
      }
    });

    await db.createCollection('projects', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'owner', 'dimensions'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Project name must be a string and is required'
            },
            owner: {
              bsonType: 'objectId',
              description: 'Owner ID must be an objectId and is required'
            },
            dimensions: {
              bsonType: 'object',
              required: ['width', 'length'],
              properties: {
                width: {
                  bsonType: 'number',
                  description: 'Width must be a number and is required'
                },
                length: {
                  bsonType: 'number',
                  description: 'Length must be a number and is required'
                }
              }
            }
          }
        }
      }
    });

    await db.createCollection('rooms', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'project', 'dimensions', 'position'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Room name must be a string and is required'
            },
            project: {
              bsonType: 'objectId',
              description: 'Project ID must be an objectId and is required'
            }
          }
        }
      }
    });

    await db.createCollection('furniture', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'type', 'room', 'model', 'position'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Furniture name must be a string and is required'
            },
            room: {
              bsonType: 'objectId',
              description: 'Room ID must be an objectId and is required'
            }
          }
        }
      }
    });

    await db.createCollection('assetlibraries', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'owner'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Asset library name must be a string and is required'
            },
            owner: {
              bsonType: 'objectId',
              description: 'Owner ID must be an objectId and is required'
            }
          }
        }
      }
    });

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('projects').createIndex({ owner: 1 });
    await db.collection('projects').createIndex({ 'collaborators.user': 1 });
    await db.collection('rooms').createIndex({ project: 1 });
    await db.collection('furniture').createIndex({ room: 1 });
    await db.collection('assetlibraries').createIndex({ owner: 1 });
    await db.collection('assetlibraries').createIndex({ isPublic: 1 });
  },

  async down(db) {
    await db.collection('users').drop();
    await db.collection('projects').drop();
    await db.collection('rooms').drop();
    await db.collection('furniture').drop();
    await db.collection('assetlibraries').drop();
  }
};

// migrations/20230201000000-add-version-field.js
/**
 * Add versioning to projects for change tracking
 */
module.exports = {
  async up(db) {
    await db.collection('projects').updateMany({}, {
      $set: {
        version: 1,
        versionHistory: []
      }
    });
  },

  async down(db) {
    await db.collection('projects').updateMany({}, {
      $unset: {
        version: "",
        versionHistory: ""
      }
    });
  }
};

// migrations/20230301000000-add-lighting-model.js
/**
 * Add lighting model for room lighting configurations
 */
module.exports = {
  async up(db) {
    await db.createCollection('lighting', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'room', 'type'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Light name must be a string and is required'
            },
            room: {
              bsonType: 'objectId',
              description: 'Room ID must be an objectId and is required'
            },
            type: {
              bsonType: 'string',
              enum: ['ambient', 'directional', 'point', 'spot'],
              description: 'Light type must be one of the allowed values'
            }
          }
        }
      }
    });

    await db.collection('lighting').createIndex({ room: 1 });

    // Update room model to include default lighting
    await db.collection('rooms').updateMany({}, {
      $set: {
        lighting: {
          ambient: {
            color: '#FFFFFF',
            intensity: 0.5
          }
        }
      }
    });
  },

  async down(db) {
    await db.collection('lighting').drop();
    
    await db.collection('rooms').updateMany({}, {
      $unset: {
        lighting: ""
      }
    });
  }
};

// migrations/20230401000000-add-measurements-annotations.js
/**
 * Add measurements and annotations for technical drawings
 */
module.exports = {
  async up(db) {
    await db.createCollection('annotations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['text', 'project', 'position'],
          properties: {
            text: {
              bsonType: 'string',
              description: 'Annotation text must be a string and is required'
            },
            project: {
              bsonType: 'objectId',
              description: 'Project ID must be an objectId and is required'
            },
            position: {
              bsonType: 'object',
              required: ['x', 'y', 'z'],
              properties: {
                x: { bsonType: 'number' },
                y: { bsonType: 'number' },
                z: { bsonType: 'number' }
              }
            }
          }
        }
      }
    });

    await db.collection('annotations').createIndex({ project: 1 });

    // Add measurements array to projects
    await db.collection('projects').updateMany({}, {
      $set: {
        measurements: []
      }
    });
  },

  async down(db) {
    await db.collection('annotations').drop();
    
    await db.collection('projects').updateMany({}, {
      $unset: {
        measurements: ""
      }
    });
  }
};

// migrations/20230501000000-add-export-formats.js
/**
 * Add export format options
 */
module.exports = {
  async up(db) {
    await db.createCollection('exporttemplates', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'format', 'creator'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Template name must be a string and is required'
            },
            format: {
              bsonType: 'string',
              enum: ['obj', 'fbx', 'gltf', 'usdz', 'pdf', 'jpg', 'png'],
              description: 'Format must be one of the allowed values'
            },
            creator: {
              bsonType: 'objectId',
              description: 'Creator ID must be an objectId and is required'
            }
          }
        }
      }
    });

    await db.collection('exporttemplates').createIndex({ creator: 1 });
    await db.collection('exporttemplates').createIndex({ format: 1 });
  },

  async down(db) {
    await db.collection('exporttemplates').drop();
  }
};