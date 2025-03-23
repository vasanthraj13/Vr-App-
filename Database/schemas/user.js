// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    jobTitle: {
      type: String,
      default: '',
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      vrControls: {
        type: Object,
        default: {
          movementSpeed: 1,
          rotationSpeed: 1,
          snapToGrid: true,
          gridSize: 0.5,
        },
      },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for projects
userSchema.virtual('projects', {
  ref: 'Project',
  foreignField: 'owner',
  localField: '_id',
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a user'],
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['editor', 'viewer'],
          default: 'viewer',
        },
      },
    ],
    thumbnail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'in-progress', 'completed', 'archived'],
      default: 'draft',
    },
    tags: [String],
    metadata: {
      type: Object,
      default: {},
    },
    dimensions: {
      width: {
        type: Number,
        required: [true, 'Project width is required'],
      },
      length: {
        type: Number,
        required: [true, 'Project length is required'],
      },
      height: {
        type: Number,
        default: 3, // Default ceiling height in meters
      },
    },
    settings: {
      units: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric',
      },
      gridSnap: {
        type: Boolean,
        default: true,
      },
      gridSize: {
        type: Number,
        default: 0.1, // Grid size in meters
      },
      wallThickness: {
        type: Number,
        default: 0.15, // Wall thickness in meters
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for rooms
projectSchema.virtual('rooms', {
  ref: 'Room',
  foreignField: 'project',
  localField: '_id',
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Room must belong to a project'],
    },
    type: {
      type: String,
      enum: [
        'living', 'kitchen', 'bedroom', 'bathroom', 
        'dining', 'office', 'hallway', 'other'
      ],
      default: 'other',
    },
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        default: 0,
      },
      z: {
        type: Number,
        required: true,
      },
    },
    dimensions: {
      width: {
        type: Number,
        required: [true, 'Room width is required'],
      },
      length: {
        type: Number,
        required: [true, 'Room length is required'],
      },
      height: {
        type: Number,
        default: null, // Will inherit from project if null
      },
    },
    walls: [
      {
        start: {
          x: Number,
          z: Number,
        },
        end: {
          x: Number,
          z: Number,
        },
        windows: [
          {
            position: Number, // Relative position on wall (0-1)
            width: Number,
            height: Number,
            elevation: Number, // Height from floor
          },
        ],
        doors: [
          {
            position: Number, // Relative position on wall (0-1)
            width: Number,
            height: Number,
            isOpen: {
              type: Boolean,
              default: false,
            },
            openDirection: {
              type: String,
              enum: ['in', 'out'],
              default: 'in',
            },
          },
        ],
        color: {
          type: String,
          default: '#FFFFFF',
        },
        texture: {
          type: String,
          default: '',
        },
      },
    ],
    floor: {
      color: {
        type: String,
        default: '#CCCCCC',
      },
      texture: {
        type: String,
        default: '',
      },
      material: {
        type: String,
        enum: ['wood', 'tile', 'carpet', 'concrete', 'other'],
        default: 'wood',
      },
    },
    ceiling: {
      color: {
        type: String,
        default: '#FFFFFF',
      },
      texture: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for furniture
roomSchema.virtual('furniture', {
  ref: 'Furniture',
  foreignField: 'room',
  localField: '_id',
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

// models/Furniture.js
const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Furniture name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'chair', 'sofa', 'table', 'bed', 'cabinet', 
        'storage', 'lamp', 'decoration', 'electronics', 'other'
      ],
      default: 'other',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Furniture must belong to a room'],
    },
    model: {
      type: String, // Path or ID to 3D model
      required: [true, 'Furniture model is required'],
    },
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
      z: {
        type: Number,
        required: true,
      },
    },
    rotation: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
      z: {
        type: Number,
        default: 0,
      },
    },
    scale: {
      x: {
        type: Number,
        default: 1,
      },
      y: {
        type: Number,
        default: 1,
      },
      z: {
        type: Number,
        default: 1,
      },
    },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
    color: {
      type: String,
      default: '',
    },
    material: {
      type: String,
      default: '',
    },
    metadata: {
      type: Object,
      default: {},
    },
    isInteractive: {
      type: Boolean,
      default: false,
    },
    interactions: [
      {
        type: {
          type: String,
          enum: ['open', 'sit', 'lie', 'turn', 'custom'],
        },
        animation: {
          type: String,
          default: '',
        },
        states: [String],
        currentState: {
          type: String,
          default: 'default',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Furniture = mongoose.model('Furniture', furnitureSchema);

module.exports = Furniture;

// models/AssetLibrary.js
const mongoose = require('mongoose');

const assetLibrarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Asset library name is required'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Asset library must belong to a user'],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    assets: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['furniture', 'material', 'texture', 'lighting', 'decoration', 'other'],
          default: 'furniture',
        },
        category: {
          type: String,
          default: 'other',
        },
        modelUrl: String,
        thumbnailUrl: String,
        dimensions: {
          width: Number,
          height: Number,
          depth: Number,
        },
        metadata: {
          type: Object,
          default: {},
        },
        tags: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AssetLibrary = mongoose.model('AssetLibrary', assetLibrarySchema);

module.exports = AssetLibrary;