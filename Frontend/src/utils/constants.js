export const VR_SETTINGS = {
  QUALITY_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },
  
  RENDER_MODES: {
    STANDARD: 'standard',
    VR: 'vr',
    AR: 'ar'
  },
  
  MEASUREMENT_UNITS: {
    METRIC: 'metric',
    IMPERIAL: 'imperial'
  }
};

export const API_ENDPOINTS = {
  PROJECTS: '/projects',
  USER_PREFERENCES: '/user/preferences',
  MODELS: '/models'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  INVALID_INPUT: 'Invalid input provided. Please check your data.',
  VR_NOT_SUPPORTED: 'VR is not supported on this device.'
};
