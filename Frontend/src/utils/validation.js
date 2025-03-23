export const validateProjectData = (data) => {
  const errors = {};

  if (!data.name) {
    errors.name = 'Project name is required';
  }

  if (!data.dimensions) {
    errors.dimensions = 'Dimensions are required';
  } else {
    if (!data.dimensions.width || data.dimensions.width <= 0) {
      errors.dimensions = 'Invalid width dimension';
    }
    if (!data.dimensions.length || data.dimensions.length <= 0) {
      errors.dimensions = 'Invalid length dimension';
    }
    if (!data.dimensions.height || data.dimensions.height <= 0) {
      errors.dimensions = 'Invalid height dimension';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateVRCompatibility = () => {
  return {
    webVR: 'xr' in navigator,
    webXR: 'xr' in navigator && navigator.xr !== null,
    orientation: 'DeviceOrientationEvent' in window,
    motion: 'DeviceMotionEvent' in window
  };
};

export const validateUserPreferences = (preferences) => {
  const errors = {};

  if (!preferences.defaultQuality || 
      !Object.values(VR_SETTINGS.QUALITY_LEVELS).includes(preferences.defaultQuality)) {
    errors.defaultQuality = 'Invalid quality level';
  }

  if (!preferences.units || 
      !Object.values(VR_SETTINGS.MEASUREMENT_UNITS).includes(preferences.units)) {
    errors.units = 'Invalid measurement unit';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};