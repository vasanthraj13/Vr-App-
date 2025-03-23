/**
 * Color palette for VR Architecture App
 * Defines the color scheme for the entire application
 */

// Main palette
const palette = {
  // Primary colors
  primary: {
    light: '#4D9CFF',
    main: '#0066CC',
    dark: '#004C99',
    contrast: '#FFFFFF'
  },
  
  // Secondary colors
  secondary: {
    light: '#6CD9A7',
    main: '#26B374',
    dark: '#128F55',
    contrast: '#FFFFFF'
  },
  
  // Accent colors for highlighting and special elements
  accent: {
    light: '#FFB84D',
    main: '#FF9500',
    dark: '#D67E00',
    contrast: '#000000'
  },
  
  // Neutrals
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F8F9FB',
    lightest: '#F0F2F5',
    lighter: '#E1E5EB',
    light: '#C5CCD6',
    medium: '#A9B2BD',
    dark: '#646E7A',
    darker: '#424B56',
    darkest: '#292F36',
    black: '#000000'
  },
  
  // Error states
  error: {
    light: '#FF8A80',
    main: '#FF5252',
    dark: '#C41C1C',
    contrast: '#FFFFFF'
  },
  
  // Warning states
  warning: {
    light: '#FFD180',
    main: '#FFAB40',
    dark: '#D68F00',
    contrast: '#000000'
  },
  
  // Success states
  success: {
    light: '#A8E6CF',
    main: '#4CAF50',
    dark: '#388E3C',
    contrast: '#FFFFFF'
  },
  
  // Info states
  info: {
    light: '#80D8FF',
    main: '#29B6F6',
    dark: '#0288D1',
    contrast: '#FFFFFF'
  }
};

// UI specific colors
export const ui = {
  background: {
    default: palette.neutral.offWhite,
    paper: palette.neutral.white,
    elevated: palette.neutral.white,
    disabled: palette.neutral.lighter
  },
  text: {
    primary: palette.neutral.darkest,
    secondary: palette.neutral.darker,
    tertiary: palette.neutral.dark,
    disabled: palette.neutral.medium,
    inverse: palette.neutral.white
  },
  border: {
    light: palette.neutral.lighter,
    default: palette.neutral.light,
    focus: palette.primary.main
  },
  action: {
    active: palette.primary.main,
    hover: palette.primary.light,
    selected: palette.primary.light,
    disabled: palette.neutral.light
  },
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)'
  },
  overlay: 'rgba(0, 0, 0, 0.5)'
};

// VR environment colors
export const vr = {
  environment: {
    sky: '#87CEEB',
    ground: '#E1E5EB',
    ambient: '#FFFFFF',
    fog: '#F0F2F5'
  },
  grid: {
    primary: palette.neutral.light,
    secondary: palette.neutral.lighter,
    axis: {
      x: '#FF5252',
      y: '#4CAF50',
      z: '#2196F3'
    }
  },
  selection: {
    outline: palette.primary.main,
    highlight: palette.primary.light
  },
  controls: {
    handles: {
      translate: '#2196F3',
      rotate: '#FF9800',
      scale: '#4CAF50'
    }
  },
  placement: {
    valid: palette.success.main,
    invalid: palette.error.main,
    shadow: 'rgba(0, 0, 0, 0.2)'
  }
};

// Material presets for 3D objects
export const materials = {
  wall: {
    interior: '#FFFFFF',
    exterior: '#F0F2F5'
  },
  floor: {
    wood: '#D7BC8D',
    carpet: '#C5CCD6',
    tile: '#E1E5EB',
    marble: '#ECECEC'
  },
  glass: 'rgba(200, 230, 255, 0.2)',
  metal: {
    chrome: '#C0C0C0',
    brushed: '#A9A9A9',
    gold: '#FFD700'
  },
  fabric: {
    neutral: '#C5CCD6',
    accent: palette.accent.light
  }
};

// Theme variations
export const themes = {
  light: {
    ...palette,
    ui: {
      ...ui
    },
    vr: {
      ...vr
    }
  },
  dark: {
    ...palette,
    primary: {
      ...palette.primary,
      light: '#5DAAFF',
      main: '#1A75D2',
      dark: '#0A5CAA'
    },
    ui: {
      background: {
        default: '#1A1D21',
        paper: '#292F36',
        elevated: '#353B43',
        disabled: '#424B56'
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#E1E5EB',
        tertiary: '#C5CCD6',
        disabled: '#646E7A',
        inverse: '#292F36'
      },
      border: {
        light: '#424B56',
        default: '#646E7A',
        focus: palette.primary.light
      },
      action: {
        active: palette.primary.light,
        hover: palette.primary.main,
        selected: palette.primary.main,
        disabled: '#424B56'
      },
      shadow: {
        light: 'rgba(0, 0, 0, 0.2)',
        medium: 'rgba(0, 0, 0, 0.4)',
        dark: 'rgba(0, 0, 0, 0.6)'
      },
      overlay: 'rgba(0, 0, 0, 0.7)'
    },
    vr: {
      environment: {
        sky: '#1A1D21',
        ground: '#292F36',
        ambient: '#646E7A',
        fog: '#1A1D21'
      },
      grid: {
        primary: '#424B56',
        secondary: '#353B43',
        axis: {
          x: '#FF5252',
          y: '#4CAF50',
          z: '#2196F3'
        }
      }
    }
  }
};

// Accessibility variations (high contrast)
export const accessibilityThemes = {
  highContrast: {
    ...palette,
    primary: {
      light: '#4D9CFF',
      main: '#0044AA',
      dark: '#002266',
      contrast: '#FFFFFF'
    },
    ui: {
      text: {
        primary: '#000000',
        secondary: '#292F36',
        tertiary: '#424B56',
        disabled: '#646E7A',
        inverse: '#FFFFFF'
      },
      border: {
        light: '#A9B2BD',
        default: '#646E7A',
        focus: '#0044AA'
      }
    }
  }
};

// Export palette and all theme variations
export default {
  palette,
  ui,
  vr,
  materials,
  themes,
  accessibilityThemes,
  
  // Helper function to get rgba from hex
  getRgba: (hex, alpha = 1) => {
    const hexColor = hex.replace('#', '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Create gradient string
  createGradient: (direction, startColor, endColor) => {
    return `linear-gradient(${direction}, ${startColor}, ${endColor})`;
  }
};