/**
 * Screen transitions for VR Architecture App
 * Contains animation configurations for transitioning between screens and states
 */

import { Animated, Easing } from 'react-native';

// Standard durations
export const DURATIONS = {
  SHORT: 200,
  MEDIUM: 350, 
  LONG: 500,
  EXTRA_LONG: 800
};

// Easing presets
export const EASING = {
  STANDARD: Easing.bezier(0.4, 0.0, 0.2, 1),
  ACCELERATE: Easing.bezier(0.4, 0.0, 1, 1),
  DECELERATE: Easing.bezier(0.0, 0.0, 0.2, 1),
  SHARP: Easing.bezier(0.4, 0.0, 0.6, 1)
};

// Fade transitions
export const fadeIn = (duration = DURATIONS.MEDIUM) => ({
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: {
    duration,
    easing: EASING.STANDARD
  }
});

export const fadeOut = (duration = DURATIONS.MEDIUM) => ({
  from: { opacity: 1 },
  to: { opacity: 0 },
  config: {
    duration,
    easing: EASING.STANDARD
  }
});

// Slide transitions
export const slideInRight = (duration = DURATIONS.MEDIUM) => ({
  from: { transform: [{ translateX: 100 }], opacity: 0 },
  to: { transform: [{ translateX: 0 }], opacity: 1 },
  config: {
    duration,
    easing: EASING.DECELERATE
  }
});

export const slideOutLeft = (duration = DURATIONS.MEDIUM) => ({
  from: { transform: [{ translateX: 0 }], opacity: 1 },
  to: { transform: [{ translateX: -100 }], opacity: 0 },
  config: {
    duration,
    easing: EASING.ACCELERATE
  }
});

// VR-specific transitions
export const vrFadeIn = (duration = DURATIONS.LONG) => ({
  from: { opacity: 0, transform: [{ scale: 0.9 }] },
  to: { opacity: 1, transform: [{ scale: 1 }] },
  config: {
    duration,
    easing: EASING.DECELERATE
  }
});

export const vrZoomIn = (duration = DURATIONS.EXTRA_LONG) => ({
  from: { transform: [{ scale: 0 }], opacity: 0 },
  to: { transform: [{ scale: 1 }], opacity: 1 },
  config: {
    duration,
    easing: EASING.STANDARD
  }
});

// Screen transition presets
export const SCREEN_TRANSITIONS = {
  DEFAULT: {
    enter: fadeIn(),
    exit: fadeOut()
  },
  SLIDE: {
    enter: slideInRight(),
    exit: slideOutLeft()
  },
  VR_MODE: {
    enter: vrFadeIn(DURATIONS.LONG),
    exit: fadeOut(DURATIONS.SHORT)
  }
};

// Modal transition presets
export const MODAL_TRANSITIONS = {
  DEFAULT: {
    enter: vrZoomIn(DURATIONS.MEDIUM),
    exit: fadeOut(DURATIONS.SHORT)
  }
};

/**
 * Creates a reusable animated sequence
 * @param {Array} animations - Array of animation configurations
 * @returns {Function} - Function to start the animation sequence
 */
export const createAnimationSequence = (animations) => {
  return (callback) => {
    const sequence = Animated.sequence(
      animations.map(anim => 
        Animated.timing(anim.value, {
          toValue: anim.toValue,
          duration: anim.duration || DURATIONS.MEDIUM,
          easing: anim.easing || EASING.STANDARD,
          useNativeDriver: true
        })
      )
    );
    
    if (callback) {
      sequence.start(callback);
    } else {
      sequence.start();
    }
    
    return sequence;
  };
};