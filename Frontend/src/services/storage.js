
// services/storage.js
const STORAGE_PREFIX = 'vr_architect_';

export const storage = {
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
