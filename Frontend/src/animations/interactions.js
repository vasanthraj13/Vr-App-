/**
 * Object interaction animations for VR Architecture App
 * Contains animation configurations for user interactions with 3D objects
 */

import { Animated, Easing } from 'react-native';
import { DURATIONS, EASING } from './transitions';
import * as THREE from 'three';

// Hover effect configurations
export const HOVER_EFFECTS = {
  HIGHLIGHT: {
    material: {
      emissive: new THREE.Color(0x555555),
      emissiveIntensity: 0.5
    },
    scale: 1.05,
    duration: DURATIONS.SHORT
  },
  GLOW: {
    material: {
      emissive: new THREE.Color(0x3377ff),
      emissiveIntensity: 0.8
    },
    outline: {
      color: 0x3377ff,
      thickness: 2
    },
    duration: DURATIONS.SHORT
  },
  SUBTLE: {
    material: {
      emissive: new THREE.Color(0x222222),
      emissiveIntensity: 0.3
    },
    scale: 1.02,
    duration: DURATIONS.SHORT
  }
};

// Selection effect configurations
export const SELECTION_EFFECTS = {
  PRIMARY: {
    material: {
      emissive: new THREE.Color(0x4488ff),
      emissiveIntensity: 0.7
    },
    outline: {
      color: 0x4488ff,
      thickness: 3
    },
    pulseAnimation: true,
    duration: DURATIONS.MEDIUM
  },
  SECONDARY: {
    material: {
      emissive: new THREE.Color(0x22cc88),
      emissiveIntensity: 0.6
    },
    outline: {
      color: 0x22cc88,
      thickness: 2
    },
    duration: DURATIONS.MEDIUM
  }
};

// Drag interaction animations
export const DRAG_EFFECTS = {
  START: {
    material: {
      transparent: true,
      opacity: 0.8
    },
    outline: {
      color: 0x44aaff,
      thickness: 2
    },
    shadow: {
      opacity: 0.7,
      blur: 15
    }
  },
  VALID_POSITION: {
    material: {
      emissive: new THREE.Color(0x22cc66),
      emissiveIntensity: 0.5
    },
    outline: {
      color: 0x22cc66,
      thickness: 2
    }
  },
  INVALID_POSITION: {
    material: {
      emissive: new THREE.Color(0xcc4422),
      emissiveIntensity: 0.5
    },
    outline: {
      color: 0xcc4422,
      thickness: 2
    }
  }
};

// Object placement animations
export const PLACEMENT_ANIMATIONS = {
  DROP: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.STANDARD,
    startY: 50, // Starting Y position relative to final position
    bounceHeight: 5,
    bounceDuration: DURATIONS.SHORT
  },
  FADE_IN: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.DECELERATE,
    startScale: 0.8,
    startOpacity: 0.5
  },
  SNAP: {
    duration: DURATIONS.SHORT,
    easing: EASING.SHARP,
    scaleEffect: 1.05, // Brief scale up before settling
    snapBackDuration: DURATIONS.SHORT / 2
  }
};

// Furniture manipulation animations
export const FURNITURE_ANIMATIONS = {
  ROTATE: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.STANDARD,
    indicatorColor: 0x44aaff,
    indicatorOpacity: 0.7
  },
  RESIZE: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.STANDARD,
    handleColor: 0x44aaff,
    handleHighlightColor: 0x88ccff,
    gridSnap: true
  },
  DELETE: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.ACCELERATE,
    shrinkEffect: true,
    fadeEffect: true
  }
};

// Camera movement animations
export const CAMERA_ANIMATIONS = {
  PAN: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.DECELERATE,
    dampingFactor: 0.85
  },
  ZOOM: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.STANDARD,
    minFOV: 20,
    maxFOV: 75,
    dampingFactor: 0.9
  },
  ORBIT: {
    duration: DURATIONS.MEDIUM,
    easing: EASING.STANDARD,
    dampingFactor: 0.8,
    rotationSpeed: 0.5
  },
  FOCUS_OBJECT: {
    duration: DURATIONS.LONG,
    easing: EASING.DECELERATE,
    paddingFactor: 1.2 // Extra space around focused object
  }
};

/**
 * Create a pulsing animation for selected objects
 * @param {Object} animatedValue - Animated value to drive the pulse
 * @param {Object} options - Configuration options
 * @returns {Object} Animation controller with start/stop methods
 */
export const createPulseAnimation = (animatedValue, options = {}) => {
  const {
    minValue = 0.95,
    maxValue = 1.05,
    duration = DURATIONS.LONG,
    easing = EASING.STANDARD
  } = options;

  const pulseSequence = Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: maxValue,
      duration: duration / 2,
      easing,
      useNativeDriver: true
    }),
    Animated.timing(animatedValue, {
      toValue: minValue,
      duration: duration / 2,
      easing,
      useNativeDriver: true
    })
  ]);

  const loopedAnimation = Animated.loop(pulseSequence);
  
  return {
    start: () => loopedAnimation.start(),
    stop: () => {
      loopedAnimation.stop();
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: DURATIONS.SHORT,
        easing: EASING.STANDARD,
        useNativeDriver: true
      }).start();
    }
  };
};

/**
 * Apply hover effect to a Three.js object
 * @param {Object} object - Three.js object
 * @param {String} effectType - Type of hover effect
 * @param {Boolean} isHovered - Whether object is hovered
 */
export const applyHoverEffect = (object, effectType = 'HIGHLIGHT', isHovered = true) => {
  const effect = HOVER_EFFECTS[effectType];
  
  if (!effect || !object) return;
  
  // Store original material properties if needed
  if (isHovered && !object.userData.originalMaterial) {
    object.userData.originalMaterial = {
      emissive: object.material.emissive.clone(),
      emissiveIntensity: object.material.emissiveIntensity,
      scale: object.scale.clone()
    };
    
    // Apply hover effect
    if (effect.material) {
      if (effect.material.emissive) {
        object.material.emissive.copy(effect.material.emissive);
      }
      if (effect.material.emissiveIntensity !== undefined) {
        object.material.emissiveIntensity = effect.material.emissiveIntensity;
      }
    }
    
    // Apply scale effect
    if (effect.scale) {
      object.scale.multiplyScalar(effect.scale);
    }
  } 
  // Restore original properties
  else if (!isHovered && object.userData.originalMaterial) {
    if (object.userData.originalMaterial.emissive) {
      object.material.emissive.copy(object.userData.originalMaterial.emissive);
    }
    if (object.userData.originalMaterial.emissiveIntensity !== undefined) {
      object.material.emissiveIntensity = object.userData.originalMaterial.emissiveIntensity;
    }
    if (object.userData.originalMaterial.scale) {
      object.scale.copy(object.userData.originalMaterial.scale);
    }
    
    delete object.userData.originalMaterial;
  }
};