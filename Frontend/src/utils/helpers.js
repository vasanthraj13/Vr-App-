export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return new Error(error.response.data.message || 'Server error occurred');
  } else if (error.request) {
    // No response received
    return new Error('No response from server. Please check your connection.');
  } else {
    // Request setup error
    return new Error('Error setting up the request.');
  }
};

export const formatDimensions = (value, unit = 'metric') => {
  if (unit === 'metric') {
    return `${value} m`;
  }
  return `${(value * 3.28084).toFixed(2)} ft`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};